"use strict";

const mongoose = require("mongoose");
const os = require("os");
const process = require("process");
const logger = require("../log");
const _SECONDS = 5000;
const countNumConnection = () => {
  const numConnections = mongoose.connections.length;
  logger.info("Number of Connection ::: " + numConnections);
};

const checkOverload = () => {
  setInterval(() => {
    const numConnections = mongoose.connections.length;
    const numCores = os.cpus().length;
    const memoryUsage = process.memoryUsage().rss;
    const maxConnections = numCores * 5;
    console.log(`memoryUsage ::: ${(memoryUsage / 1024 / 1024).toFixed(2)} MB`);
    if (numConnections > (maxConnections * 80) / 100) {
      console.log(
        `Connections overload detected: ${numConnections}/${maxConnections}`
      );
    }
  }, _SECONDS);
};

module.exports = {
  countNumConnection,
  checkOverload,
};
