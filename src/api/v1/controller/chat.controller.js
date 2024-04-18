"use strict";
const util = require("util");
const logger = require("../log");
const { CREATED, OK } = require("../core/successResponse");
const SocketServices = require("../services/chat.service");

class ChatController {
  sendMessage = async (req, res, next) => {
    new CREATED({
      message: "sendMessage OK",
      metadata: await SocketServices.sendMessage({
        chatBody: req.body,
      }),
    }).send(res);
  };
}

module.exports = new ChatController();
