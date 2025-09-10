/**
 * Copyright (c) 2025 Tanese. All Rights Reserved.
 *
 * This software is proprietary and confidential. Unauthorized copying, distribution,
 * modification, or use of this software is strictly prohibited.
 */

const User = require("./user");
const Review = require("./review");
const trailsData = require("../info.json");

class Trail {
	static getStaticTrails() {
		return trailsData;
	}

	static exists(trailId) {
		const trailIdNum = parseInt(trailId);
		return this.getStaticTrails().some((trail) => trail.id === trailIdNum);
	}

	static findById(trailId) {
		const trailIdNum = parseInt(trailId);
		return this.getStaticTrails().find((trail) => trail.id === trailIdNum) || null;
	}

	static async getTrailWithDetails(trailId) {
		const trailIdNum = parseInt(trailId);

		const trail = this.findById(trailIdNum);
		if (!trail) {
			throw new Error("TRAIL_NOT_FOUND");
		}

		const reviews = await Review.getByTrailId(trailIdNum);
		const favorites = await User.getUsersWhoFavorited(trailIdNum);
		const reviewStats = await Review.getTrailStats(trailIdNum);

		return {
			...trail,
			reviews,
			favorites,
			reviewStats,
		};
	}

	static getAll() {
		return this.getStaticTrails();
	}

	static async getAllWithStats() {
		const trails = this.getStaticTrails();

		const trailsWithStats = await Promise.all(
			trails.map(async (trail) => {
				const reviewStats = await Review.getTrailStats(trail.id);
				return {
					...trail,
					reviewStats,
				};
			})
		);

		return trailsWithStats;
	}
}

module.exports = Trail;
