"use strict";
const util = require("util");
const logger = require("../log");
const { validationResult } = require("express-validator");
const nodemailer = require("nodemailer");

const { ForbiddenRequestError } = require("../core/errorResponse");

const { convertToObjectId } = require("../utils/getInfo");
const { findUserByEmailRepo } = require("../repositories/user.repo");
const { createOtpRepo } = require("../repositories/otp.repo");

const { SENDER = "nhamnd.hmu@gmail.com" } = process.env;

class OtpServices {
  static registerSendEmail = async (req) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      // res.status(422).json(errors.array());
      throw new ForbiddenRequestError(
        errors.array().length > 0 ? errors.array()[0]?.msg : "Invalid input",
        422
      );
    }

    const { name, email, password, phone, isAdmin } = req.body;
    const userExists = await findUserByEmailRepo({ email }); //giam size OBJECT, tra ve 1 obj js original, neu k trar ve nhieu thong tin hon

    if (userExists) throw new ForbiddenRequestError("User already EXISTS!");

    const transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: SENDER,
        pass: "ylzumnpdvgxjmrzw",
      },
    });

    const text = (
      Math.floor(Math.random() * (999999 - 100000 + 1)) + 100000
    ).toString();

    const mail_option = {
      from: SENDER,
      to: email,
      subject: "YOUR MESSAGE FROM SHOPNODE",
      text,
    };

    transporter.sendMail(mail_option, (error, info) => {
      if (error) {
        logger.error(
          `sendMail() ::: ${util.inspect(error, {
            showHidden: false,
            depth: null,
            colors: false,
          })}`
        );
        throw new ForbiddenRequestError("sendMail error");
      }
    });

    await createOtpRepo({ otp_token: text, otp_email: email });
    return true;
  };
}

module.exports = OtpServices;
