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
userRouter.put(
  "/update-profile",
  protect,
  asyncHandler(userController.updateProfile)
);

// UPDATE ISSHOP??
userRouter.put(
  "/update-is-shop",
  protect,
  asyncHandler(userController.updateIsShop)
);

// // ADMIN GET ALL USER
userRouter.get(
  "/all-admin",
  protect,
  admin,
  asyncHandler(userController.findAllUserByAdmin)
);

// GET ALL USER
userRouter.get("/get-all", asyncHandler(userController.findAllUsers));
// /* =======================  CHAT STORIES ======================= */
// // GET ALL CHAT STORIES
// userRouter.get("/get-all-chats", getAllChats);

userRouter.get("/get-story", protect, asyncHandler(userController.getStory));

userRouter.put(
  "/clear-count-chat",
  protect,
  admin,
  asyncHandler(userController.clearCountChat)
);

module.exports = userRouter;
