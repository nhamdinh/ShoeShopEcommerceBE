const express = require("express");
const asyncHandler = require("express-async-handler");

const { protect, admin } = require("./../../Middleware/AuthMiddleware");

const { validate } = require("../../validations");
const userController = require("../../controller/user.controller");

const userRouter = express.Router();

// LOGIN
userRouter.post(
  "/login",
  validate.validateLogin(),
  asyncHandler(userController.login)
);

// // LOGOUT
// userRouter.post("/logout", logout);

// REGISTER
userRouter.post(
  "/register",
  validate.validateRegisterUser(),
  asyncHandler(userController.register)
);

// PROFILE
userRouter.get("/profile", protect, asyncHandler(userController.getProfile));

// PROFILE
userRouter.get("/profile-shop", asyncHandler(userController.getProfileShop));

// UPDATE PROFILE
userRouter.put("/update-profile", protect, userController.updateProfile);

// UPDATE ISSHOP??
userRouter.put("/update-is-shop", protect, userController.updateIsShop);

// // ADMIN GET ALL USER
// userRouter.get("/all-admin", protect, admin, findAllUserByAdmin);

// GET ALL USER
userRouter.get("/get-all", userController.getAllUsers);
// /* =======================  CHAT STORIES ======================= */
// // GET ALL CHAT STORIES
// userRouter.get("/get-all-chats", getAllChats);

// userRouter.get("/get-story", protect, getStory);

// userRouter.put("/clear-count-chat", protect, admin, clearCountChat);

module.exports = userRouter;
