/**
 * Copyright (c) 2025 Tanese. All Rights Reserved.
 *
 * This software is proprietary and confidential. Unauthorized copying, distribution,
 * modification, or use of this software is strictly prohibited.
 */

const { MongoClient } = require("mongodb");

let client = null;
let db = null;

const connectToDatabase = async () => {
	if (db && client) {
		return db;
	}

	try {
		const uri = process.env.MONGO_URI;

		if (!client) {
			client = new MongoClient(uri);
			console.log("Creating new MongoDB client connection...");
			await client.connect();
			console.log("MongoDB client connected successfully");
		}

		db = client.db("veredas-db");
		return db;
	} catch (error) {
		console.error("Failed to connect to MongoDB:", error);
		client = null;
		db = null;
		throw error;
	}
};

const getDatabase = async () => {
	return await connectToDatabase();
};

const getUsersCollection = async () => {
	const database = await getDatabase();
	return database.collection("users");
};

const getReviewsCollection = async () => {
	const database = await getDatabase();
	return database.collection("reviews");
};

module.exports = {
	connectToDatabase,
	getDatabase,
	getUsersCollection,
	getReviewsCollection,
};
