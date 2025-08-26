'use strict';

const StatusCode = {
    FORBIDDEN: 403,
    CONFLICT: 409,
    INTERNAL_SERVER: 500
}

const ReasonStatusCode = {
    FORBIDDEN: 'Forbidden',
    CONFLICT: 'Conflict',
    INTERNAL_SERVER: 'Internal Server Error'
}

class ErrorResponse extends Error {
    constructor(message, status) {
        super(message);
        this.status = status;
    }
}

class ForbiddenRequestError extends ErrorResponse {
    constructor(message = ReasonStatusCode.FORBIDDEN, statusCode = StatusCode.FORBIDDEN) {
        super(message, statusCode);
    }
}

class ConflictRequestError extends ErrorResponse {
    constructor(message = ReasonStatusCode.CONFLICT, statusCode = StatusCode.CONFLICT) {
        super(message, statusCode);
    }
}

class InternalServerRequestError extends ErrorResponse {
    constructor(message = ReasonStatusCode.INTERNAL_SERVER, statusCode = StatusCode.INTERNAL_SERVER) {
        super(message, statusCode);
    }
}

module.exports = {
    ForbiddenRequestError,
    ConflictRequestError,
    InternalServerRequestError
};