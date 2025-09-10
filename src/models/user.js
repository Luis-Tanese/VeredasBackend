/**
 * Copyright (c) 2025 Tanese. All Rights Reserved.
 *
 * This software is proprietary and confidential. Unauthorized copying, distribution,
 * modification, or use of this software is strictly prohibited.
 */

const bcrypt = require("bcryptjs");
const { ObjectId } = require("mongodb");
const { getUsersCollection, getReviewsCollection } = require("../utils/database");

class User {
	constructor(userData) {
		this.username = userData.username;
		this.email = userData.email;
		this.password = userData.password;
		this.bio = userData.bio || "";
		this.profilePicUrl = userData.profilePicUrl || "";
		this.favorites = userData.favorites || [];
		this.createdAt = userData.createdAt || new Date();
		this.updatedAt = userData.updatedAt || new Date();
	}

	async hashPassword() {
		if (this.password) {
			this.password = await bcrypt.hash(this.password, 12);
		}
	}

	static async comparePassword(plainPassword, hashedPassword) {
		return await bcrypt.compare(plainPassword, hashedPassword);
	}

	static async create(userData) {
		const usersCollection = getUsersCollection();

		const existingUser = await usersCollection.findOne({ email: userData.email });
		if (existingUser) {
			throw new Error("EMAIL_EXISTS");
		}

		const existingUsername = await usersCollection.findOne({ username: userData.username });
		if (existingUsername) {
			throw new Error("USERNAME_EXISTS");
		}

		const user = new User(userData);
		await user.hashPassword();

		const result = await usersCollection.insertOne(user);
		return { ...user, _id: result.insertedId };
	}

	static async findByEmail(email) {
		const usersCollection = getUsersCollection();
		return await usersCollection.findOne({ email });
	}

	static async findById(userId) {
		const usersCollection = getUsersCollection();
		return await usersCollection.findOne({ _id: new ObjectId(userId) }, { projection: { password: 0 } });
	}

	static async updateProfile(userId, updateData) {
		const usersCollection = getUsersCollection();

		if (updateData.username) {
			const existingUser = await usersCollection.findOne({
				username: updateData.username,
				_id: { $ne: new ObjectId(userId) },
			});
			if (existingUser) {
				throw new Error("USERNAME_EXISTS");
			}
		}

		await usersCollection.updateOne(
			{ _id: new ObjectId(userId) },
			{
				$set: {
					...updateData,
					updatedAt: new Date(),
				},
			}
		);

		return await usersCollection.findOne({ _id: new ObjectId(userId) }, { projection: { password: 0 } });
	}

	static async changePassword(userId, currentPassword, newPassword) {
		const usersCollection = getUsersCollection();

		const user = await usersCollection.findOne({ _id: new ObjectId(userId) });
		if (!user) {
			throw new Error("USER_NOT_FOUND");
		}

		const isValidPassword = await User.comparePassword(currentPassword, user.password);
		if (!isValidPassword) {
			throw new Error("INVALID_CURRENT_PASSWORD");
		}

		const hashedNewPassword = await bcrypt.hash(newPassword, 12);

		await usersCollection.updateOne(
			{ _id: new ObjectId(userId) },
			{
				$set: {
					password: hashedNewPassword,
					updatedAt: new Date(),
				},
			}
		);

		return true;
	}

	static async deleteAccount(userId) {
		const usersCollection = getUsersCollection();

		await usersCollection.deleteOne({ _id: new ObjectId(userId) });

		return true;
	}

	static async getUserReviews(userId) {
		const reviewsCollection = getReviewsCollection();

		const reviews = await reviewsCollection
			.find({ userId: new ObjectId(userId) })
			.sort({ createdAt: -1 })
			.toArray();

		return reviews;
	}

	static async toggleFavorite(userId, trailId) {
		const usersCollection = getUsersCollection();
		const user = await usersCollection.findOne({ _id: new ObjectId(userId) });

		if (!user) {
			throw new Error("USER_NOT_FOUND");
		}

		const trailIdNum = parseInt(trailId);
		const isFavorited = user.favorites.includes(trailIdNum);

		if (isFavorited) {
			await usersCollection.updateOne(
				{ _id: new ObjectId(userId) },
				{
					$pull: { favorites: trailIdNum },
					$set: { updatedAt: new Date() },
				}
			);
			return { action: "removed", isFavorited: false };
		} else {
			await usersCollection.updateOne(
				{ _id: new ObjectId(userId) },
				{
					$push: { favorites: trailIdNum },
					$set: { updatedAt: new Date() },
				}
			);
			return { action: "added", isFavorited: true };
		}
	}

	static async getUsersWhoFavorited(trailId) {
		const usersCollection = getUsersCollection();
		const trailIdNum = parseInt(trailId);

		const users = await usersCollection
			.find(
				{ favorites: trailIdNum },
				{
					projection: {
						_id: 1,
						username: 1,
						profilePicUrl: 1,
						updatedAt: 1,
					},
				}
			)
			.toArray();

		return users.map((user) => ({
			userId: user._id,
			username: user.username,
			profilePicUrl: user.profilePicUrl,
			favoritedAt: user.updatedAt,
		}));
	}

	static formatUserResponse(user) {
		const { password, ...userResponse } = user;
		return userResponse;
	}
}

module.exports = User;
