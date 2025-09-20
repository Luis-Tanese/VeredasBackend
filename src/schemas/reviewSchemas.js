const createReviewSchema = {
	type: "object",
	required: ["trailId", "trailName", "rating", "review"],
	properties: {
		trailId: {
			type: "number",
			minimum: 1,
		},
		trailName: {
			type: "string",
			minLength: 1,
			maxLength: 100,
		},
		rating: {
			type: "number",
			minimum: 0.5,
			maximum: 5.0,
			multipleOf: 0.5,
		},
		review: {
			type: "string",
			minLength: 1,
			maxLength: 1000,
		},
	},
	additionalProperties: false,
};

const updateReviewSchema = {
	type: "object",
	properties: {
		rating: {
			type: "number",
			minimum: 0.5,
			maximum: 5.0,
			multipleOf: 0.5,
		},
		review: {
			type: "string",
			minLength: 1,
			maxLength: 1000,
		},
	},
	additionalProperties: false,
	minProperties: 1,
};

const reviewParamsSchema = {
	type: "object",
	required: ["reviewId"],
	properties: {
		reviewId: {
			type: "string",
			pattern: "^[0-9a-fA-F]{24}$",
		},
	},
	additionalProperties: false,
};

module.exports = {
	createReviewSchema,
	updateReviewSchema,
	reviewParamsSchema,
};
