"use strict";
const express = require("express");
const asyncHandler = require("express-async-handler");
const { protect } = require("./../../Middleware/AuthMiddleware");

const chatController = require("../../controller/chat.controller");

const chatRoute = express.Router();

chatRoute.post(
  "/send-message",
  // protect,
  asyncHandler(chatController.sendMessage)
);

module.exports = chatRoute;
