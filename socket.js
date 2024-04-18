const http = require("http");
const app = require("./app");
const util = require("util");
const logger = require("./src/api/v1/log");

const SocketServices = require("./src/api/v1/services/chat.service");

const socketServer = http.createServer(app);
const socketIo = require("socket.io")(socketServer, {
  cors: {
    origin: "*",
  },
});
global.gb__socketIo = socketIo;

gb__socketIo.on("connection", SocketServices.connection);

module.exports = socketServer;
