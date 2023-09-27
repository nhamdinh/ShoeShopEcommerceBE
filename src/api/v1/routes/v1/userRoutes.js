const express = require("express");

const { protect, admin } = require("./../../Middleware/AuthMiddleware");

const {
  getAllUser,
  getAllUserByAdmin,
  login,
  logout,
  register,
  getProfile,
  updateProfile,
  getAllChats,
  getStory,
  clearCountChat,
} = require("../../controller/user.controller");
const { validate } = require("../../validations");

const userRouter = express.Router();

// LOGIN
userRouter.post("/login", validate.validateLogin(), login);

// LOGOUT
userRouter.post("/logout", logout);

// REGISTER
userRouter.post("/register", validate.validateRegisterUser(), register);

// PROFILE
userRouter.get("/profile", protect, getProfile);

// UPDATE PROFILE
userRouter.put("/update-profile", protect, updateProfile);

// ADMIN GET ALL USER
userRouter.get("/all-admin", protect, admin, getAllUserByAdmin);

// GET ALL USER
userRouter.get("/get-all", getAllUser);
/* =======================  CHAT STORIES ======================= */
// GET ALL CHAT STORIES
userRouter.get("/get-all-chats", getAllChats);

userRouter.get("/get-story", protect, getStory);

userRouter.put("/clear-count-chat", protect, admin, clearCountChat);

module.exports = userRouter;
