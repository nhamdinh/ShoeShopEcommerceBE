"use strict";
const util = require("util");
const logger = require("../log");
const { CREATED, OK } = require("../core/successResponse");
const UploadServices = require("../services/upload.service");

class UploadController {
  uploadFromUrl = async (req, res, next) => {
    new CREATED({
      message: "uploadFromUrl OK",
      metadata: await UploadServices.uploadFromUrl({
        body: req.body
      }),
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

  getUrlFromLocal = async (req, res, next) => {
    new CREATED({
      message: "getUrlFromLocal OK",
      metadata: await UploadServices.getUrlFromLocal({
        file: req.file,
        query: req.query
      }),
    }).send(res);
  };

  
  uploadFromLocalS3 = async (req, res, next) => {
    new CREATED({
      message: "uploadFromLocalS3 OK",
      metadata: await UploadServices.uploadFromLocalS3({
        file: req.file,
        query: req.query
      }),
    }).send(res);
  };


}

module.exports = new UploadController();
