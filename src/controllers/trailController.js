const path = require("path");
const fs = require("fs");

const Trail = require("../models/trail");
const User = require("../models/user");
const {
	successResponse,
	errorResponse,
	TRAIL_MESSAGES,
	TRAIL_ERROR_CODES,
	USER_ERROR_CODES,
} = require("../utils/responses");

const trailController = {
	getTrail: async (req, res) => {
		try {
			const { trailId } = req.params;

			const trailIdNum = parseInt(trailId);
			if (isNaN(trailIdNum)) {
				return res.status(400).json(errorResponse("ID da trilha inválido", "INVALID_DATA"));
			}

			const trail = await Trail.getTrailWithDetails(trailIdNum);

			res.status(200).json(successResponse(TRAIL_MESSAGES.TRAIL_LOADED, { trail }));
		} catch (error) {
			console.error("Get trail error:", error);

			if (error.message === "TRAIL_NOT_FOUND") {
				return res
					.status(404)
					.json(errorResponse(TRAIL_MESSAGES.TRAIL_NOT_FOUND, TRAIL_ERROR_CODES.TRAIL_NOT_FOUND));
			}

			res.status(500).json(errorResponse("Erro interno do servidor", "INTERNAL_ERROR"));
		}
	},

	toggleFavorite: async (req, res) => {
		try {
			const { trailId } = req.params;
			const userId = req.userId;

			// Validate trailId is a number
			const trailIdNum = parseInt(trailId);
			if (isNaN(trailIdNum)) {
				return res.status(400).json(errorResponse("ID da trilha inválido", "INVALID_DATA"));
			}

			const trailExists = Trail.exists(trailIdNum);
			if (!trailExists) {
				return res
					.status(404)
					.json(errorResponse(TRAIL_MESSAGES.TRAIL_NOT_FOUND, TRAIL_ERROR_CODES.TRAIL_NOT_FOUND));
			}

			const result = await User.toggleFavorite(userId, trailIdNum);

			const message = result.action === "added" ? TRAIL_MESSAGES.FAVORITE_ADDED : TRAIL_MESSAGES.FAVORITE_REMOVED;

			res.status(200).json(successResponse(message));
		} catch (error) {
			console.error("Toggle favorite error:", error);

			if (error.message === "USER_NOT_FOUND") {
				return res.status(404).json(errorResponse("Usuário não encontrado", USER_ERROR_CODES.USER_NOT_FOUND));
			}

			res.status(500).json(errorResponse("Erro interno do servidor", "INTERNAL_ERROR"));
		}
	},

	getAllTrails: async (req, res) => {
		try {
			const trails = await Trail.getAllWithStats();

			res.status(200).json(successResponse("Trilhas carregadas com sucesso", { trails }));
		} catch (error) {
			console.error("Get all trails error:", error);
			res.status(500).json(errorResponse("Erro interno do servidor", "INTERNAL_ERROR"));
		}
	},

	downloadTrailFile: (req, res) => {
		try {
			const { trailId, fileType } = req.params;
			const trailIdNum = parseInt(trailId);

			if (!Trail.exists(trailIdNum)) {
				return res
					.status(404)
					.json(errorResponse(TRAIL_MESSAGES.TRAIL_NOT_FOUND, TRAIL_ERROR_CODES.TRAIL_NOT_FOUND));
			}

			const filePath = path.join(__dirname, "..", "..", "trail_files", trailId, `trail.${fileType}`);

			if (!fs.existsSync(filePath)) {
				console.error(`File not found for trail ${trailId}: ${filePath}`);
				return res.status(404).json(errorResponse("Arquivo de trilha não encontrado", "FILE_NOT_FOUND"));
			}

			res.download(filePath, `trilha_${trailId}.${fileType}`, (err) => {
				if (err) {
					console.error("Error sending file:", err);
					if (!res.headersSent) {
						res.status(500).json(errorResponse("Erro ao baixar o arquivo", "DOWNLOAD_ERROR"));
					}
				}
			});
		} catch (error) {
			console.error("Download trail file error:", error);
			res.status(500).json(errorResponse("Erro interno do servidor", "INTERNAL_ERROR"));
		}
	},
};

module.exports = trailController;
