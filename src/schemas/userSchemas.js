/**
 * Copyright (c) 2025 Tanese. All Rights Reserved.
 *
 * This software is proprietary and confidential. Unauthorized copying, distribution,
 * modification, or use of this software is strictly prohibited.
 */

const userRegistrationSchema = {
	type: "object",
	required: ["username", "email", "password"],
	properties: {
		username: {
			type: "string",
			minLength: 1,
			maxLength: 50,
			pattern: "^[a-zA-Z0-9_-]+$",
		},
		email: {
			type: "string",
			format: "email",
			maxLength: 254,
		},
		password: {
			type: "string",
			minLength: 6,
			maxLength: 128,
		},
	},
	additionalProperties: false,
};

const userLoginSchema = {
	type: "object",
	required: ["email", "password"],
	properties: {
		email: {
			type: "string",
			format: "email",
			maxLength: 254,
		},
		password: {
			type: "string",
			minLength: 1,
			maxLength: 128,
		},
	},
	additionalProperties: false,
};

const userProfileUpdateSchema = {
	type: "object",
	properties: {
		username: {
			type: "string",
			minLength: 1,
			maxLength: 50,
			pattern: "^[a-zA-Z0-9_-]+$",
		},
		bio: {
			type: "string",
			maxLength: 500,
		},
		profilePicUrl: {
			type: "string",
			format: "uri",
			maxLength: 2048,
		},
	},
	additionalProperties: false,
	minProperties: 1,
};

const changePasswordSchema = {
	type: "object",
	required: ["currentPassword", "newPassword"],
	properties: {
		currentPassword: {
			type: "string",
			minLength: 1,
			maxLength: 128,
		},
		newPassword: {
			type: "string",
			minLength: 6,
			maxLength: 128,
		},
	},
	additionalProperties: false,
};

module.exports = {
	userRegistrationSchema,
	userLoginSchema,
	userProfileUpdateSchema,
	changePasswordSchema,
};
