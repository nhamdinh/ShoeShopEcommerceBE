const express = require("express");
const { sendEmail } = require("../../controller/email.controller");
const { validate } = require("../../validations");
const sendEmailRoute = express.Router();

// SEND EMAIL
sendEmailRoute.post("/send-email", validate.validateEmail(), sendEmail);

module.exports = sendEmailRoute;
