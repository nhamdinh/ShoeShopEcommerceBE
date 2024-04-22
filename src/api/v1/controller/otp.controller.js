"use strict";
const util = require("util");
const logger = require("../log");
const { CREATED, OK } = require("../core/successResponse");
const OtpServices = require("../services/otp.service");

class OtpController {
  registerSendEmail = async (req, res) => {
    new OK({
      message: "registerSendEmail OK",
      metadata: await OtpServices.registerSendEmail(req),
    }).send(res);
  };
}

module.exports = new OtpController();
