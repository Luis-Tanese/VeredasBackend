const express = require("express");
const router = express.Router();

const reviewController = require("../controllers/reviewController");
const { authenticateToken } = require("../middleware/auth");
const { validateSchema, validateParams } = require("../middleware/validation");
const { createReviewSchema, updateReviewSchema, reviewParamsSchema } = require("../schemas/reviewSchemas");

// POST /api/reviews
router.post("/", authenticateToken, validateSchema(createReviewSchema), reviewController.createReview);

// PUT /api/reviews/:reviewId
router.put(
	"/:reviewId",
	authenticateToken,
	validateParams(reviewParamsSchema),
	validateSchema(updateReviewSchema),
	reviewController.updateReview
);

// DELETE /api/reviews/:reviewId
router.delete("/:reviewId", authenticateToken, validateParams(reviewParamsSchema), reviewController.deleteReview);

// GET /api/reviews/:reviewId
router.get("/:reviewId", validateParams(reviewParamsSchema), reviewController.getReview);

// GET /api/reviews/trail/:trailId
router.get("/trail/:trailId", reviewController.getTrailReviews);

// GET /api/reviews
router.get("/", reviewController.getAllReviews);

module.exports = router;
