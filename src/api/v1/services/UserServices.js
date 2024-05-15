"use strict";
const util = require("util");
const logger = require("../log");
const nodemailer = require("nodemailer");

const { validationResult } = require("express-validator");
const crypto = require("node:crypto");
const bcrypt = require("bcrypt");

const {
  ForbiddenRequestError,
  NotFoundRequestError,
} = require("../core/errorResponse");
const KeyTokenServices = require("./KeyTokenServices");
const { getInfoData, convertToObjectId } = require("../utils/getInfo");
const { createToken } = require("../utils/authUtils");
const generateRefreshToken = require("../utils/generateRefreshToken");
const generateToken = require("../utils/generateToken");
const {
  findUserByEmailRepo,
  findByIdAndUpdateTokenRepo,
  findUserByIdRepo,
  findAllAdminUsersRepo,
  createUserRepo,
  findAllUsersRepo,
  findUserByIdLeanRepo,
  findUsersRepo,
} = require("../repositories/user.repo");
const UserModel = require("../Models/UserModel");
const ChatStory = require("../Models/ChatStoryModel");
const {
  findOneOtpRepo,
  findOneAndUpdateOtpRepo,
} = require("../repositories/otp.repo");

const { SENDER = "nhamnd.hmu@gmail.com" } = process.env;

class UserServices {
  static sendEmail = async ({ request }) => {
    // const errors = validationResult(request);

    // if (!errors.isEmpty())
    //   throw new ForbiddenRequestError(
    //     errors.array().length > 0
    //       ? errors.array().reduce((acc, item) => {
    //           return acc + item.msg + " ; ";
    //         }, [])
    //       : "Invalid input sendEmail()",
    //     422
    //   );
    const { body } = request;
    const { email, id, productShopName, productShopId } = body;

    let emailUserWatching = email;
    let idUserWatching = undefined;

    if (id) {
      /* update userWatching  */
      const userWatching = await findUserByIdRepo(convertToObjectId(id));

      if (!userWatching) throw new NotFoundRequestError("User not Found");

      userWatching.user_watching = [
        ...new Set([...userWatching.user_watching, productShopId]),
      ];

      await userWatching.save();

      emailUserWatching = userWatching.email;
      idUserWatching = userWatching._id.toString();

      /* update userWatching  */
    }

    // const transporter = nodemailer.createTransport({
    //   service: "Gmail",
    //   auth: {
    //     user: SENDER,
    //     pass: "ylzumnpdvgxjmrzw",
    //   },
    // });

    // const mail_option = {
    //   from: SENDER,
    //   to: emailUserWatching,
    //   subject: `YOUR MESSAGE FROM ${productShopName} SHOP`,
    //   //   text: (
    //   //     Math.floor(Math.random() * (999999 - 100000 + 1)) + 100000
    //   //   ).toString(),
    //   text: `Thank you for following ${productShopName}, You will receive information from us as soon as possible !`,
    // };

    // transporter.sendMail(mail_option, (error, info) => {
    //   if (error) {
    //     logger.error(
    //       `sendMail() ::: ${util.inspect(error, {
    //         showHidden: false,
    //         depth: null,
    //         colors: false,
    //       })}`
    //     );
    //     throw new ForbiddenRequestError("sendMail error");
    //   }
    // });

    /* update userFollower by productShopId*/
    const userFollower = await findUserByIdRepo(
      convertToObjectId(productShopId)
    );
    if (!userFollower) throw new NotFoundRequestError("User not Found");
    userFollower.user_follower = [
      ...new Set([
        ...userFollower.user_follower,
        idUserWatching ?? emailUserWatching,
      ]),
    ];
    await userFollower.save();
    /* userFollower */

    return true;
  };

  static clearCountChat = async ({ req }) => {
    try {
      let users = await UserModel.find({
        email: req.body.email,
      });
      // console.log("users :::", users);
      if (users?.length > 0) {
        users[0].countChat = 0;
      }
      const user = await users[0].save();
      return { user };
    } catch (error) {
      console.error(error);
      throw new NotFoundRequestError("User not Found");
    }
  };

