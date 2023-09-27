const winston = require("winston");
require("winston-daily-rotate-file");
const path = require("path");

let transport = new winston.transports.DailyRotateFile({
  filename: path.join(__dirname, "..", "logger", `%DATE%.log`),
  datePattern: "YYYY-MM-DD-HH" /* 1HH/1record - YYYY-MM-DD-HH-mm-ss */,
  prepend: true,
  //   json: false,
  //   zippedArchive: true,
  maxSize: 4 * 1024 * 1024,
  //   maxFiles: "14d",
  // level: "info",
});

const customFormat = winston.format.printf((info) => {
  return `[format] ${info.timestamp} [${info.label}] ${info.level}: ${info.message}`;
});
const logger = winston.createLogger({
  format: winston.format.combine(
    winston.format.label({ label: "shop-ecommerce:" }),
    winston.format.timestamp(),
    customFormat,
    // winston.format.prettyPrint()
  ),
  transports: [
    new winston.transports.Console(),
    transport,
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
