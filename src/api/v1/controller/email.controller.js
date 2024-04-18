"use strict";
const util = require("util");
const logger = require("../log");
const UserServices = require("../services/UserServices");
const { CREATED, OK } = require("../core/successResponse");

class EmailController {
  sendEmail = async (request, res, next) => {
    new OK({
      message: "sendEmail OK",
      metadata: await UserServices.sendEmail({
        request,
      }),
    }).send(res);
  };
}

module.exports = new EmailController();
