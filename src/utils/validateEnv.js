const validateEnvironment = () => {
	const required = ["MONGO_URI", "JWT_SECRET"];
	const missing = [];

	required.forEach((key) => {
		if (!process.env[key]) {
			missing.push(key);
		}
	});

	if (missing.length > 0) {
		console.error("Missing required environment variables:", missing.join(", "));
		console.error("Create a .env file with the required variables");
		process.exit(1);
	}

	if (process.env.JWT_SECRET.length < 32) {
		console.warn("JWT_SECRET should be at least 32 characters long for security");
	}

	console.log("Environment variables validated");
};

module.exports = { validateEnvironment };
