"use strict";

const StatusCode = {
  FORBIDDEN: 403,
  CONFLICT: 409,
};

const ReasonStatusCode = {
  FORBIDDEN: "Bad Request error",
  CONFLICT: "Conflict error",
};

class ErrorResponse extends Error {
  constructor(message, statusCode) {
    super(message);
    this.status = statusCode;
  }
}
class ConflictRequestError extends ErrorResponse {
  constructor(
    message = ReasonStatusCode.CONFLICT,
    statusCode = StatusCode.CONFLICT
  ) {
    super(message, statusCode);
  }
}
class ForbiddenRequestError extends ErrorResponse {
  constructor(
    message = ReasonStatusCode.FORBIDDEN,
    statusCode = StatusCode.FORBIDDEN
  ) {
    super(message, statusCode);
  }
}

module.exports = { ConflictRequestError, ForbiddenRequestError };
