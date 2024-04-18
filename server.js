const os = require("os");
const util = require("util");
const logger = require("./src/api/v1/log");
require("dotenv").config();
const app = require("./app");
const socketServer = require("./socket");

/* chay voi bao nhieu core */
process.env.UV_THREADPOOL_SIZE = Math.floor(Number(os.cpus().length) * 1);
// logger.info(
//   "Number of UV_THREADPOOL_SIZE ::: " +
//     Math.floor(Number(os.cpus().length) * 0.8)
// );

const {
  PORT = 5000,
  SOCKET_PORT = 6000,
  NODE_ENV,
  UV_THREADPOOL_SIZE,
} = process.env;

socketServer.listen(SOCKET_PORT, () => {
  logger.info(`Server socketIo run in port ${SOCKET_PORT}`);
});

app.listen(PORT, () => {
  logger.info(`server run in port ${PORT} ::: NODE_ENV ${NODE_ENV}`);
  logger.info(`Date toString ${(new Date()).toString()}`);
  logger.info(`Number of UV_THREADPOOL_SIZE ::: ${UV_THREADPOOL_SIZE}`);
});

process.on("SIGINT", () => {
  socketServer.close(() => {
    logger.info(`socketServer shutdown`);
  });
});
