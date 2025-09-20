const jwt = require("jsonwebtoken");
const { ObjectId } = require("mongodb");
const { getUsersCollection } = require("../utils/database");
const { errorResponse, AUTH_MESSAGES, AUTH_ERROR_CODES } = require("../utils/responses");

const authenticateToken = async (req, res, next) => {
	try {
		const authHeader = req.headers["authorization"];
		const token = authHeader && authHeader.split(" ")[1];

		if (!token) {
			return res.status(401).json(errorResponse(AUTH_MESSAGES.TOKEN_REQUIRED, AUTH_ERROR_CODES.TOKEN_REQUIRED));
		}

		const decoded = jwt.verify(token, process.env.JWT_SECRET);

		const usersCollection = await getUsersCollection();
		const user = await usersCollection.findOne(
			{ _id: new ObjectId(decoded.userId) },
			{ projection: { password: 0 } }
		);

		if (!user) {
			return res.status(401).json(errorResponse(AUTH_MESSAGES.INVALID_TOKEN, AUTH_ERROR_CODES.INVALID_TOKEN));
		}

		req.user = user;
		req.userId = user._id;

		next();
	} catch (error) {
		if (error.name === "JsonWebTokenError") {
			return res.status(401).json(errorResponse(AUTH_MESSAGES.INVALID_TOKEN, AUTH_ERROR_CODES.INVALID_TOKEN));
		} else if (error.name === "TokenExpiredError") {
			return res.status(401).json(errorResponse(AUTH_MESSAGES.TOKEN_EXPIRED, AUTH_ERROR_CODES.TOKEN_EXPIRED));
		} else {
			console.error("Authentication middleware error:", error);
			return res.status(500).json(errorResponse("Erro de autenticação", "INTERNAL_ERROR"));
		}
	}
};

const generateToken = (userId) => {
	return jwt.sign({ userId: userId.toString() }, process.env.JWT_SECRET, { expiresIn: "7d" });
};

module.exports = {
	authenticateToken,
	generateToken,
};
