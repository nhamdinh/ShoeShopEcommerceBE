"use strict";
const util = require("util");
const logger = require("../log");
const {
  URL_SERVER,
  PATH_IMG_PRODUCTS,
  PATH_IMG_CATEGORYS,
  PATH_IMG_COMMONS,
} = require("../utils/constant");

const getUrlFromLocal = (req, res) => {
  const folder = req?.query?.folder;
  const filename = req?.file?.filename ?? "";

  const toFolder = {
    products: PATH_IMG_PRODUCTS,
    categorys: PATH_IMG_CATEGORYS,
  };

  const url =
    URL_SERVER + (toFolder[folder] ?? PATH_IMG_COMMONS) + "/" + filename;

  return res.status(201).json({ url });
};

module.exports = { getUrlFromLocal };
