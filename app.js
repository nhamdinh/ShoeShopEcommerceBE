const express = require("express");
const http = require("http");
const helmet = require("helmet");
const morgan = require("morgan");
const cors = require("cors");
const path = require("path");

const connectDatabase = require("./config/MongoDb");
const storageUpload = require("./config/storageUpload");
const { URL_SERVER } = require("./common/constant");
const asyncHandler = require("express-async-handler");

const bodyParser = require("body-parser");

const { check, validationResult } = require("express-validator");

const nodemailer = require("nodemailer");

const ejs = require("ejs");

connectDatabase();

const app = express();
app.use(
  cors({
    origin: "*",
    /* , methods: ["POST", "PUT"] */
  })
);

app.use(bodyParser.urlencoded({ extended: true }));

app.set("view engine", "ejs");

app.use(
  "/commons",
  express.static(path.join(__dirname, "public/images/commons"))
); // server images
app.use(
  "/products-img",
  express.static(path.join(__dirname, "public/images/products"))
); // server images
app.use(
  "/categorys-img",
  express.static(path.join(__dirname, "public/images/categorys"))
); // server images

/* middleware */
app.use(express.json());
app.use(helmet());
app.use(morgan("common"));
/* middleware */

/* API */
app.get("/", (req, res) => {
  res.send("API is running");
});
app.use(require("./routes"));
app.get("/api/config/paypal", (req, res) => {
  res.send(process.env.PAYPAL_CLIENT_ID);
});
app.post("/api/upload", storageUpload.single("file"), (req, res) => {
  let folder = req?.query?.folder;
  let url = "";
  try {
    if (folder === "products") {
      url = URL_SERVER + "products-img/" + req?.file?.filename;
    } else if (folder === "categorys") {
      url = URL_SERVER + "categorys-img/" + req?.file?.filename;
    } else {
      url = URL_SERVER + "commons/" + req?.file?.filename;
    }
    return res.status(200).json({ url });
  } catch (error) {
    console.error(error);
  }
});

app.post(
  "/api/send-email",
  [check("email").isEmail().withMessage("Invalid Email Address")],
  asyncHandler(async (request, response) => {
    console.log("request.body ::::: ", request.body.email);

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
        subject: "YOUR OTP",
        text: (
          Math.floor(Math.random() * (999999 - 100000 + 1)) + 100000
        ).toString(),
      };
      console.log("mail_option ::: ", mail_option);

      transporter.sendMail(mail_option, (error, info) => {
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
/* API */

module.exports = app;
