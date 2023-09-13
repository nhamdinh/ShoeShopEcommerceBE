const express = require("express");
const http = require("http");
const helmet = require("helmet");
const morgan = require("morgan");
const cors = require("cors");
const path = require("path");

const connectDatabase = require("./src/config/MongoDb");
const storageUpload = require("./src/config/storageUpload");
const { URL_SERVER } = require("./src/api/v1/utils/constant");

const bodyParser = require("body-parser");

connectDatabase();

const app = express();
app.use(
  cors({
    origin: "*",
    /* , methods: ["POST", "PUT"] */
  })
);

app.use(bodyParser.urlencoded({ extended: true }));

app.set("view engine", require("ejs"));

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
app.use(require("./src/api/v1/routes/"));

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

/* API */

module.exports = app;
