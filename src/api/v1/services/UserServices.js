"use strict";
const { validationResult } = require("express-validator");
const crypto = require("node:crypto");
const bcrypt = require("bcrypt");

const { ForbiddenRequestError } = require("../core/errorResponse");
const User = require("../Models/UserModel");
const KeyTokenServices = require("./KeyTokenServices");
const { getInfoData } = require("../utils/getInfo");
const { createToken } = require("../utils/authUtils");
const logger = require("../log");
const generateRefreshToken = require("../utils/generateRefreshToken");
const generateToken = require("../utils/generateToken");

class UserServices {
  static login = async (req) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw new ForbiddenRequestError(
        errors.array().length > 0 ? errors.array()[0]?.msg : "Invalid input",
        422
      );
    }

    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      throw new ForbiddenRequestError("Wrong Email or Password");
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      throw new ForbiddenRequestError("Wrong Email or Password");
    }
    console.log(`user ::: ${user}`);

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

    return {
      ...getInfoData({
        object: user,
        fields: ["_id", "name", "email", "phone", "isAdmin", "createdAt"],
      }),
      refreshToken: refreshToken,
      token: await generateToken(user._id),
    };
  };
  // function parseCookies(request) {
  //   const list = {};
  //   const cookieHeader = request.headers?.cookie;
  //   if (!cookieHeader) return list;

  //   cookieHeader.split(`;`).forEach(function (cookie) {
  //     let [name, ...rest] = cookie.split(`=`);
  //     name = name?.trim();
  //     if (!name) return;
  //     const value = rest.join(`=`).trim();
  //     if (!value) return;
  //     list[name] = decodeURIComponent(value);
  //   });

  //   return list;
  // }

  static getProfile = async (req) => {
    const user = await User.findById(req.user._id);

    const admins = await User.find({ isAdmin: true })
      .select("email")
      .select("phone");
    // logger.info(`admins ::: ${admins}`);
    if (!user) {
      throw new ForbiddenRequestError("User not Found");
    }
    return {
      ...getInfoData({
        object: user,
        fields: ["_id", "name", "email", "phone", "isAdmin", "createdAt"],
      }),
      admins,
    };
  };

  static register = async (req) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      // res.status(422).json(errors.array());
      throw new ForbiddenRequestError(
        errors.array().length > 0 ? errors.array()[0]?.msg : "Invalid input",
        422
      );
    }
    const { name, email, password, phone, isAdmin } = req.body;
    const userExists = await User.findOne({ email }).lean(); //giam size OBJECT, tra ve 1 obj js original, neu k trar ve nhieu thong tin hon
    if (userExists) {
      throw new ForbiddenRequestError("User already exists");
    }

    const newUser = await User.create({
      name,
      email,
      phone,
      password,
      isAdmin,
    });
    if (!newUser) {
      throw new ForbiddenRequestError("Invalid User Data");
    }

    /* create public key; private key; createKeyToken by key */
    const { publicKey, privateKey } = crypto.generateKeyPairSync("rsa", {
      modulusLength: 4096,
      publicKeyEncoding: {
        type: "pkcs1",
        format: "pem",
      },
      privateKeyEncoding: {
        type: "pkcs1",
        format: "pem",
      },
    });

    const publicKeyString = await KeyTokenServices.createKeyToken({
      userId: newUser._id,
      publicKey,
      privateKey,
    });

    if (!publicKeyString) {
      throw new ForbiddenRequestError("publicKey Error");
    }
    // console.log(" newUser._id .toString()::::::", newUser._id.toString());
    // const { token, refreshToken } = await createToken(
    //   {
    //     userId: newUser._id,
    //     email,
    //   },
    //   publicKeyString,
    //   privateKey
    // );
    /* create public key; private key; createKeyToken by key */

    const refreshToken = await generateRefreshToken(newUser?._id);
    const token = await generateToken(newUser?._id);

    return {
      ...getInfoData({
        object: newUser,
        fields: ["_id", "name", "email"],
      }),
      refreshToken,
      token,
    };
  };
}
module.exports = UserServices;