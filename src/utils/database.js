/**
 * Copyright (c) 2025 Tanese. All Rights Reserved.
 *
 * This software is proprietary and confidential. Unauthorized copying, distribution,
 * modification, or use of this software is strictly prohibited.
 */

const { MongoClient } = require("mongodb");

let db = null;
let client = null;

const connectToDatabase = async () => {
	if (db) return db;

	try {
		const uri = process.env.MONGO_URI;

		client = new MongoClient(uri);

		await client.connect();
		db = client.db("veredas-db");

		console.log("Connected to MongoDB successfully");
		return db;
	} catch (error) {
		console.error("Failed to connect to MongoDB:", error);
		throw error;
	}
};

const getDatabase = () => {
	if (!db) {
		throw new Error("Database not initialized. Call connectToDatabase() first.");
	}
	return db;
};

const getUsersCollection = () => {
	return getDatabase().collection("users");
};

const getReviewsCollection = () => {
	return getDatabase().collection("reviews");
};

module.exports = {
	connectToDatabase,
	getDatabase,
	getUsersCollection,
	getReviewsCollection,
};
