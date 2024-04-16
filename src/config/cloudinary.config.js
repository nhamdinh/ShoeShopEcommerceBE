"use strict";
const util = require("util");
const logger = require("../api/v1/log");
// Require the cloudinary library
const cloudinary = require("cloudinary").v2;

// Return "https" URLs by setting secure: true
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

// Log the configuration
// logger.info(
//   `cloudinary.config() ::: ${util.inspect(cloudinary.config(), {
//     showHidden: false,
//     depth: null,
//     colors: false,
//   })}`
// );

module.exports = cloudinary;
