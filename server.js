const os = require("os");
require("dotenv").config();
const app = require("./app");
const socketServer = require("./socket");
const logger = require("./src/api/v1/log");

/* chay voi bao nhieu core */
process.env.UV_THREADPOOL_SIZE = Math.floor(Number(os.cpus().length) * 0.8);
// logger.info(
//   "Number of UV_THREADPOOL_SIZE ::: " +
//     Math.floor(Number(os.cpus().length) * 0.8)
// );

const { SOCKET_PORT } = 6000;
socketServer.listen(SOCKET_PORT, () => {
  console.log(`Server socketIo run in port ${SOCKET_PORT}`);
});

const { PORT, NODE_ENV } = process.env || 5000;
app.listen(PORT, () => {
  console.log(`server run in port ${PORT} ::: ${NODE_ENV}`);
});

process.on("SIGINT", () => {
  socketServer.close(() => {
    console.log(`socketServer shutdown`);
  });
});
