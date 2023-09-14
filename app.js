const express = require("express");
const http = require("http");
const helmet = require("helmet");
const morgan = require("morgan");
const cors = require("cors");
const path = require("path");
const {
  notFound,
  errorHandler,
} = require("./src/api/v1/Middleware/errorHandler");

const connectDatabase = require("./src/config/MongoDb");
const { storageUpload } = require("./src/config/storageUpload");

const bodyParser = require("body-parser");
const { uploadPhoto } = require("./src/api/v1/Middleware/uploadImage");

connectDatabase();

const app = express();
const cookieParser = require("cookie-parser");
app.use(cookieParser("random secret string"));

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
app.post("/api/upload", storageUpload.single("file"), uploadPhoto);
app.use(notFound);
app.use(errorHandler);
/* API */

module.exports = app;
