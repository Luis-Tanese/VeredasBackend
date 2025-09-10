/**
 * Copyright (c) 2025 Tanese. All Rights Reserved.
 *
 * This software is proprietary and confidential. Unauthorized copying, distribution,
 * modification, or use of this software is strictly prohibited.
 */

const User = require("../models/user");
const { generateToken } = require("../middleware/auth");
const {
	successResponse,
	errorResponse,
	AUTH_MESSAGES,
	USER_MESSAGES,
	AUTH_ERROR_CODES,
	USER_ERROR_CODES,
} = require("../utils/responses");

const authController = {
	register: async (req, res) => {
		try {
			const { username, email, password } = req.body;

			const user = await User.create({ username, email, password });

			const token = generateToken(user._id);

			const userResponse = User.formatUserResponse(user);

			res.status(201).json(successResponse(AUTH_MESSAGES.REGISTER_SUCCESS, { token, user: userResponse }));
		} catch (error) {
			console.error("Registration error:", error);

			if (error.message === "EMAIL_EXISTS") {
				return res.status(400).json(errorResponse(AUTH_MESSAGES.EMAIL_IN_USE, AUTH_ERROR_CODES.EMAIL_EXISTS));
			}

			if (error.message === "USERNAME_EXISTS") {
				return res
					.status(400)
					.json(errorResponse(USER_MESSAGES.USERNAME_IN_USE, USER_ERROR_CODES.USERNAME_EXISTS));
			}

			res.status(500).json(errorResponse("Erro interno do servidor", "INTERNAL_ERROR"));
		}
	},

	login: async (req, res) => {
		try {
			const { email, password } = req.body;

			const user = await User.findByEmail(email);
			if (!user) {
				return res
					.status(401)
					.json(errorResponse(AUTH_MESSAGES.INVALID_CREDENTIALS, AUTH_ERROR_CODES.INVALID_CREDENTIALS));
			}

			const isValidPassword = await User.comparePassword(password, user.password);
			if (!isValidPassword) {
				return res
					.status(401)
					.json(errorResponse(AUTH_MESSAGES.INVALID_CREDENTIALS, AUTH_ERROR_CODES.INVALID_CREDENTIALS));
			}

			const token = generateToken(user._id);

			const userResponse = User.formatUserResponse(user);

			res.status(200).json(successResponse(AUTH_MESSAGES.LOGIN_SUCCESS, { token, user: userResponse }));
		} catch (error) {
			console.error("Login error:", error);
			res.status(500).json(errorResponse("Erro interno do servidor", "INTERNAL_ERROR"));
		}
	},

	logout: async (req, res) => {
		try {
			res.status(200).json(successResponse(AUTH_MESSAGES.LOGOUT_SUCCESS));
		} catch (error) {
			console.error("Logout error:", error);
			res.status(500).json(errorResponse("Erro interno do servidor", "INTERNAL_ERROR"));
		}
	},

	verifyToken: async (req, res) => {
		try {
			const userResponse = User.formatUserResponse(req.user);

			res.status(200).json(successResponse("Token válido", { user: userResponse }));
		} catch (error) {
			console.error("Token verification error:", error);
			res.status(500).json(errorResponse("Erro interno do servidor", "INTERNAL_ERROR"));
		}
	},
};

module.exports = authController;
