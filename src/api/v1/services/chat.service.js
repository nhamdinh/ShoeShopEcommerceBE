"use strict";
const util = require("util");
const logger = require("../log");
const { convertToObjectId } = require("../utils/getInfo");
const { ForbiddenRequestError } = require("../core/errorResponse");
const {
  findChatsRepo,
  findByIdAndUpdateChatRepo,
  createChatStoryRepo,
} = require("../repositories/chat.repo");
const {
  findUserByEmailRepo,
  findByIdAndUpdateUserRepo,
} = require("../repositories/user.repo");

class SocketServices {
  static connection(socket) {
    logger.info("New client connected socket.id === " + socket.id);
    // socket.emit("serverSetSocketId", socket.id);

    // event on here
    socket.on("clientSendData", function (data) {
      SocketServices.updateStory(data);
      SocketServices.updateCountChatUser(data);

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
    SocketServices.updateStory(chatBody);
    SocketServices.updateCountChatUser(chatBody);
    gb__socketIo.emit("serverSendData", chatBody);
    return { ...chatBody };
  };

  static updateStory = async (data) => {
    let chatStories = await findChatsRepo({
      filter: {
        fromTo: [data?.sendFrom, data?.to],
      },
      // unSelect: ["story"],
    });

    if (chatStories?.length === 0) {
      chatStories = await findChatsRepo({
        filter: {
          fromTo: [data?.to, data?.sendFrom],
        },
        // unSelect: ["story"],
      });
    }

    // logger.info(
    //   `chatStories ::: ${util.inspect(chatStories, {
    //     showHidden: false,
    //     depth: null,
    //     colors: false,
    //   })}`
    // );

    if (chatStories?.length === 0) {
      await createChatStoryRepo({
        fromTo: [data?.sendFrom, data?.to],
        story: [{ ...data }],
      });
    } else {
      const chatStory = chatStories[0];
      const story = [...chatStory.story, data];

      await findByIdAndUpdateChatRepo({
        id: convertToObjectId(chatStory._id),
        updateSet: {
          story,
        },
      });
    }
  };

  static updateCountChatUser = async (data) => {
    const user = await findUserByEmailRepo({
      email: data?.sendFrom,
    });

    if (!user) throw new ForbiddenRequestError("User already NOT exists");

    const countChat = +user.countChat + 1;

    await findByIdAndUpdateUserRepo({
      id: convertToObjectId(user._id),
      updateSet: {
        countChat,
      },
    });
  };
}

module.exports = SocketServices;
