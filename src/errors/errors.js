'use strict';

// Here is the base error classes to extend from
class ApplicationError extends Error {
    constructor(message) {
        super(message);
        Error.captureStackTrace(this, ApplicationError);
    }
}

class ValidationError extends ApplicationError {
    constructor(message) {
        super(message);
        Error.captureStackTrace(this, ValidationError);
    }
}

class DatabaseError extends ApplicationError {
    constructor(message) {
        super(message);
        Error.captureStackTrace(this, DatabaseError);
    }
}

class DatabaseConnectionError extends DatabaseError {
    constructor(message) {
        super(message);
        Error.captureStackTrace(this, DatabaseConnectionError);
    }
}

class CloudinaryError extends ApplicationError {
    constructor(message) {
        super(message);
        Error.captureStackTrace(this, CloudinaryError);
    }
}

class FileError extends ApplicationError {
    constructor(message) {
        super(message);
        Error.captureStackTrace(this, FileError);
    }
}

module.exports = {
    ApplicationError,
    DatabaseError,
    DatabaseConnectionError,
    ValidationError,
    CloudinaryError,
    FileError
};