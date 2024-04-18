"use strict";
const express = require("express");
const asyncHandler = require("express-async-handler");
const chatController = require("../../controller/chat.controller");

const chatRoute = express.Router();

chatRoute.post("/send-message", asyncHandler(chatController.sendMessage));

module.exports = chatRoute;
