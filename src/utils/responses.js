const createResponse = (ok, message, data = null, errorCode = null) => {
	const response = { ok, message };

	if (errorCode) {
		response.errorCode = errorCode;
	}

	if (data) {
		Object.assign(response, data);
	}

	return response;
};

const successResponse = (message, data = null) => {
	return createResponse(true, message, data);
};

const errorResponse = (message, errorCode = null, data = null) => {
	return createResponse(false, message, data, errorCode);
};

const AUTH_MESSAGES = {
	REGISTER_SUCCESS: "Usuário registrado com sucesso",
	LOGIN_SUCCESS: "Login realizado com sucesso",
	LOGOUT_SUCCESS: "Logout realizado com sucesso",
	EMAIL_IN_USE: "Email já está em uso",
	INVALID_CREDENTIALS: "Credenciais inválidas",
	TOKEN_REQUIRED: "Token de acesso necessário",
	INVALID_TOKEN: "Token inválido",
	TOKEN_EXPIRED: "Token expirado",
};

const AUTH_ERROR_CODES = {
	EMAIL_EXISTS: "EMAIL_EXISTS",
	USERNAME_EXISTS: "USERNAME_EXISTS",
	INVALID_CREDENTIALS: "INVALID_CREDENTIALS",
	TOKEN_REQUIRED: "TOKEN_REQUIRED",
	INVALID_TOKEN: "INVALID_TOKEN",
	TOKEN_EXPIRED: "TOKEN_EXPIRED",
};

const USER_MESSAGES = {
	PROFILE_LOADED: "Perfil carregado com sucesso",
	PROFILE_UPDATED: "Perfil atualizado com sucesso",
	PASSWORD_CHANGED: "Senha alterada com sucesso",
	ACCOUNT_DELETED: "Conta deletada com sucesso",
	REVIEWS_LOADED: "Avaliações carregadas com sucesso",
	USER_NOT_FOUND: "Usuário não encontrado",
	CURRENT_PASSWORD_INCORRECT: "Senha atual incorreta",
	USERNAME_IN_USE: "Nome de usuário já está em uso",
};

const USER_ERROR_CODES = {
	USER_NOT_FOUND: "USER_NOT_FOUND",
	USERNAME_EXISTS: "USERNAME_EXISTS",
	INVALID_CURRENT_PASSWORD: "INVALID_CURRENT_PASSWORD",
	UNAUTHORIZED: "UNAUTHORIZED",
};

const TRAIL_MESSAGES = {
	TRAIL_LOADED: "Trilha carregada com sucesso",
	TRAIL_NOT_FOUND: "Trilha não encontrada",
	FAVORITE_ADDED: "Trilha adicionada aos favoritos",
	FAVORITE_REMOVED: "Trilha removida dos favoritos",
};

const TRAIL_ERROR_CODES = {
	TRAIL_NOT_FOUND: "TRAIL_NOT_FOUND",
	INVALID_TRAIL_ID: "INVALID_TRAIL_ID",
};

const REVIEW_MESSAGES = {
	REVIEW_CREATED: "Avaliação criada com sucesso",
	REVIEW_UPDATED: "Avaliação atualizada com sucesso",
	REVIEW_DELETED: "Avaliação deletada com sucesso",
	REVIEW_NOT_FOUND: "Avaliação não encontrada",
	ALREADY_REVIEWED: "Você já avaliou esta trilha",
	CANNOT_EDIT_REVIEW: "Você não pode editar esta avaliação",
	CANNOT_DELETE_REVIEW: "Você não pode deletar esta avaliação",
};

const REVIEW_ERROR_CODES = {
	REVIEW_NOT_FOUND: "REVIEW_NOT_FOUND",
	ALREADY_REVIEWED: "ALREADY_REVIEWED",
	CANNOT_EDIT_REVIEW: "CANNOT_EDIT_REVIEW",
	CANNOT_DELETE_REVIEW: "CANNOT_DELETE_REVIEW",
	TRAIL_NOT_FOUND: "TRAIL_NOT_FOUND",
};

const VALIDATION_MESSAGES = {
	INVALID_DATA: "Dados inválidos fornecidos",
	REQUIRED_FIELD: "Campo obrigatório",
	INVALID_EMAIL: "Email inválido",
	PASSWORD_TOO_SHORT: "Senha deve ter pelo menos 6 caracteres",
	INVALID_RATING: "Avaliação deve ser entre 0.5 e 5.0",
	REVIEW_TOO_LONG: "Avaliação muito longa (máximo 1000 caracteres)",
	USERNAME_TOO_LONG: "Nome de usuário muito longo (máximo 50 caracteres)",
	BIO_TOO_LONG: "Bio muito longa (máximo 500 caracteres)",
};

const VALIDATION_ERROR_CODES = {
	INVALID_DATA: "INVALID_DATA",
	REQUIRED_FIELD: "REQUIRED_FIELD",
	INVALID_EMAIL: "INVALID_EMAIL",
	PASSWORD_TOO_SHORT: "PASSWORD_TOO_SHORT",
	INVALID_RATING: "INVALID_RATING",
	REVIEW_TOO_LONG: "REVIEW_TOO_LONG",
	USERNAME_TOO_LONG: "USERNAME_TOO_LONG",
	BIO_TOO_LONG: "BIO_TOO_LONG",
	INVALID_ID_FORMAT: "INVALID_ID_FORMAT",
};

const GENERAL_MESSAGES = {
	INTERNAL_ERROR: "Erro interno do servidor",
	NOT_FOUND: "Recurso não encontrado",
	UNAUTHORIZED: "Não autorizado",
	FORBIDDEN: "Acesso negado",
};

const GENERAL_ERROR_CODES = {
	INTERNAL_ERROR: "INTERNAL_ERROR",
	NOT_FOUND: "NOT_FOUND",
	UNAUTHORIZED: "UNAUTHORIZED",
	FORBIDDEN: "FORBIDDEN",
	INVALID_JSON: "INVALID_JSON",
	RATE_LIMIT_EXCEEDED: "RATE_LIMIT_EXCEEDED",
};

module.exports = {
	createResponse,
	successResponse,
	errorResponse,
	AUTH_MESSAGES,
	USER_MESSAGES,
	TRAIL_MESSAGES,
	REVIEW_MESSAGES,
	VALIDATION_MESSAGES,
	GENERAL_MESSAGES,
	AUTH_ERROR_CODES,
	USER_ERROR_CODES,
	TRAIL_ERROR_CODES,
	REVIEW_ERROR_CODES,
	VALIDATION_ERROR_CODES,
	GENERAL_ERROR_CODES,
};
