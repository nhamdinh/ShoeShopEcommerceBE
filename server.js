require("dotenv").config();
const app = require("./app");
const server = require("./socket");

const { SOCKET_PORT } = process.env || 6000;

server.listen(SOCKET_PORT, () => {
  console.log(`Server socketIo run in port ${SOCKET_PORT}`);
});

const { PORT } = process.env || 5000;
app.listen(PORT, () => {
  console.log(`server run in port ${PORT}`);
});
