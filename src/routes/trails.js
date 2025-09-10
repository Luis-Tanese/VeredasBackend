/**
 * Copyright (c) 2025 Tanese. All Rights Reserved.
 *
 * This software is proprietary and confidential. Unauthorized copying, distribution,
 * modification, or use of this software is strictly prohibited.
 */

const express = require("express");
const router = express.Router();

const trailController = require("../controllers/trailController");
const { authenticateToken } = require("../middleware/auth");
const { validateParams } = require("../middleware/validation");
const { trailParamsSchema, trailDownloadParamsSchema } = require("../schemas/trailSchemas");

// GET /api/trails
router.get("/", trailController.getAllTrails);

// GET /api/trails/:trailId
router.get("/:trailId", validateParams(trailParamsSchema), trailController.getTrail);

// POST /api/trails/:trailId/favorite
router.post("/:trailId/favorite", authenticateToken, validateParams(trailParamsSchema), trailController.toggleFavorite);

// GET /api/trails/:trailId/download/:fileType
router.get(
	"/:trailId/download/:fileType",
	validateParams(trailDownloadParamsSchema),
	trailController.downloadTrailFile
);

module.exports = router;
