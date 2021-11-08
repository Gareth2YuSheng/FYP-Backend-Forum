'use strict';

// Here is the base error classes to extend from
class ApplicationError extends Error {
    constructor(message) {
        super(message);
        Error.captureStackTrace(this);
    }
}

class ValidationError extends ApplicationError {
    constructor(message) {
        super(message);
        Error.captureStackTrace(this);
    }
}

class DatabaseError extends ApplicationError {
    constructor(message) {
        super(message);
        Error.captureStackTrace(this);
    }
}

class DatabaseConnectionError extends DatabaseError {
    constructor(message) {
        super(message);
        Error.captureStackTrace(this);
    }
}

class CloudinaryError extends ApplicationError {
    constructor(message) {
        super(message);
        Error.captureStackTrace(this);
    }
}


module.exports = {
    ApplicationError,
    DatabaseError,
    DatabaseConnectionError,
    ValidationError,
    CloudinaryError
};