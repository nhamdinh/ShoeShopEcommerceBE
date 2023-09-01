const http = require("http");
const app = require("./app");
const ChatStory = require("./Models/ChatStoryModel");

const server = http.createServer(app);
const socketIo = require("socket.io")(server, {
  cors: {
    origin: "*",
  },
});

socketIo.on("connection", (socket) => {
  console.log("New client connected socket.id === " + socket.id);

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
        const upStory = await chatStories[0].save();
        console.log("updateStory  ::::::  ", upStory);
      }
    };

    updateStory();

    socketIo.emit("serverSendData", data);
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected");
  });
});

module.exports = server;
