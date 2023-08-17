const express = require("express");
const http = require("http");
const helmet = require("helmet");
const morgan = require("morgan");
const cors = require("cors");
const multer = require("multer");
const path = require("path");

const connectDatabase = require("./config/MongoDb");
connectDatabase();

const app = express();
app.use(
  cors({
    origin: "*",
    /* , methods: ["POST", "PUT"] */
  })
);

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
/* API */

module.exports = app;
