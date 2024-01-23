"use strict";

const logger = require("../log");
const util = require("util");

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
    // logger.error(
    //   `user login ::: ${util.inspect(statusCode, {
    //     showHidden: false,
    //     depth: null,
    //     colors: false,
    //   })}`
    // );
    logger.error(`${this.status + " ::: " + this.message}`);
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
