const express = require("express");
const asyncHandler = require("express-async-handler");

const { admin, protect } = require("../../Middleware/AuthMiddleware");

const generateToken = require("../../utils/generateToken");
const User = require("../../Models/UserModel");
const ChatStory = require("../../Models/ChatStoryModel");

const userRouter = express.Router();

// LOGIN
userRouter.post(
  "/login",
  asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        isAdmin: user.isAdmin,
        token: generateToken(user._id),
        createdAt: user.createdAt,
      });
    } else {
      res.status(401).json({ message: "Invalid Email or Password" });
      throw new Error("Invalid Email or Password");
    }
  })
);

// REGISTER
userRouter.post(
  "/register",
  asyncHandler(async (req, res) => {
    const { name, email, password, phone, isAdmin } = req.body;
    const userExists = await User.findOne({ email });

    if (userExists) {
      res.status(400).json({ message: "User already exists" });
      throw new Error("User already exists");
    }

    const user = await User.create({
      name,
      email,
      phone,
      password,
      isAdmin,
    });

    if (user) {
      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        isAdmin: user.isAdmin,
        token: generateToken(user._id),
      });
    } else {
      res.status(400).json({ message: "Invalid User Data" });
      throw new Error("Invalid User Data");
    }
  })
);

// PROFILE
userRouter.get(
  "/profile",
  protect,
  asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id);

    const admins = await User.find({ isAdmin: true })
      .select("email")
      .select("phone");
    if (user) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        isAdmin: user.isAdmin,
        createdAt: user.createdAt,
        admins,
      });
    } else {
      res.status(404).json({ message: "User not Found" });
      throw new Error("User not found");
    }
  })
);

// UPDATE PROFILE
userRouter.put(
  "/update-profile",
  protect,
  asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id);

    if (user) {
      user.name = req.body.name || user.name;
      user.email = req.body.email || user.email;
      user.phone = req.body.phone || user.phone;
      if (req.body.password) {
        user.password = req.body.password;
      }
      const updatedUser = await user.save();
      res.json({
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        phone: updatedUser.phone,
        isAdmin: updatedUser.isAdmin,
        createdAt: updatedUser.createdAt,
        token: generateToken(updatedUser._id),
      });
    } else {
      res.status(404).json({ message: "User not Found" });
      throw new Error("User not found");
    }
  })
);

// ADMIN GET ALL USER
userRouter.get(
  "/all-admin",
  protect,
  admin,
  asyncHandler(async (req, res) => {
    const count = await User.countDocuments({});
    const users = await User.find({}).sort({ createdAt: -1 });
    res.json({ count, users });
  })
);

// GET ALL USER
userRouter.get(
  "/get-all",
  asyncHandler(async (req, res) => {
    const count = await User.countDocuments({});
    const users = await User.find({});
    res.json({ count, users });
  })
);
/* =======================  CHAT STORIES ======================= */
// GET ALL CHAT STORIES
userRouter.get(
  "/get-all-chats",
  asyncHandler(async (req, res) => {
    const count = await ChatStory.countDocuments({});
    const chatStorys = await ChatStory.find({});
    res.json({ count, chatStorys });
  })
);

userRouter.get(
  "/get-story",
  protect,
  asyncHandler(async (req, res) => {
    console.log("req ::: ", req.query);

    let chatStories = await ChatStory.find({
      fromTo: [req.query?.user1, req.query?.user2],
    });

    if (chatStories?.length === 0) {
      chatStories = await ChatStory.find({
        fromTo: [req.query?.user2, req.query?.user1],
      });
    }

    if (chatStories?.length === 0) {
      res.json({ count, chatStorys });
    } else {

    }

    try {
      token = req.headers.authorization.split(" ")[1];

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.id).select("-password");
      next();
    } catch (error) {
      console.error(error);
      res.status(401).json({ message: "Not authorized, token failed" });
      throw new Error("Not authorized, token failed");
    }

  })
);

module.exports = userRouter;
