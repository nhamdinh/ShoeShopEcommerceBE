const express = require("express");
const asyncHandler = require("express-async-handler");
const uploadController = require("../../controller/upload.controller");

const { validate } = require("../../validations");
const { protect } = require("../../Middleware/AuthMiddleware");
const { diskUpload, memoryUpload } = require("../../../../config/multerUpload");
const uploadRoute = express.Router();

uploadRoute.post("/url", asyncHandler(uploadController.uploadFromUrl));

uploadRoute.post(
  "/file",
  diskUpload.single("file"),
  asyncHandler(uploadController.uploadFromLocal)
);

uploadRoute.post(
  "/to-local",
  diskUpload.single("file"),
  asyncHandler(uploadController.getUrlFromLocal)
);

uploadRoute.post(
  "/file/bucket",
  memoryUpload.single("file"),
  asyncHandler(uploadController.uploadFromLocalS3)
);

module.exports = uploadRoute;
