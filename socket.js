const http = require("http");
const app = require("./app");

const ChatStory = require("./src/api/v1/Models/ChatStoryModel");
const User = require("./src/api/v1/Models/UserModel");
const logger = require("./src/api/v1/log");

const server = http.createServer(app);
const socketIo = require("socket.io")(server, {
  cors: {
    origin: "*",
  },
});

socketIo.on("connection", (socket) => {
  logger.info("New client connected socket.id === " + socket.id);
  socket.emit("serverSetSocketId", socket.id);

  socket.on("clientSendData", function (data) {
    const updateStory = async () => {
      let chatStories = await ChatStory.find({
        fromTo: [data?.sendFrom, data?.to],
      });

      if (chatStories?.length === 0) {
        chatStories = await ChatStory.find({
          fromTo: [data?.to, data?.sendFrom],
        });
      }

      if (chatStories?.length === 0) {
        await ChatStory.create({
          fromTo: [data?.sendFrom, data?.to],
          story: [{ ...data }],
        });
      } else {
        chatStories[0].story = [...chatStories[0]?.story, data];
        await chatStories[0].save();
      }
    };

    const updateUser = async () => {
      let users = await User.find({
        email: data?.sendFrom,
      });
      if (users?.length > 0) {
        users[0].countChat = +users[0].countChat + 1;
      }
      await users[0].save();
    };

    updateStory();
    updateUser();
    socketIo.emit("serverSendData", data);
  });

  socket.on("disconnect", () => {
    logger.info("Client disconnected");
  });
});

module.exports = server;
