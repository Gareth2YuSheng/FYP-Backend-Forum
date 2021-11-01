'use strict';

// Here is the base error classes to extend from

class ApplicationError extends Error {
  constructor(message) {
    super(message);
    Error.captureStackTrace(this);
  }
}

module.exports = {
    ApplicationError,
};