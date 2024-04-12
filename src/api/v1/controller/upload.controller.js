"use strict";
const util = require("util");
const logger = require("../log");
const { CREATED, OK } = require("../core/successResponse");
const UploadServices = require("../services/upload.service");

class UploadController {
  uploadFromUrl = async (req, res, next) => {
    new CREATED({
      message: "uploadFromUrl OK",
      metadata: await UploadServices.uploadFromUrl(),
    }).send(res);
  };
}

module.exports = new UploadController();
