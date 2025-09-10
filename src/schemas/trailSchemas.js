/**
 * Copyright (c) 2025 Tanese. All Rights Reserved.
 *
 * This software is proprietary and confidential. Unauthorized copying, distribution,
 * modification, or use of this software is strictly prohibited.
 */

const trailParamsSchema = {
	type: "object",
	required: ["trailId"],
	properties: {
		trailId: {
			type: "string",
			pattern: "^[1-9][0-9]*$",
		},
	},
	additionalProperties: false,
};

const trailDownloadParamsSchema = {
	type: "object",
	required: ["trailId", "fileType"],
	properties: {
		trailId: {
			type: "string",
			pattern: "^[1-9][0-9]*$",
		},
		fileType: {
			type: "string",
			enum: ["kml", "gpx"],
		},
	},
	additionalProperties: false,
};

module.exports = {
	trailParamsSchema,
	trailDownloadParamsSchema,
};
