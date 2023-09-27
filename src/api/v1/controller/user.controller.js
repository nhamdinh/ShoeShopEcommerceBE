const asyncHandler = require("express-async-handler");
const generateToken = require("../utils/generateToken");
const generateRefreshToken = require("../utils/generateRefreshToken");

const { validationResult } = require("express-validator");

const User = require("../Models/UserModel");
const ChatStory = require("../Models/ChatStoryModel");
const logger = require("../log");
const { COOKIE_REFRESH_TOKEN } = require("../utils/constant");

const getAllUser = asyncHandler(async (req, res) => {
  try {
    const count = await User.countDocuments({});
    const users = await User.find({});
    res.json({ count, users });
  } catch (error) {
    throw new Error(error);
  }
});

const getAllUserByAdmin = asyncHandler(async (req, res) => {
  try {
    const searchBy = req.query?.searchBy || "email";

    const keyword = req.query?.keyword
      ? searchBy === "email"
        ? {
            email: {
              $regex: req.query?.keyword,
              $options: "i",
            },
          }
        : {
            phone: {
              $regex: req.query?.keyword,
              $options: "i",
            },
          }
      : {};

    const count = await User.countDocuments({
      ...keyword,
    });
    const users = await User.find({
      ...keyword,
    })
      .select("-password")
      .sort({ createdAt: -1 });
    res.json({ count, users });
  } catch (error) {
    throw new Error(error);
  }
});

const login = asyncHandler(async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(422).json(errors.array());
      return;
    }

    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
      logger.info(user);
      const refreshToken = await generateRefreshToken(user?._id);
      await User.findByIdAndUpdate(user._id, {
        refreshToken: refreshToken,
      });

      // res.cookie(COOKIE_REFRESH_TOKEN, refreshToken, {
      //   httpOnly: true,
      //   maxAge: 72 * 60 * 60 * 1000,
      //   signed: true,
      // });
      // res.cookie(COOKIE_REFRESH_TOKEN,`encrypted cookie string Value`);

      // res.cookie('cookieName', 'cookieValue') // options is optional
      // res.send('')

      logger.info("refreshToken ::: " + refreshToken);

      // res
      //   .cookie("access_token", "token")
      //   .json({ message: "Logged in successfully 😊 👌" });

      return res.cookie("access_token1", "token1111").json({
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        isAdmin: user.isAdmin,
        refreshToken: refreshToken,
        token: generateToken(user._id),
        createdAt: user.createdAt,
      });
    } else {
      res.status(401).json({ message: "Wrong Email or Password" });
      throw new Error("Wrong Email or Password");
    }
  } catch (error) {
    throw new Error(error);
  }
});
function parseCookies(request) {
  const list = {};
  const cookieHeader = request.headers?.cookie;
  if (!cookieHeader) return list;

  cookieHeader.split(`;`).forEach(function (cookie) {
    let [name, ...rest] = cookie.split(`=`);
    name = name?.trim();
    if (!name) return;
    const value = rest.join(`=`).trim();
    if (!value) return;
    list[name] = decodeURIComponent(value);
  });

  return list;
}
const logout = asyncHandler(async (req, res) => {
  try {
    // const cookie = req.headers?.cookie;
    // const cookie = req.cookies[COOKIE_REFRESH_TOKEN];
    const cookies = parseCookies(req);
    logger.info(cookies);

    const list = {};
    // const cookieHeader = req.headers?.cookie;
    const cookieHeader = req.signedCookies;

    if (!cookieHeader) throw new Error("No Refresh Token in Cookies");

    cookieHeader.split(`;`).forEach(function (cookie) {
      let [name, ...rest] = cookie.split(`=`);
      name = name?.trim();
      if (!name) return;
      const value = rest.join(`=`).trim();
      if (!value) return;
      list[name] = decodeURIComponent(value);
    });
    // logger.info("cookie ::: " + list[COOKIE_REFRESH_TOKEN]);

    const refreshToken = list?.refreshToken;
    const user = await User.findOne({ refreshToken });
    if (!user) {
      res.clearCookie(COOKIE_REFRESH_TOKEN, {
        httpOnly: true,
        secure: true,
      });
      res.status(200); // forbidden
    }
    await User.findOneAndUpdate(refreshToken, {
      refreshToken: "",
    });
    res.clearCookie(COOKIE_REFRESH_TOKEN, {
      httpOnly: true,
      secure: true,
    });
    res.status(200); // forbidden
  } catch (error) {
    throw new Error(error);
  }
});

const register = asyncHandler(async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(422).json(errors.array());
      return;
    }

    const { name, email, password, phone, isAdmin } = req.body;
    const userExists = await User.findOne({ email });

    if (userExists) {
      res.status(400).json({ message: "User already exists" });
      throw new Error("User already exists");
    }
    const refreshToken = await generateRefreshToken(user?._id);

    const user = await User.create({
      name,
      email,
      phone,
      password,
      isAdmin,
      refreshToken,
    });

    if (user) {
      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        isAdmin: user.isAdmin,
        refreshToken: refreshToken,
        token: generateToken(user._id),
      });
    } else {
      res.status(400).json({ message: "Invalid User Data" });
      throw new Error("Invalid User Data");
    }
  } catch (error) {
    throw new Error(error);
  }
});

const getProfile = asyncHandler(async (req, res) => {
  try {
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
      res.status(200).json({ message: "User not Found" });
      throw new Error("User not found");
    }
  } catch (error) {
    throw new Error(error);
  }
});

const updateProfile = asyncHandler(async (req, res) => {
  try {
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
        // token: generateToken(updatedUser._id),
      });
    } else {
      res.status(200).json({ message: "User not Found" });
      throw new Error("User not found");
    }
  } catch (error) {
    throw new Error(error);
  }
});

/* =======================  CHAT STORIES ======================= */
const getAllChats = asyncHandler(async (req, res) => {
  try {
    const count = await ChatStory.countDocuments({});
    const chatStorys = await ChatStory.find({});
    res.json({ count, chatStorys });
  } catch (error) {
    throw new Error(error);
  }
});

const getStory = asyncHandler(async (req, res) => {
  try {
    let chatStories = await ChatStory.find({
      fromTo: [req.query?.user1, req.query?.user2],
    });

    if (chatStories?.length === 0) {
      chatStories = await ChatStory.find({
        fromTo: [req.query?.user2, req.query?.user1],
      });
    }

    if (chatStories?.length === 0) {
      res.json({ chatStories: {} });
    } else {
      res.json({ chatStories: chatStories[0] });
    }
  } catch (error) {
    console.error(error);
    res.status(401).json({ message: "chatStories not found" });
    throw new Error("chatStories not found");
  }
});

const clearCountChat = asyncHandler(async (req, res) => {
  try {
    let users = await User.find({
      email: req.body.email,
    });
    console.log("users :::", users);
    if (users?.length > 0) {
      users[0].countChat = 0;
    }
    const user = await users[0].save();
    res.json({ user });
  } catch (error) {
    console.error(error);
    res.status(401).json({ message: "User not found" });
    throw new Error("User not found");
  }
});

module.exports = {
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
};
