"use strict";

const KeyTokenModel = require("../Models/KeyTokenModel");

class KeyTokenServices {
  static createKeyToken = async ({ userId, publicKey, privateKey }) => {
    try {
      const publicKeyString = publicKey.toString();
      const privateKeyString = privateKey.toString();
      const keyToken = await KeyTokenModel.create({
        user: userId,
        publicKey: publicKeyString,
        privateKey: privateKeyString,
      });
      return keyToken ? keyToken?.publicKey : null;
    } catch (error) {
      return error;
    }
  };
}
module.exports = KeyTokenServices;
