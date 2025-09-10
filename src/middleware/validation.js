/**
 * Copyright (c) 2025 Tanese. All Rights Reserved.
 *
 * This software is proprietary and confidential. Unauthorized copying, distribution,
 * modification, or use of this software is strictly prohibited.
 */

const Ajv = require("ajv");
const addFormats = require("ajv-formats");
const { errorResponse, VALIDATION_MESSAGES } = require("../utils/responses");

const ajv = new Ajv({ allErrors: true });
addFormats(ajv);

const validateSchema = (schema) => {
	const validate = ajv.compile(schema);

	return (req, res, next) => {
		const valid = validate(req.body);

		if (!valid) {
			const errors = validate.errors.map((error) => {
				const field = error.instancePath.replace("/", "") || error.params?.missingProperty || "campo";

				switch (error.keyword) {
					case "required":
						return `${error.params.missingProperty} é obrigatório`;
					case "minLength":
						return `${field} deve ter pelo menos ${error.params.limit} caracteres`;
					case "maxLength":
						return `${field} deve ter no máximo ${error.params.limit} caracteres`;
					case "format":
						if (error.params.format === "email") {
							return `${field} deve ser um email válido`;
						}
						if (error.params.format === "uri") {
							return `${field} deve ser uma URL válida`;
						}
						return `${field} tem formato inválido`;
					case "minimum":
						return `${field} deve ser pelo menos ${error.params.limit}`;
					case "maximum":
						return `${field} deve ser no máximo ${error.params.limit}`;
					case "multipleOf":
						return `${field} deve ser múltiplo de ${error.params.multipleOf}`;
					case "pattern":
						if (field === "username") {
							return `${field} pode conter apenas letras, números, _ e -`;
						}
						return `${field} tem formato inválido`;
					case "additionalProperties":
						return `Campo ${error.params.additionalProperty} não é permitido`;
					case "minProperties":
						return "Pelo menos um campo deve ser fornecido";
					default:
						return `${field} é inválido`;
				}
			});

			return res.status(400).json(errorResponse(VALIDATION_MESSAGES.INVALID_DATA, { errors }));
		}

		next();
	};
};

const validateParams = (schema) => {
	const validate = ajv.compile(schema);

	return (req, res, next) => {
		const valid = validate(req.params);

		if (!valid) {
			const errors = validate.errors.map((error) => {
				const field = error.instancePath.replace("/", "") || error.params?.missingProperty || "parâmetro";

				switch (error.keyword) {
					case "pattern":
						if (field === "trailId") {
							return "ID da trilha deve ser um número válido";
						}
						if (field === "reviewId") {
							return "ID da avaliação deve ser um ID válido";
						}
						return `${field} tem formato inválido`;
					default:
						return `${field} é inválido`;
				}
			});

			return res.status(400).json(errorResponse(VALIDATION_MESSAGES.INVALID_DATA, { errors }));
		}

		next();
	};
};

module.exports = {
	validateSchema,
	validateParams,
};
