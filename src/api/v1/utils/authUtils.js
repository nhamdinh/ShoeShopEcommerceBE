"use strict";
const JWT = require("jsonwebtoken");

const createToken = async (payload, publicKey, privateKey) => {
  try {
    const token = await JWT.sign(payload, publicKey, {
      expiresIn: 24 * 60 * 60 * 1,
      //   algorithm: "RS256",
    });
    const refreshToken = await JWT.sign(payload, publicKey, {
      expiresIn: 24 * 60 * 60 * 30,
      //   algorithm: "RS256",
    });

    // console.log("================***==============");
    // const decoded = JWT.verify(token, publicKey);
    // console.log("decoded::: ", decoded);

    // JWT.verify(token, publicKey, (err, decode) => {
    //   console.log("decode::: ", decode);
    //   if (err) {
    //     console.log("err::: ", err);
    //   } else {
    //   }
    // });
    // console.log("================END==============");

    return { token, refreshToken };
  } catch (error) {
    return error;
  }
};

module.exports = { createToken };
