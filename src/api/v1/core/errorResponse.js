"use strict";

const logger = require("../log");
const util = require("util");

const StatusCode = require("./statusCode/statusCode");
const ReasonStatusCode = require("./statusCode/reasonMessage");

// const StatusCode = {
//   FORBIDDEN: 403,
//   CONFLICT: 409,
// };

// const ReasonStatusCode = {
//   FORBIDDEN: "Bad Request error",
//   CONFLICT: "Conflict error",
// };

class ErrorResponse extends Error {
  constructor(message, statusCode) {
    super(message);
    this.status = statusCode;
    this.now = Date.now();
    // logger.error(
    //   `user login ::: ${util.inspect(statusCode, {
    //     showHidden: false,
    //     depth: null,
    //     colors: false,
    //   })}`
    // );
    logger.error(`${this.status + "KKK ::: " + this.message}`);
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
class NotFoundRequestError extends ErrorResponse {
  constructor(
    message = ReasonStatusCode.NOT_FOUND,
    statusCode = StatusCode.NOT_FOUND
  ) {
    super(message, statusCode);
  }
}

module.exports = {
  ConflictRequestError,
  ForbiddenRequestError,
  NotFoundRequestError,
};
