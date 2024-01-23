const express = require("express");
const asyncHandler = require("express-async-handler");

const { validate } = require("../../validations");
const emailController = require("../../controller/email.controller");
const sendEmailRoute = express.Router();

// SEND EMAIL
sendEmailRoute.post(
  "/send-email",
  validate.validateEmail(),
  asyncHandler(emailController.sendEmail)
);

module.exports = sendEmailRoute;
