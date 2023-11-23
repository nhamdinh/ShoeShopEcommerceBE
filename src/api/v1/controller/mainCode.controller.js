"use strict";
const util = require("util");
const logger = require("../log");
const { CREATED, OK } = require("../core/successResponse");
const MainCodeServices = require("../services/MainCodeServices");

class MainCodeController {
  getAllMainCodes = async (req, res, next) => {
    new OK({
      message: "getAllMainCodes OK",
      metadata: await MainCodeServices.getAllMainCodes({
        mainCode_type: req.query.mainCode_type,
      }),
    }).send(res);
  };

  createMainCode = async (req, res, next) => {
    new CREATED({
      message: "createMainCode CREATED",
      metadata: await MainCodeServices.createMainCode(req.body),
    }).send(res);
  };
}

module.exports = new MainCodeController();
