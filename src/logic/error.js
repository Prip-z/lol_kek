export class ValidationError extends Error {
    statusCode;
    name = this.constructor.name;
    constructor(message, statusCode = 400) {
        super(message);
        this.statusCode = statusCode;
    }
}
