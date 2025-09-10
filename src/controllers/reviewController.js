/**
 * Copyright (c) 2025 Tanese. All Rights Reserved.
 *
 * This software is proprietary and confidential. Unauthorized copying, distribution,
 * modification, or use of this software is strictly prohibited.
 */

const Review = require("../models/review");
const {
	successResponse,
	errorResponse,
	REVIEW_MESSAGES,
	REVIEW_ERROR_CODES,
	TRAIL_ERROR_CODES,
	USER_ERROR_CODES,
} = require("../utils/responses");

const reviewController = {
	createReview: async (req, res) => {
		try {
			const reviewData = req.body;
			const userId = req.userId;

			const review = await Review.create(reviewData, userId);

			res.status(201).json(successResponse(REVIEW_MESSAGES.REVIEW_CREATED, { review }));
		} catch (error) {
			console.error("Create review error:", error);

			if (error.message === "ALREADY_REVIEWED") {
				return res
					.status(400)
					.json(errorResponse(REVIEW_MESSAGES.ALREADY_REVIEWED, REVIEW_ERROR_CODES.ALREADY_REVIEWED));
			}

			if (error.message === "TRAIL_NOT_FOUND") {
				return res.status(404).json(errorResponse("Trilha não encontrada", TRAIL_ERROR_CODES.TRAIL_NOT_FOUND));
			}

			if (error.message === "USER_NOT_FOUND") {
				return res.status(404).json(errorResponse("Usuário não encontrado", USER_ERROR_CODES.USER_NOT_FOUND));
			}

			res.status(500).json(errorResponse("Erro interno do servidor", "INTERNAL_ERROR"));
		}
	},

	updateReview: async (req, res) => {
		try {
			const { reviewId } = req.params;
			const updateData = req.body;
			const userId = req.userId;

			const updatedReview = await Review.update(reviewId, updateData, userId);

			res.status(200).json(successResponse(REVIEW_MESSAGES.REVIEW_UPDATED, { review: updatedReview }));
		} catch (error) {
			console.error("Update review error:", error);

			if (error.message === "REVIEW_NOT_FOUND") {
				return res
					.status(404)
					.json(errorResponse(REVIEW_MESSAGES.REVIEW_NOT_FOUND, REVIEW_ERROR_CODES.REVIEW_NOT_FOUND));
			}

			if (error.message === "CANNOT_EDIT_REVIEW") {
				return res
					.status(403)
					.json(errorResponse(REVIEW_MESSAGES.CANNOT_EDIT_REVIEW, REVIEW_ERROR_CODES.CANNOT_EDIT_REVIEW));
			}

			res.status(500).json(errorResponse("Erro interno do servidor", "INTERNAL_ERROR"));
		}
	},

	deleteReview: async (req, res) => {
		try {
			const { reviewId } = req.params;
			const userId = req.userId;

			await Review.delete(reviewId, userId);

			res.status(200).json(successResponse(REVIEW_MESSAGES.REVIEW_DELETED));
		} catch (error) {
			console.error("Delete review error:", error);

			if (error.message === "REVIEW_NOT_FOUND") {
				return res
					.status(404)
					.json(errorResponse(REVIEW_MESSAGES.REVIEW_NOT_FOUND, REVIEW_ERROR_CODES.REVIEW_NOT_FOUND));
			}

			if (error.message === "CANNOT_DELETE_REVIEW") {
				return res
					.status(403)
					.json(errorResponse(REVIEW_MESSAGES.CANNOT_DELETE_REVIEW, REVIEW_ERROR_CODES.CANNOT_DELETE_REVIEW));
			}

			res.status(500).json(errorResponse("Erro interno do servidor", "INTERNAL_ERROR"));
		}
	},

	getReview: async (req, res) => {
		try {
			const { reviewId } = req.params;

			const review = await Review.findById(reviewId);

			if (!review) {
				return res
					.status(404)
					.json(errorResponse(REVIEW_MESSAGES.REVIEW_NOT_FOUND, REVIEW_ERROR_CODES.REVIEW_NOT_FOUND));
			}

			res.status(200).json(successResponse("Avaliação carregada com sucesso", { review }));
		} catch (error) {
			console.error("Get review error:", error);
			res.status(500).json(errorResponse("Erro interno do servidor", "INTERNAL_ERROR"));
		}
	},

	getTrailReviews: async (req, res) => {
		try {
			const { trailId } = req.params;

			const reviews = await Review.getByTrailId(parseInt(trailId));

			res.status(200).json(successResponse("Avaliações carregadas com sucesso", { reviews }));
		} catch (error) {
			console.error("Get trail reviews error:", error);
			res.status(500).json(errorResponse("Erro interno do servidor", "INTERNAL_ERROR"));
		}
	},

	getAllReviews: async (req, res) => {
		try {
			const reviews = await Review.getAll();

			res.status(200).json(successResponse("Todas as avaliações carregadas com sucesso", { reviews }));
		} catch (error) {
			console.error("Get all reviews error:", error);
			res.status(500).json(errorResponse("Erro interno do servidor", "INTERNAL_ERROR"));
		}
	},

	getTrailStats: async (req, res) => {
		try {
			const { trailId } = req.params;

			const stats = await Review.getTrailStats(parseInt(trailId));

			res.status(200).json(successResponse("Estatísticas da trilha carregadas com sucesso", { stats }));
		} catch (error) {
			console.error("Get trail stats error:", error);
			res.status(500).json(errorResponse("Erro interno do servidor", "INTERNAL_ERROR"));
		}
	},
};

module.exports = reviewController;
