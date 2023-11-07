// not Found

const notFound = (req, res, next) => {
  const error = new Error(`API Not Found : ${req.originalUrl}`);
  error.status = 404;
  next(error);
};

// Error Handler
const errorHandler = (error, req, res, next) => {
  const statusCode = error.status ?? 500;
  res.status(statusCode).json({
    status: "error",
    code: statusCode,
    message: error?.message ?? "Internal Server Error",
    // stack: err?.stack,
  });
};

module.exports = { errorHandler, notFound };
