const express = require("express");
const http = require("http");
const helmet = require("helmet");
const morgan = require("morgan");
const cors = require("cors");
const multer = require("multer");
const path = require("path");

const connectDatabase = require("./config/MongoDb");
const { URL_SERVER } = require("./common/constant");
connectDatabase();

const app = express();
app.use(
  cors({
    origin: "*",
    /* , methods: ["POST", "PUT"] */
  })
);

app.use(
  "/commons",
  express.static(path.join(__dirname, "public/images/commons"))
); // server images
app.use(
  "/products-img",
  express.static(path.join(__dirname, "public/images/products"))
); // server images

/* middleware */
app.use(express.json());
app.use(helmet());
app.use(morgan("common"));
/* middleware */

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    let folder = req?.query?.folder;
    if (folder === "products") {
      cb(null, "public/images/products");
    } else if (folder === "categorys") {
      cb(null, "public/images/categorys");
    } else {
      cb(null, "public/images/commons");
    }
  },
  filename: (req, file, cb) => {
    cb(null, req.body.name);
  },
});

const storageUpload = multer({ storage: storage });
app.post("/api/upload", storageUpload.single("file"), (req, res) => {
  try {
    let url = URL_SERVER + req?.file?.filename;
    return res.status(200).json({ url });
  } catch (error) {
    console.error(error);
  }
});

/* API */
app.get("/", (req, res) => {
  res.send("API is running");
});
app.use(require("./routes"));
app.get("/api/config/paypal", (req, res) => {
  res.send(process.env.PAYPAL_CLIENT_ID);
});
/* API */

module.exports = app;
