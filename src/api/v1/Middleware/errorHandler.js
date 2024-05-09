"use strict";
const util = require("util");
const logger = require("../log");
const { ForbiddenRequestError } = require("../core/errorResponse");

// not Found

const notFound = (req, res, next) => {
  const error = new ForbiddenRequestError(`API Not Found : ${req.originalUrl}`);
  error.status = 404;

  logger.error(
    `notFound :::  ${util.inspect(
      [
        req.path,
        req.reqId,
        Date.now() - error.now + "ms",
        {
          error,
        },
      ],
      {
        showHidden: false,
        depth: null,
        colors: false,
      }
    )}`
  );

  next(error);
};

// Error Handler
const errorHandler = (error, req, res, next) => {
  const statusCode = error.status ?? 500;

  logger.error(
    `errorHandler :::  ${util.inspect(
      [
        req.path,
        req.reqId,
        Date.now() - error.now + "ms",
        {
          error,
        },
      ],
      {
        showHidden: false,
        depth: null,
        colors: false,
      }
    )}`
  );

  res.status(statusCode).json({
    status: "error",
    code: statusCode,
    message: error?.message ?? "Internal Server Error",
    // stack: err?.stack,
  });
};

module.exports = { errorHandler, notFound };
