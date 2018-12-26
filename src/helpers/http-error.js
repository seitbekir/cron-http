const httpStatus = require('http-status');

/**
 * HttpError wrapper
 */
class HttpError extends Error {
    /**
     * @param {Number} status HTTP Status Code
     * @param {String} message HTTP Status Message
     * @param  {...any} args any other arguments will be sent as `{ error: ... }`
     */
    constructor(status, message, ...args) {
        super(message, ...args);
        this.message = message || httpStatus[status] || httpStatus[500];
        this.status = status;

        if (args[0]) {
            [this.errors] = args;
        }
    }

    static get sendHttpError() { return sendHttpError; }

    /**
     * Data to be sent to Client
     */
    toJSON() {
        return {
            status: this.status,
            message: this.message,
            errors: this.errors,
        };
    }
}

module.exports = HttpError;

/**
 * Sends HTTP status to client
 * @param {Error} error Error onstance
 * @param {Response} res
 */
function sendHttpError(error, res) {
    if (error && error.code) {
        // eslint-disable-next-line no-param-reassign
        error = new HttpError(error.code);
    }
    if (error instanceof Error && error instanceof HttpError === false) {
        console.error(
            error.stack
                .split('\n')
                .map(e => e.trim())
                .slice(0, 7),
        );
    }
    if (error instanceof HttpError === false) {
        let statusCode = 500;
        let status = httpStatus[500];
        if (typeof error === 'number' && error in httpStatus) {
            statusCode = error;
            status = httpStatus[error];
        }
        // eslint-disable-next-line no-param-reassign
        error = new HttpError(statusCode, status);
    }

    res.statusMessage = error.message;
    res.statusCode = error.status;
    res.end(JSON.stringify(error));
}
