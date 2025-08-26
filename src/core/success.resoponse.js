'use strict';

const {
    StatusCodes,
    ReasonPhrases
} = require('../utils/httpStatusCode');

class SuccessResponse {
    constructor({message, statusCode = StatusCodes.OK, reasonStatusCode = ReasonPhrases.OK, metadata = {}}) {
        this.message = !message ? reasonStatusCode : message;
        this.status = statusCode;
        this.metadata = metadata;
    }

    send(res, headers = {}) {
        return res.status(this.status).json(this);
    }
}

class OK extends SuccessResponse {
    constructor({ message, statusCode = StatusCodes.OK, reasonStatusCode = ReasonPhrases.OK, metadata }) {
        super({ message, statusCode, reasonStatusCode, metadata });
    }
}

class CREATED extends SuccessResponse {
    constructor({ options = {}, message, statusCode = StatusCodes.CREATED, reasonStatusCode = ReasonPhrases.CREATED, metadata }) {
        super(message, statusCode, reasonStatusCode, metadata);
        this.options = options;
    }
}

class ACCEPTED extends SuccessResponse {
    constructor({ message, statusCode = StatusCodes.ACCEPTED, reasonStatusCode = ReasonPhrases.ACCEPTED, metadata }) {
        super(message, statusCode, reasonStatusCode, metadata);
    }
}

module.exports = {
    SuccessResponse,
    OK,
    CREATED,
    ACCEPTED
};