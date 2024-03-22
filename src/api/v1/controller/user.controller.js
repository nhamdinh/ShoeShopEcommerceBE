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

// module.exports = {
//   logout,
//   getAllChats,
//   clearCountChat,
// };

class UserController {
  register = async (req, res, next) => {
    new CREATED({
      message: "register CREATED",
      metadata: await UserServices.register(req),
    }).send(res);
  };

  getProfileShop = async (req, res) => {
    new OK({
      message: "getProfileShop OK",
      metadata: await UserServices.getProfileShop({
        id: req.query.product_shop,
      }),
    }).send(res);
  };

  getProfile = async (req, res) => {
    new OK({
      message: "getProfile OK",
      metadata: await UserServices.getProfile({
        id: req.user._id,
      }),
    }).send(res);
  };

  login = async (req, res) => {
    new OK({
      message: "login OK",
      metadata: await UserServices.login(req),
    }).send(res);
  };

  findAllUsers = async (req, res) => {
    new OK({
      message: "findAllUsers OK",
      metadata: await UserServices.findAllUsers({
        query: req.query,
      }),
    }).send(res);
  };

  updateProfile = async (req, res, next) => {
    new CREATED({
      message: "updateProfile CREATED",
      metadata: await UserServices.updateProfile({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        id: req.user._id,
      }),
    }).send(res);
  };

  updateIsShop = async (req, res, next) => {
    new CREATED({
      message: "updateIsShop CREATED",
      metadata: await UserServices.updateIsShop({
        id: req.user._id,
        productShopName: req.body.productShopName,
      }),
    }).send(res);
  };

  clearCountChat = async (req, res, next) => {
    new CREATED({
      message: "clearCountChat CREATED",
      metadata: await UserServices.clearCountChat({
        req,
      }),
    }).send(res);
  };

  findAllUserByAdmin = async (req, res, next) => {
    new OK({
      message: "findAllUserByAdmin OK",
      metadata: await UserServices.findAllUserByAdmin({
        req,
      }),
    }).send(res);
  };

  getStory = async (req, res, next) => {
    new OK({
      message: "getStory OK",
      metadata: await UserServices.getStory({
        req,
      }),
    }).send(res);
  };
}

module.exports = new UserController();
