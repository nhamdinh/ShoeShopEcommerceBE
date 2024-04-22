"use strict";
const express = require("express");
const asyncHandler = require("express-async-handler");
const otpController = require("../../controller/otp.controller");

const { validate } = require("../../validations");
const { protect } = require("../../Middleware/AuthMiddleware");
const otpRoute = express.Router();

//  SEND EMAIL REGISTER
otpRoute.put(
  "/register-send-email",
//   validate.validateEmail(),
  asyncHandler(otpController.registerSendEmail)
);

module.exports = otpRoute;
