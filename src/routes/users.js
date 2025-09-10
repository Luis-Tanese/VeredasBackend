/**
 * Copyright (c) 2025 Tanese. All Rights Reserved.
 *
 * This software is proprietary and confidential. Unauthorized copying, distribution,
 * modification, or use of this software is strictly prohibited.
 */

const express = require("express");
const router = express.Router();

const userController = require("../controllers/userController");
const { authenticateToken } = require("../middleware/auth");
const { validateSchema } = require("../middleware/validation");
const { userProfileUpdateSchema, changePasswordSchema } = require("../schemas/userSchemas");

// GET /api/users/profile
router.get("/profile", authenticateToken, userController.getProfile);

// PUT /api/users/profile
router.put("/profile", authenticateToken, validateSchema(userProfileUpdateSchema), userController.updateProfile);

// GET /api/users/my-reviews
router.get("/my-reviews", authenticateToken, userController.getMyReviews);

// PUT /api/users/change-password
router.put("/change-password", authenticateToken, validateSchema(changePasswordSchema), userController.changePassword);

// DELETE /api/users/account
router.delete("/account", authenticateToken, userController.deleteAccount);

module.exports = router;
