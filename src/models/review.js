/**
 * Copyright (c) 2025 Tanese. All Rights Reserved.
 *
 * This software is proprietary and confidential. Unauthorized copying, distribution,
 * modification, or use of this software is strictly prohibited.
 */

const { ObjectId } = require("mongodb");
const { getReviewsCollection } = require("../utils/database");
const User = require("./user");

class Review {
    constructor(reviewData) {
        this.trailId = reviewData.trailId;
        this.trailName = reviewData.trailName;
        this.userId = reviewData.userId;
        this.username = reviewData.username;
        this.userProfilePic = reviewData.userProfilePic;
        this.rating = reviewData.rating;
        this.review = reviewData.review;
        this.createdAt = reviewData.createdAt || new Date();
        this.updatedAt = reviewData.updatedAt || new Date();
    }

    static async syncUserData(review) {
        try {
            const currentUser = await User.findById(review.userId);

            if (currentUser) {
                return {
                    ...review,
                    username: currentUser.username,
                    userProfilePic: currentUser.profilePicUrl,
                };
            } else {
                return {
                    ...review,
                    username: "Usuário Deletado",
                    userProfilePic: "",
                };
            }
        } catch (error) {
            return {
                ...review,
                username: "Usuário Deletado",
                userProfilePic: "",
            };
        }
    }

    static async syncMultipleReviews(reviews) {
        return await Promise.all(
            reviews.map((review) => Review.syncUserData(review))
        );
    }

    static async create(reviewData, userId) {
        const reviewsCollection = await getReviewsCollection();
        const Trail = require("./trail");

        if (!Trail.exists(reviewData.trailId)) {
            throw new Error("TRAIL_NOT_FOUND");
        }

        const actualTrail = Trail.findById(reviewData.trailId);
        if (!actualTrail) {
            throw new Error("TRAIL_NOT_FOUND");
        }

        const correctedReviewData = {
            ...reviewData,
            trailName: actualTrail.name,
        };

        const existingReview = await reviewsCollection.findOne({
            trailId: reviewData.trailId,
            userId: new ObjectId(userId),
        });

        if (existingReview) {
            throw new Error("ALREADY_REVIEWED");
        }

        const user = await User.findById(userId);
        if (!user) {
            throw new Error("USER_NOT_FOUND");
        }

        const review = new Review({
            ...correctedReviewData,
            userId: new ObjectId(userId),
            username: user.username,
            userProfilePic: user.profilePicUrl,
        });

        const result = await reviewsCollection.insertOne(review);
        return { ...review, _id: result.insertedId };
    }

    static async findById(reviewId) {
        const reviewsCollection = await getReviewsCollection();
        const review = await reviewsCollection.findOne({
            _id: new ObjectId(reviewId),
        });

        if (!review) {
            return null;
        }

        return await Review.syncUserData(review);
    }

    static async update(reviewId, updateData, userId) {
        const reviewsCollection = await getReviewsCollection();

        const review = await reviewsCollection.findOne({
            _id: new ObjectId(reviewId),
        });
        if (!review) {
            throw new Error("REVIEW_NOT_FOUND");
        }

        if (!review.userId.equals(new ObjectId(userId))) {
            throw new Error("CANNOT_EDIT_REVIEW");
        }

        await reviewsCollection.updateOne(
            { _id: new ObjectId(reviewId) },
            {
                $set: {
                    ...updateData,
                    updatedAt: new Date(),
                },
            }
        );

        const updatedReview = await reviewsCollection.findOne({
            _id: new ObjectId(reviewId),
        });
        return await Review.syncUserData(updatedReview);
    }

    static async delete(reviewId, userId) {
        const reviewsCollection = await getReviewsCollection();

        const review = await reviewsCollection.findOne({
            _id: new ObjectId(reviewId),
        });
        if (!review) {
            throw new Error("REVIEW_NOT_FOUND");
        }

        if (!review.userId.equals(new ObjectId(userId))) {
            throw new Error("CANNOT_DELETE_REVIEW");
        }

        await reviewsCollection.deleteOne({ _id: new ObjectId(reviewId) });
        return true;
    }

    static async getByUserId(userId) {
        const reviewsCollection = await getReviewsCollection();

        const reviews = await reviewsCollection
            .find({ userId: new ObjectId(userId) })
            .sort({ createdAt: -1 })
            .toArray();

        return await Review.syncMultipleReviews(reviews);
    }

    static async getByTrailId(trailId) {
        const reviewsCollection = await getReviewsCollection();

        const reviews = await reviewsCollection
            .find({ trailId })
            .sort({ createdAt: -1 })
            .toArray();

        return await Review.syncMultipleReviews(reviews);
    }

    static async getAll() {
        const reviewsCollection = await getReviewsCollection();
        const reviews = await reviewsCollection
            .find({})
            .sort({ createdAt: -1 })
            .toArray();

        return await Review.syncMultipleReviews(reviews);
    }

    static async hasUserReviewed(userId, trailId) {
        const reviewsCollection = await getReviewsCollection();

        const review = await reviewsCollection.findOne({
            userId: new ObjectId(userId),
            trailId: trailId,
        });

        return !!review;
    }

    static async getTrailStats(trailId) {
        const reviewsCollection = await getReviewsCollection();

        const reviews = await reviewsCollection.find({ trailId }).toArray();

        if (reviews.length === 0) {
            return {
                totalReviews: 0,
                averageRating: 0,
                ratingDistribution: {},
            };
        }

        const totalReviews = reviews.length;
        const totalRating = reviews.reduce(
            (sum, review) => sum + review.rating,
            0
        );
        const averageRating = Math.round((totalRating / totalReviews) * 2) / 2;

        const ratingDistribution = {};
        reviews.forEach((review) => {
            const rating = review.rating;
            ratingDistribution[rating] = (ratingDistribution[rating] || 0) + 1;
        });

        return {
            totalReviews,
            averageRating,
            ratingDistribution,
        };
    }
}

module.exports = Review;
