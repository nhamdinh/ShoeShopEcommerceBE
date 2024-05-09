const winston = require("winston");
const path = require("path");
require("winston-daily-rotate-file");
const { combine, timestamp, printf, label, json, prettyPrint } = winston.format;

const customTransport = new winston.transports.DailyRotateFile({
  filename: path.join(__dirname, "..", "logger", `%DATE%.log`),
  datePattern: "YYYY-MM-DD-HH" /* 1HH/1record - YYYY-MM-DD-HH-mm-ss */,
  prepend: true,
  //   json: false,
  //   zippedArchive: true,
  maxSize: 4 * 1024 * 1024,
  //   maxFiles: "14d",
  // level: "info",
});

const customFormat = printf((info) => {
  return `${info.timestamp} [${info.label}] ${info.level} === ${info.message}`;
});
const logger = winston.createLogger({
  // level:"debug",
  format: combine(
    label({ label: "shop-ecommerce" }),
    timestamp({
      format: "YYYY-MM-DD HH:mm:ss.SSS A Z",
    }),
    customFormat
    // prettyPrint()
  ),
  transports: [
    new winston.transports.Console(),
    customTransport,
    // new winston.transports.File({
    //   filename: path.join(__dirname, "..", "logger", `%DATE%.log`),
    //   prepend: true,
    //   json: false,
    //   filename: "combined.log",
    //   maxsize: 4 * 1024 * 1024,
    //   level: "info",
    // }),
  ],
});

module.exports = logger;
