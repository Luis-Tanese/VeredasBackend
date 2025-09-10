/**
 * Copyright (c) 2025 Tanese. All Rights Reserved.
 *
 * This software is proprietary and confidential. Unauthorized copying, distribution,
 * modification, or use of this software is strictly prohibited.
 */

const User = require("../models/user");
const { successResponse, errorResponse, USER_MESSAGES, USER_ERROR_CODES } = require("../utils/responses");

const userController = {
	getProfile: async (req, res) => {
		try {
			const userResponse = User.formatUserResponse(req.user);

			res.status(200).json(successResponse(USER_MESSAGES.PROFILE_LOADED, { user: userResponse }));
		} catch (error) {
			console.error("Get profile error:", error);
			res.status(500).json(errorResponse("Erro interno do servidor", "INTERNAL_ERROR"));
		}
	},

	updateProfile: async (req, res) => {
		try {
			const updateData = req.body;
			const userId = req.userId;

			const updatedUser = await User.updateProfile(userId, updateData);

			if (!updatedUser) {
				return res
					.status(404)
					.json(errorResponse(USER_MESSAGES.USER_NOT_FOUND, USER_ERROR_CODES.USER_NOT_FOUND));
			}

			const userResponse = User.formatUserResponse(updatedUser);

			res.status(200).json(successResponse(USER_MESSAGES.PROFILE_UPDATED, { user: userResponse }));
		} catch (error) {
			console.error("Update profile error:", error);

			if (error.message === "USERNAME_EXISTS") {
				return res
					.status(400)
					.json(errorResponse(USER_MESSAGES.USERNAME_IN_USE, USER_ERROR_CODES.USERNAME_EXISTS));
			}

			res.status(500).json(errorResponse("Erro interno do servidor", "INTERNAL_ERROR"));
		}
	},

	getMyReviews: async (req, res) => {
		try {
			const userId = req.userId;

			const reviews = await User.getUserReviews(userId);

			res.status(200).json(successResponse(USER_MESSAGES.REVIEWS_LOADED, { reviews }));
		} catch (error) {
			console.error("Get user reviews error:", error);
			res.status(500).json(errorResponse("Erro interno do servidor", "INTERNAL_ERROR"));
		}
	},

	changePassword: async (req, res) => {
		try {
			const { currentPassword, newPassword } = req.body;
			const userId = req.userId;

			await User.changePassword(userId, currentPassword, newPassword);

			res.status(200).json(successResponse(USER_MESSAGES.PASSWORD_CHANGED));
		} catch (error) {
			console.error("Change password error:", error);

			if (error.message === "USER_NOT_FOUND") {
				return res
					.status(404)
					.json(errorResponse(USER_MESSAGES.USER_NOT_FOUND, USER_ERROR_CODES.USER_NOT_FOUND));
			}

			if (error.message === "INVALID_CURRENT_PASSWORD") {
				return res
					.status(401)
					.json(
						errorResponse(
							USER_MESSAGES.CURRENT_PASSWORD_INCORRECT,
							USER_ERROR_CODES.INVALID_CURRENT_PASSWORD
						)
					);
			}

			res.status(500).json(errorResponse("Erro interno do servidor", "INTERNAL_ERROR"));
		}
	},

	deleteAccount: async (req, res) => {
		try {
			const userId = req.userId;

			await User.deleteAccount(userId);

			res.status(200).json(successResponse(USER_MESSAGES.ACCOUNT_DELETED));
		} catch (error) {
			console.error("Delete account error:", error);
			res.status(500).json(errorResponse("Erro interno do servidor", "INTERNAL_ERROR"));
		}
	},
};

module.exports = userController;
