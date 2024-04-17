const express = require("express");
const http = require("http");
const helmet = require("helmet");
const morgan = require("morgan");
const compression = require("compression");

const cors = require("cors");
const path = require("path");

const {
  notFound,
  errorHandler,
} = require("./src/api/v1/Middleware/errorHandler");
const asyncHandler = require("express-async-handler");

const { diskUpload } = require("./src/config/multerUpload");
const { getUrlFromLocal } = require("./src/api/v1/Middleware/uploadImage");
const { checkOverload } = require("./src/api/v1/helpers/checkConnect");
require("./src/config/MongoDb");
// checkOverload();

const app = express();

const cookieParser = require("cookie-parser");
const {
  PATH_IMG_COMMONS,
  PATH_IMG_PRODUCTS,
  PATH_IMG_CATEGORYS,
  DIRNAME_IMG_COMMONS,
  DIRNAME_IMG_PRODUCTS,
  DIRNAME_IMG_CATEGORYS,
} = require("./src/api/v1/utils/constant");
// app.use(cookieParser("randomsecretstring"));
app.use(cookieParser());
// app.use(cors());

app.use(
  cors({
    origin: "*",
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    preflightContinue: false,
    optionsSuccessStatus: 204,
    credentials: true,
  })
);

app.set("view engine", require("ejs"));

app.use(
  `/${PATH_IMG_COMMONS}`,
  express.static(path.join(__dirname, DIRNAME_IMG_COMMONS))
); // server images
app.use(
  `/${PATH_IMG_PRODUCTS}`,
  express.static(path.join(__dirname, DIRNAME_IMG_PRODUCTS))
); // server images
app.use(
  `/${PATH_IMG_CATEGORYS}`,
  express.static(path.join(__dirname, DIRNAME_IMG_CATEGORYS))
); // server images

/* middleware */
app.use(helmet()); //bao ve thong tin may chu
app.use(morgan("dev")); //log
app.use(
  compression({
    level: 6,
    threshold: 100 * 1024, // nhieu hon thi gzip
    fitter: (req, res) => {
      if (req.headers["x—no—compress"]) {
        return false;
      }
      return compression.fitter(req, res);
    },
  })
); // tiet kiem bang thong 100 lan, van chuyen du lieu

app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);

// app.use(morgan("combined"));
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "*");
  next();
});

/* middleware */

/* API */

app.get("/", (req, res, next) => {
  const strCompression = "hello world 33";
  res.status(200).json({
    mess: `API is running`,
    metadata: strCompression.repeat(10000),
  });
});
app.use(require("./src/api/v1/routes/"));

app.get("/api/config/paypal", (req, res) => {
  res.send(process.env.PAYPAL_CLIENT_ID);
});
app.post("/api/upload", diskUpload.single("file"), getUrlFromLocal);
app.post(
  "/api/cookie",
  asyncHandler(async (req, res) => {
    // res.cookie("name", "express").send("cookie set"); //Sets name = express
    res.header("Access-Control-Allow-Origin", process.env.URL_CLIENT); // update to match the domain you will make the request from
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept"
    );
    res.header("Access-Control-Allow-Credentials", "true");
    res
      .cookie("access_token", "token", {
        httpOnly: true,
      })
      .status(200)
      .json({ message: "Logged in successfully 😊 👌" });
  })
);

app.get(
  "/api/cookie",
  asyncHandler(async (req, res, next) => {
    // res.header("Access-Control-Allow-Origin", "http://localhost:3000"); // update to match the domain you will make the request from
    // res.header(
    //   "Access-Control-Allow-Headers",
    //   "Origin, X-Requested-With, Content-Type, Accept"
    // );
    // res.header("Access-Control-Allow-Credentials", "true");
    res
      .cookie("access_token", "token", {
        httpOnly: true,
      })
      .status(200)
      .json({ message: "Logged in successfully 😊 👌" });

    // res.header('Content-Type', 'application/json;charset=UTF-8')
    // res.header('Access-Control-Allow-Credentials', true)
    // res.header(
    //   'Access-Control-Allow-Headers',
    //   'Origin, X-Requested-With, Content-Type, Accept'
    // )

    // res.cookie(`Cookie token name`, `encrypted cookie string Value`,
    // { httpOnly: false , domain: 'http://localhost:3000' });
    // res.send("Cookie have been saved successfully1");

    // res.cookie("name", "express").send("cookie set"); //Sets name = express
    // res.header("Access-Control-Allow-Origin", "*"); // update to match the domain you will make the request from
    // res.header(
    //   "Access-Control-Allow-Headers",
    //   "Origin, X-Requested-With, Content-Type, Accept"
    // );
    // res.header("Access-Control-Allow-Credentials", "true");
    // res
    //   .cookie("access_token", "token", {
    //     httpOnly: true,
    //   })
    //   .status(200)
    //   .json({ message: "Logged in successfully 😊 👌" });
  })
);
// app.use(
//   "/api",
//   createProxyMiddleware({
//     target: "http://localhost:3000",
//     changeorigin: true,
//     cookiedomainrewrite: "localhost",
//   })
// );
/* API */
/* errorHandler */
app.use(notFound);
app.use(errorHandler);
/* errorHandler */

module.exports = app;
