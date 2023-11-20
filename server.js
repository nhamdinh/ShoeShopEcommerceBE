const os = require("os");
require("dotenv").config();
const app = require("./app");
const server = require("./socket");
const logger = require("./src/api/v1/log");

process.env.UV_THREADPOOL_SIZE = Math.floor(Number(os.cpus().length) * 0.8);
logger.info(
  "Number of UV_THREADPOOL_SIZE ::: " +
    Math.floor(Number(os.cpus().length) * 0.8)
);

const { SOCKET_PORT } = process.env || 6000;
server.listen(SOCKET_PORT, () => {
  console.log(`Server socketIo run in port ${SOCKET_PORT}`);
});

const { PORT } = process.env || 5000;
app.listen(PORT, () => {
  console.log(`server run in port ${PORT}`);
});

process.on("SIGINT", () => {
  server.close(() => {
    console.log(`Server shutdown`);
  });
});
