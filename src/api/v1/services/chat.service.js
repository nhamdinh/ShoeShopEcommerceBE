"use strict";
const util = require("util");
const logger = require("../log");

const { ForbiddenRequestError } = require("../core/errorResponse");

class SocketServices {
  static connection(socket) {
    logger.info("New client connected socket.id === " + socket.id);
    // socket.emit("serverSetSocketId", socket.id);

    // event on here
    socket.on("clientSendData", function (data) {
      //   const updateStory = async () => {
      //     let chatStories = await ChatStory.find({
      //       fromTo: [data?.sendFrom, data?.to],
      //     });

      //     if (chatStories?.length === 0) {
      //       chatStories = await ChatStory.find({
      //         fromTo: [data?.to, data?.sendFrom],
      //       });
      //     }

      //     if (chatStories?.length === 0) {
      //       await ChatStory.create({
      //         fromTo: [data?.sendFrom, data?.to],
      //         story: [{ ...data }],
      //       });
      //     } else {
      //       chatStories[0].story = [...chatStories[0]?.story, data];
      //       await chatStories[0].save();
      //     }
      //   };

      //   const updateUser = async () => {
      //     let users = await UserModel.find({
      //       email: data?.sendFrom,
      //     });
      //     if (users?.length > 0) {
      //       users[0].countChat = +users[0].countChat + 1;
      //     }
      //     // logger.info(
      //     //   `users ::: ${util.inspect(users, {
      //     //     showHidden: false,
      //     //     depth: null,
      //     //     colors: false,
      //     //   })}`
      //     // );

      //     UserModel.findByIdAndUpdate(users[0]._id, {
      //       countChat: users[0].countChat,
      //     }).exec();

      //     // await users[0].save();
      //     // await users[0].update(users[0]);
      //   };

      // updateStory();
      // updateUser();

      logger.info(
        `data ::: ${util.inspect(data, {
          showHidden: false,
          depth: null,
          colors: false,
        })}`
      );

      gb__socketIo.emit("serverSendData", data);
    });

    socket.on("disconnect", () => {
      logger.info(`Client socket disconnect socket.id ${socket.id}`);
    });
  }

  static sendMessage = async ({ chatBody }) => {
    // console.log(`msg ::::::::::::: `,msg)
    // gb__socketIo.emit("serverSendData", data);

    gb__socketIo.emit("serverSendData", chatBody);

    // const io = res.io;
    // _io.emit('chat message', msg)
    return { ...chatBody };
  };
}

module.exports = SocketServices;
