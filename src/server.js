/**
 * Copyright (c) 2025 Tanese. All Rights Reserved.
 *
 * This software is proprietary and confidential. Unauthorized copying, distribution,
 * modification, or use of this software is strictly prohibited.
 */

require("dotenv").config();
const express = require("express");
const cors = require("cors");
const rateLimit = require("express-rate-limit");
const { connectToDatabase, closeDatabaseConnection } = require("./utils/database");
const { createIndexes } = require("./utils/dbIndexes");
const { validateEnvironment } = require("./utils/validateEnv");

validateEnvironment();

const app = express();

app.set('trust proxy', 1);

app.use(cors({ origin: "*" }));
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Sanitização de inputs básico (pra tirar qualquer bagulho de script)
app.use((req, res, next) => {
	const sanitizeObject = (obj) => {
		for (let key in obj) {
			if (typeof obj[key] === "string") {
				obj[key] = obj[key].replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "");
			} else if (typeof obj[key] === "object" && obj[key] !== null) {
				sanitizeObject(obj[key]);
			}
		}
	};

	if (req.body) sanitizeObject(req.body);
	if (req.query) sanitizeObject(req.query);
	if (req.params) sanitizeObject(req.params);

	next();
});

// Rate limiting (Não mt necessário, mas quanto mais melhor)
const limiter = rateLimit({
	windowMs: 15 * 60 * 1000, // 15 minutos
	max: 200,
	message: {
		ok: false,
		message: "Muitas tentativas. Tente novamente em 15 minutos.",
	},
	standardHeaders: true,
	legacyHeaders: false,
});

app.use(limiter);

// Log pra desenvolvimento
if (process.env.NODE_ENV !== "production") {
	app.use((req, res, next) => {
		console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
		next();
	});
}

// Rotas
app.use("/api/auth", require("./routes/auth"));
app.use("/api/users", require("./routes/users"));
app.use("/api/trails", require("./routes/trails"));
app.use("/api/reviews", require("./routes/reviews"));

// Só um endpoint de teste
app.get("/health", (req, res) => {
	res.status(200).json({
		ok: true,
		message: "API funcionando corretamente",
		timestamp: new Date().toISOString(),
	});
});

// Endpoint principal
app.get("/", (req, res) => {
	res.status(200).json({
		ok: true,
		message: "Veredas API",
		version: "1.0.0",
		endpoints: {
			auth: "/api/auth",
			users: "/api/users",
			trails: "/api/trails",
			reviews: "/api/reviews",
		},
		documentation: "/api/docs",
	});
});

// Endpoint de documentação da API
app.get("/api/docs", (req, res) => {
	res.status(200).json({
		ok: true,
		message: "Veredas API - Documentação",
		version: "1.0.0",
		endpoints: {
			auth: {
				"POST /api/auth/register": "Registrar novo usuário",
				"POST /api/auth/login": "Fazer login",
				"POST /api/auth/logout": "Fazer logout",
			},
			users: {
				"GET /api/users/profile": "Obter perfil do usuário",
				"PUT /api/users/profile": "Atualizar perfil",
				"PUT /api/users/password": "Alterar senha",
				"DELETE /api/users/account": "Deletar conta",
				"GET /api/users/reviews": "Obter avaliações do usuário",
			},
			trails: {
				"GET /api/trails": "Listar todas as trilhas",
				"GET /api/trails/:id": "Obter detalhes da trilha",
				"POST /api/trails/:id/favorite": "Alternar favorito",
				"GET /api/trails/:id/reviews": "Obter avaliações da trilha",
			},
			reviews: {
				"POST /api/reviews": "Criar nova avaliação",
				"PUT /api/reviews/:id": "Atualizar avaliação",
				"DELETE /api/reviews/:id": "Deletar avaliação",
				"GET /api/reviews/:id": "Obter avaliação específica",
			},
		},
	});
});

// Handler de 404
app.use("*", (req, res) => {
	res.status(404).json({
		ok: false,
		message: "Endpoint não encontrado",
	});
});

// Handler de erro global
app.use((error, req, res, next) => {
	console.error("Global error handler:", error);

	if (error.name === "ValidationError") {
		return res.status(400).json({
			ok: false,
			message: "Dados inválidos",
			details: error.message,
		});
	}

	if (error.name === "CastError") {
		return res.status(400).json({
			ok: false,
			message: "ID inválido fornecido",
		});
	}

	res.status(500).json({
		ok: false,
		message: "Erro interno do servidor",
	});
});

// Inicialização da aplicação
const initializeApp = async () => {
	try {
		await connectToDatabase();
		console.log("Database connected successfully");

		console.log("Static trails configured");

		await createIndexes();
	} catch (error) {
		console.error("Failed to initialize app:", error);
		process.exit(1);
	}
};

// Inicialização do server com base em env
if (process.env.NODE_ENV === "production") {
	// Pra Vercel
	initializeApp();
	module.exports = app;
} else {
	// Pra desenvolvimento local
	const PORT = process.env.PORT || 3001;

	initializeApp().then(() => {
		app.listen(PORT, () => {
			console.log(`Server running on port ${PORT}`);
			console.log(`Local: http://localhost:${PORT}`);
			console.log(`Health: http://localhost:${PORT}/health`);
		});
	});
}
