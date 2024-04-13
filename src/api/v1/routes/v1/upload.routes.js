const express = require("express");
const asyncHandler = require("express-async-handler");
const uploadController = require("../../controller/upload.controller");

const { validate } = require("../../validations");
const { protect } = require("../../Middleware/AuthMiddleware");
const { diskUpload } = require("../../../../config/multerUpload");
const { getUrlFromLocal } = require("../../Middleware/uploadImage");
const uploadRoute = express.Router();

uploadRoute.post("/create", asyncHandler(uploadController.uploadFromUrl));

uploadRoute.post(
  "/file",
  diskUpload.single("file"),
  asyncHandler(uploadController.uploadFromLocal)
);

module.exports = uploadRoute;
