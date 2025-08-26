'use strict';

const StatusCode = {
    OK: 200,
    CREATED: 201,
    ACCEPTED: 202
}

const ReasonStatusCode = {
    OK: 'OK',
    CREATED: 'Created',
    ACCEPTED: 'Accepted'
}

class SuccessResponse {
    constructor(message, statusCode = StatusCode.OK, reasonStatusCode = ReasonStatusCode.OK, metadata = {}) {
        this.message = !message ? reasonStatusCode : message;
        this.status = statusCode;
        this.metadata = metadata;
    }

    send(res, headers = {}) {
        return res.status(this.status).json(this);
    }
}

class OK extends SuccessResponse {
    constructor({ message, metadata }) {
        super(message, metadata);
    }
}

class CREATED extends SuccessResponse {
    constructor({ options = {}, message, statusCode = StatusCode.CREATED, reasonStatusCode = ReasonStatusCode.CREATED, metadata }) {
        super(message, statusCode, reasonStatusCode, metadata);
        this.options = options;
    }
}

class ACCEPTED extends SuccessResponse {
    constructor({ message, statusCode = StatusCode.ACCEPTED, reasonStatusCode = ReasonStatusCode.ACCEPTED, metadata }) {
        super(message, statusCode, reasonStatusCode, metadata);
    }
}

module.exports = {
    OK,
    CREATED,
    ACCEPTED
};