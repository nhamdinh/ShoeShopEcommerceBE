"use strict";

const asyncHandler = require("express-async-handler");
const generateToken = require("../utils/generateToken");
const generateRefreshToken = require("../utils/generateRefreshToken");
const crypto = require("node:crypto");

const { validationResult } = require("express-validator");

const User = require("../Models/UserModel");
const ChatStory = require("../Models/ChatStoryModel");
const logger = require("../log");
const { COOKIE_REFRESH_TOKEN } = require("../utils/constant");
const KeyTokenServices = require("../services/KeyTokenServices");
const { createToken } = require("../utils/authUtils");
const { getInfoData } = require("../utils/getInfo");
const { ForbiddenRequestError } = require("../core/errorResponse");
const UserServices = require("./../services/UserServices");
const { CREATED, OK } = require("../core/successResponse");

// const getAllUser = asyncHandler(async (req, res) => {
//   try {
//     const count = await User.countDocuments({});
//     const users = await User.find({});
//     res.json({ count, users });
//   } catch (error) {
//     throw new Error(error);
//   }
// });

// const getAllUserByAdmin = asyncHandler(async (req, res) => {
//   try {
//     const searchBy = req.query?.searchBy || "email";

//     const keyword = req.query?.keyword
//       ? searchBy === "email"
//         ? {
//             email: {
//               $regex: req.query?.keyword,
//               $options: "i",
//             },
//           }
//         : {
//             phone: {
//               $regex: req.query?.keyword,
//               $options: "i",
//             },
//           }
//       : {};

//     const count = await User.countDocuments({
//       ...keyword,
//     });
//     const users = await User.find({
//       ...keyword,
//     })
//       .select("-password")
//       .sort({ createdAt: -1 });
//     res.json({ count, users });
//   } catch (error) {
//     throw new Error(error);
//   }
// });

// const logout = asyncHandler(async (req, res) => {
//   try {
//     // const cookie = req.headers?.cookie;
//     // const cookie = req.cookies[COOKIE_REFRESH_TOKEN];
//     const cookies = parseCookies(req);
//     logger.info(cookies);

//     const list = {};
//     // const cookieHeader = req.headers?.cookie;
//     const cookieHeader = req.signedCookies;

//     if (!cookieHeader) throw new Error("No Refresh Token in Cookies");

//     cookieHeader.split(`;`).forEach(function (cookie) {
//       let [name, ...rest] = cookie.split(`=`);
//       name = name?.trim();
//       if (!name) return;
//       const value = rest.join(`=`).trim();
//       if (!value) return;
//       list[name] = decodeURIComponent(value);
//     });
//     // logger.info("cookie ::: " + list[COOKIE_REFRESH_TOKEN]);

//     const refreshToken = list?.refreshToken;
//     const user = await User.findOne({ refreshToken });
//     if (!user) {
//       res.clearCookie(COOKIE_REFRESH_TOKEN, {
//         httpOnly: true,
//         secure: true,
//       });
//       res.status(200); // forbidden
//     }
//     await User.findOneAndUpdate(refreshToken, {
//       refreshToken: "",
//     });
//     res.clearCookie(COOKIE_REFRESH_TOKEN, {
//       httpOnly: true,
//       secure: true,
//     });
//     res.status(200); // forbidden
//   } catch (error) {
//     throw new Error(error);
//   }
// });

// const updateProfile = asyncHandler(async (req, res) => {
//   try {
//     const user = await User.findById(req.user._id);

//     if (user) {
//       user.name = req.body.name || user.name;
//       user.email = req.body.email || user.email;
//       user.phone = req.body.phone || user.phone;
//       if (req.body.password) {
//         user.password = req.body.password;
//       }
//       const updatedUser = await user.save();
//       res.json({
//         _id: updatedUser._id,
//         name: updatedUser.name,
//         email: updatedUser.email,
//         phone: updatedUser.phone,
//         isAdmin: updatedUser.isAdmin,
//         createdAt: updatedUser.createdAt,
//         // token: generateToken(updatedUser._id),
//       });
//     } else {
//       res.status(200).json({ message: "User not Found" });
//       throw new Error("User not found");
//     }
//   } catch (error) {
//     throw new Error(error);
//   }
// });

// /* =======================  CHAT STORIES ======================= */
// const getAllChats = asyncHandler(async (req, res) => {
//   try {
//     const count = await ChatStory.countDocuments({});
//     const chatStorys = await ChatStory.find({});
//     res.json({ count, chatStorys });
//   } catch (error) {
//     throw new Error(error);
//   }
// });

// const getStory = asyncHandler(async (req, res) => {
//   try {
//     let chatStories = await ChatStory.find({
//       fromTo: [req.query?.user1, req.query?.user2],
//     });

//     if (chatStories?.length === 0) {
//       chatStories = await ChatStory.find({
//         fromTo: [req.query?.user2, req.query?.user1],
//       });
//     }

//     if (chatStories?.length === 0) {
//       res.json({ chatStories: {} });
//     } else {
//       res.json({ chatStories: chatStories[0] });
//     }
//   } catch (error) {
//     console.error(error);
//     res.status(401).json({ message: "chatStories not found" });
//     throw new Error("chatStories not found");
//   }
// });

// const clearCountChat = asyncHandler(async (req, res) => {
//   try {
//     let users = await User.find({
//       email: req.body.email,
//     });
//     console.log("users :::", users);
//     if (users?.length > 0) {
//       users[0].countChat = 0;
//     }
//     const user = await users[0].save();
//     res.json({ user });
//   } catch (error) {
//     console.error(error);
//     res.status(401).json({ message: "User not found" });
//     throw new Error("User not found");
//   }
// });

// module.exports = {
//   getAllUser,
//   getAllUserByAdmin,
//   logout,
//   updateProfile,
//   getAllChats,
//   getStory,
//   clearCountChat,
// };

class UserController {
  register = async (req, res, next) => {
    new CREATED({
      message: "register CREATED",
      metadata: await UserServices.register(req),
    }).send(res);
  };

  getProfile = async (req, res) => {
    new OK({
      message: "getProfile OK",
      metadata: await UserServices.getProfile(req),
    }).send(res);
  };

  login = async (req, res) => {
    new OK({
      message: "login OK",
      metadata: await UserServices.login(req),
    }).send(res);
  };
}

module.exports = new UserController();
