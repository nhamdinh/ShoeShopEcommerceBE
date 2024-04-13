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
  uploadFromLocal = async (req, res, next) => {
    new CREATED({
      message: "uploadFromLocal OK",
      metadata: await UploadServices.uploadFromLocal({
        file: req.file,
        query: req.query
      }),
    }).send(res);
  };
}

module.exports = new UploadController();
