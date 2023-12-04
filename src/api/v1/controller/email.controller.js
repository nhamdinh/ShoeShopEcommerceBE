const asyncHandler = require("express-async-handler");

const nodemailer = require("nodemailer");

const { validationResult } = require("express-validator");

const sendEmail = asyncHandler(async (request, response) => {
  try {
    const errors = validationResult(request);

    if (!errors.isEmpty()) {
      response.status(422).json(errors.array());
      return;
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
        subject: "YOUR MESSAGE FROM BESTBUY SHOP",
        //   text: (
        //     Math.floor(Math.random() * (999999 - 100000 + 1)) + 100000
        //   ).toString(),
        text: `Welcome to ${request.body?.productShopName}`,
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
  } catch (error) {
    throw new Error(error);
  }
});
module.exports = {
  sendEmail,
};
