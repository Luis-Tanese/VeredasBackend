/**
 * Copyright (c) 2025 Tanese. All Rights Reserved.
 *
 * This software is proprietary and confidential. Unauthorized copying, distribution,
 * modification, or use of this software is strictly prohibited.
 */

const express = require("express");
const router = express.Router();

const authController = require("../controllers/authController");
const { authenticateToken } = require("../middleware/auth");
const { validateSchema } = require("../middleware/validation");
const { userRegistrationSchema, userLoginSchema } = require("../schemas/userSchemas");

// POST /api/auth/register
router.post("/register", validateSchema(userRegistrationSchema), authController.register);

// POST /api/auth/login
router.post("/login", validateSchema(userLoginSchema), authController.login);

// POST /api/auth/logout
router.post("/logout", authenticateToken, authController.logout);

// GET /api/auth/verify
router.get("/verify", authenticateToken, authController.verifyToken);

module.exports = router;