  static getStory = async ({ req }) => {
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
        return { chatStories: {} };
      } else {
        return { chatStories: chatStories[0] };
      }
    } catch (error) {
      console.error(error);
      throw new NotFoundRequestError("chatStories not Found");
    }
  };

  static findAllUserByAdmin = async ({ req }) => {
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

      const count = await UserModel.countDocuments({
        ...keyword,
      });
      const users = await UserModel.find({
        ...keyword,
      })
        .select("-password")
        .sort({ createdAt: -1 });
      return { count, users };
    } catch (error) {
      throw new NotFoundRequestError("Users not Found");
    }
  };

  static updateIsShop = async ({ id, productShopName }) => {
    const user = await findUserByIdRepo(id);

    if (!user) throw new NotFoundRequestError("User not Found");
    user.isShop = !user.isShop;
    user.isAdmin = true;
    user.productShopName = productShopName;
    const updatedUser = await user.save();

    return {
      ...getInfoData({
        object: updatedUser,
        fields: ["_id", "name", "email", "phone", "isShop", "createdAt"],
      }),
    };
  };

  static updateProfile = async ({ body, id }) => {
    const user = await findUserByIdRepo(convertToObjectId(id));

    if (!user) throw new NotFoundRequestError("User not Found");

    const { name, phone, avatar } = body;
    user.name = name ?? user.name;
    user.phone = phone ?? user.phone;
    user.avatar = avatar ?? user.avatar;

    const updatedUser = await user.save();

    return {
      ...getInfoData({
        object: updatedUser,
        fields: ["_id", "name", "email", "phone", "isAdmin", "createdAt"],
      }),
    };
  };

  static changePassword = async ({ body, id }) => {
    const { password, passwordOld } = body;
    const user = await findUserByIdRepo(convertToObjectId(id));
    const zz = ["user@example.com", "admin@example.com", "usermoi@example.com"];
    if (zz.includes(user.email))
      throw new ForbiddenRequestError("this User do not allow to change");
    if (!user) throw new NotFoundRequestError("User not Found");

    const salt = user.user_salt;
    const passwordHashed = await bcrypt.hash(passwordOld, salt);

    const match = user.password === passwordHashed;
    if (!match) throw new ForbiddenRequestError("Wrong Old password ");

    if (password) user.password = password;

    const updatedUser = await user.save();

    return {
      ...getInfoData({
        object: updatedUser,
        fields: ["_id", "name", "email", "phone", "isAdmin", "createdAt"],
      }),
    };
  };

  static findAllUsers = async ({ query }) => {
    let {
      sort = { _id: -1 },
      page = +(query?.page ?? 1),
      limit = +(query?.limit ?? 50),

      select = [
        // "product_name",
        // "product_shop",
        // "product_price",
        // "product_original_price",
        // "product_thumb",
        // "isDraft",
        // "isPublished",
      ],
    } = query;

    const filter = {
      status: "active",
    };
    return await findAllUsersRepo({
      sort,
      limit,
      page,
      filter,
      select,
    });
  };

  static login = async (req) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw new ForbiddenRequestError(
        errors.array().length > 0
          ? errors.array().reduce((acc, item) => {
              return acc + item.msg + " ; ";
            }, [])
          : "Invalid input login()",
        422
      );
    }

    const { email, password } = req.body;
    const user = await findUserByEmailRepo({ email });
    logger.info(
      `user login ::: ${util.inspect(user, {
        showHidden: false,
        depth: null,
        colors: false,
      })}`
    );

    if (!user) throw new ForbiddenRequestError("Wrong Email or Password");

    const salt = user.user_salt;
    const passwordHashed = await bcrypt.hash(password, salt);

    const match = user.password === passwordHashed;
    if (!match) throw new ForbiddenRequestError("Wrong Email or Password");

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
    if (!user) throw new NotFoundRequestError("User not Found");

    // logger.info(`admins ::: ${admins}`);
    return {
      ...getInfoData({
        object: user,
        fields: [
          "name",
          "email",
          "phone",
          "createdAt",
          "productShopName",
          "_id",
        ],
      }),
    };
  };

  static getProfile = async ({
    id,
    unSelect = ["buyer", "password", "__v", "refreshToken", "user_salt"],
  }) => {
    const user = await findUserByIdLeanRepo({ id, unSelect });
    if (!user) throw new NotFoundRequestError("User not Found");

    const admins = await findAllAdminUsersRepo({
      // unSelect: [],
      unSelect: [...unSelect, "_id", "countChat", "roles", "user_clients"],
    });
    // logger.info(`admins ::: ${admins}`);

    const userIds = [...new Set(user.user_clients.map((id) => id))];

    const _user_clients = await findUsersRepo({
      filter: {
        _id: { $in: userIds },
      },
      unSelect: [...unSelect, "user_clients"],
    });

    user.user_clients = _user_clients;
    return {
      ...user,
      admins,
    };

    // return {
    //   ...getInfoData({
    //     object: user,
    //     fields: [
    //       "_id",
    //       "name",
    //       "email",
    //       "phone",
    //       "isAdmin",
    //       "createdAt",
    //       "isShop",
    //       "productShopName",
    //       "avatar"
    //     ],
    //   }),
    //   admins,
    // };
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

    const { name, email, password, phone, isAdmin, otp } = req.body;

    const userExists = await findUserByEmailRepo({ email }); //giam size OBJECT, tra ve 1 obj js original, neu k trar ve nhieu thong tin hon
    if (userExists) throw new ForbiddenRequestError("User already EXISTS!");

    const otpExists = await findOneOtpRepo({
      filter: {
        otp_email: email,
        otp_token: otp,
        otp_status: "pending",
      },
    });

    if (!otpExists) throw new ForbiddenRequestError("OTP wrong!");

    await findOneAndUpdateOtpRepo({
      filter: {
        otp_email: email,
        otp_token: otp,
      },
      updateSet: {
        otp_status: "block",
      },
    });

    const newUser = await createUserRepo({
      name,
      email,
      phone,
      password,
      isAdmin,
    });
    if (!newUser) throw new ForbiddenRequestError("Invalid User Data");
    logger.info(
      `newUser register ::: ${util.inspect(newUser, {
        showHidden: false,
        depth: null,
        colors: false,
      })}`
    );
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
