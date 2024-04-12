const express = require("express");
const asyncHandler = require("express-async-handler");
const uploadController = require("../../controller/upload.controller");

const { validate } = require("../../validations");
const { protect } = require("../../Middleware/AuthMiddleware");
const uploadRoute = express.Router();

uploadRoute.post(
  "/create",
  asyncHandler(uploadController.uploadFromUrl)
);

module.exports = uploadRoute;
