const express = require("express");
const asyncHandler = require("express-async-handler");

const nodemailer = require("nodemailer");

const { check, validationResult } = require("express-validator");

const sendEmailRoute = express.Router();

// SEND EMAIL
sendEmailRoute.post(
  "/send-email",
  [check("email").isEmail().withMessage("Invalid Email Address")],
  asyncHandler(async (request, response) => {
    const errors = validationResult(request);

    if (!errors.isEmpty()) {
      response.render("contact", { errors: errors.mapped() });
    } else {
      const transporter = nodemailer.createTransport({
        service: "Gmail",
        auth: {
          user: "nhamnd.hmu@gmail.com",
          pass: "ylzumnpdvgxjmrzw",
        },
      });

      const mail_option = {
        from: "nhamnd.hmu@gmail.com",
        to: request.body?.email,
        subject: "YOUR MESSAGE FROM GEAR",
        //   text: (
        //     Math.floor(Math.random() * (999999 - 100000 + 1)) + 100000
        //   ).toString(),
        text: "you are member",
      };

      transporter.sendMail(mail_option, (error, info) => {
        console.log("info :::: ", info);
        if (error) {
          console.log(error);
        } else {
          console.log("send email success");
          response.status(201).json({ message: "send email success" });
        }
      });
    }
  })
);

module.exports = sendEmailRoute;
