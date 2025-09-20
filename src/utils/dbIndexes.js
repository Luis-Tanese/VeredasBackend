const { getUsersCollection, getReviewsCollection } = require("./database");

async function createIndexes() {
	try {
		const usersCollection = await getUsersCollection();
		const reviewsCollection = await getReviewsCollection();

		await usersCollection.createIndex({ email: 1 }, { unique: true });
		await usersCollection.createIndex({ username: 1 }, { unique: true });

		await reviewsCollection.createIndex({ trailId: 1 });
		await reviewsCollection.createIndex({ userId: 1 });
		await reviewsCollection.createIndex({ trailId: 1, userId: 1 }, { unique: true });

		console.log("Database indexes created successfully");
	} catch (error) {
		console.error("Error creating indexes:", error);
	}
}

module.exports = { createIndexes };
