"use strict";
const util = require("util");
const logger = require("../log");

const { validationResult } = require("express-validator");
const crypto = require("node:crypto");
const bcrypt = require("bcrypt");

const { ForbiddenRequestError } = require("../core/errorResponse");
const KeyTokenServices = require("./KeyTokenServices");
const { getInfoData } = require("../utils/getInfo");
const { createToken } = require("../utils/authUtils");
const generateRefreshToken = require("../utils/generateRefreshToken");
const generateToken = require("../utils/generateToken");
const {
  findUserByEmailRepo,
  findByIdAndUpdateTokenRepo,
  findUserByIdRepo,
  findAllAdminUsersRepo,
  createUserRepo,
  getAllUsersRepo,
} = require("../repositories/user.repo");

class UserServices {
  static updateIsShop = async ({ id, productShopName }) => {
    const user = await findUserByIdRepo(id);

    if (!user) throw new ForbiddenRequestError("User not Found", 404);
    user.isShop = !user.isShop;
    user.productShopName = productShopName;
    const updatedUser = await user.save();

    return {
      ...getInfoData({
        object: updatedUser,
        fields: ["_id", "name", "email", "phone", "isShop", "createdAt"],
      }),
    };
  };

  static updateProfile = async ({ name, email, password, id }) => {
    const user = await findUserByIdRepo(id);

    if (!user) throw new ForbiddenRequestError("User not Found", 404);

    user.name = name ?? user.name;
    user.email = email ?? user.email;
    if (password) {
      user.password = password;
    }

    const updatedUser = await user.save();

    return {
      ...getInfoData({
        object: updatedUser,
        fields: ["_id", "name", "email", "phone", "isAdmin", "createdAt"],
      }),
    };
  };

  static getAllUsers = async () => {
    return await getAllUsersRepo();
  };

  static login = async (req) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw new ForbiddenRequestError(
        errors.array().length > 0 ? errors.array()[0]?.msg : "Invalid input",
        422
      );
    }

    const { email, password } = req.body;
    const user = await findUserByEmailRepo({ email });
    // console.log(`user ::: ${user}`);

    if (!user) {
      throw new ForbiddenRequestError("Wrong Email or Password");
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      throw new ForbiddenRequestError("Wrong Email or Password");
    }

    const refreshToken = await generateRefreshToken(user?._id);

    const userUpdate = await findByIdAndUpdateTokenRepo(user._id, refreshToken);
    if (!userUpdate) {
      throw new ForbiddenRequestError("Wrong userUpdate");
    }
    // res.cookie(COOKIE_REFRESH_TOKEN, refreshToken, {
    //   httpOnly: true,
    //   maxAge: 72 * 60 * 60 * 1000,
    //   signed: true,
    // });
    // res.cookie(COOKIE_REFRESH_TOKEN,`encrypted cookie string Value`);

    // res.cookie('cookieName', 'cookieValue') // options is optional
    // res.send('')

    // logger.info(
    //   `refreshToken 11::: ${util.inspect(refreshToken, {
    //     showHidden: false,
    //     depth: null,
    //     colors: false,
    //   })}`
    // );
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

  static getProfileShop = async ({ id }) => {
    const user = await findUserByIdRepo(id);
    if (!user) {
      throw new ForbiddenRequestError("User not Found");
    }
    // logger.info(`admins ::: ${admins}`);
    return {
      ...getInfoData({
        object: user,
        fields: ["name", "email", "phone", "createdAt", "productShopName"],
      }),
    };
  };

  static getProfile = async ({ id }) => {
    const user = await findUserByIdRepo(id);
    if (!user) {
      throw new ForbiddenRequestError("User not Found");
    }
    const admins = await findAllAdminUsersRepo();
    // logger.info(`admins ::: ${admins}`);
    return {
      ...getInfoData({
        object: user,
        fields: [
          "_id",
          "name",
          "email",
          "phone",
          "isAdmin",
          "createdAt",
          "isShop",
          "productShopName",
        ],
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
    const userExists = await findUserByEmailRepo({ email }); //giam size OBJECT, tra ve 1 obj js original, neu k trar ve nhieu thong tin hon
    if (userExists) {
      throw new ForbiddenRequestError("User already exists");
    }

    const newUser = await createUserRepo({
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
