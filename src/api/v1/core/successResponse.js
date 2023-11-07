"use strict";

const StatusCode = {
  OK: 200,
  CREATED: 201,
};

const ReasonStatusCode = {
  OK: "Success !!",
  CREATED: "Created !!",
};

class SuccessResponse {
  constructor({
    message,
    metadata = {},
    statusCode = StatusCode.OK,
    reasonStatusCode = ReasonStatusCode.OK,
  }) {
    this.status = "success";
    this.code = statusCode;
    this.message = !message ? reasonStatusCode : message;
    this.metadata = metadata;
  }
  send(res, headers = {}) {
    return res.status(this.code).json(this);
  }
}
class OK extends SuccessResponse {
  constructor({
    message,
    metadata = {},
    statusCode = StatusCode.OK,
    reasonStatusCode = ReasonStatusCode.OK,
    options = {},
  }) {
    super({ message, statusCode, reasonStatusCode, metadata });
    this.options = options;
  }
}
class CREATED extends SuccessResponse {
  constructor({
    message,
    metadata = {},
    statusCode = StatusCode.CREATED,
    reasonStatusCode = ReasonStatusCode.CREATED,
    options = {},
  }) {
    super({ message, statusCode, reasonStatusCode, metadata });
    this.options = options;
  }
}

module.exports = { OK, CREATED };
