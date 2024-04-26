"use strict";
const util = require("util");
const logger = require("../log");
const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");
const User = require("../Models/UserModel");
const { ForbiddenRequestError } = require("../core/errorResponse");
const { getUnSelectData } = require("../utils/getInfo");

module.exports = {
  admin: (req, res, next) => {
    // console.log("admin xxx =====================================");
    if (req.user && req.user.isAdmin) {
      next();
    } else {
      throw new ForbiddenRequestError("Not authorized as an Admin", 401);
    }
  },

  protect: asyncHandler(async (req, res, next) => {
    let token;
    // console.log("protect  xxx =====================================");

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
      if (!token)
        throw new ForbiddenRequestError("Not authorized, no token", 401);
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.id).select(
        getUnSelectData([
          "password",
          "buyer",
          "user_clients",
          "user_follower",
          "user_watching",
        ])
      );

      // logger.info(
      //   `req.user::: ${util.inspect(req.user, {
      //     showHidden: false,
      //     depth: null,
      //     colors: false,
      //   })}`
      // );

      next();
    } else {
      throw new ForbiddenRequestError("Not authorized, token failed", 401);
    }
  }),
};
