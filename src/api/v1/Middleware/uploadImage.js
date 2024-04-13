"use strict";
const util = require("util");
const logger = require("../log");
const { URL_SERVER } = require("../utils/constant");

const getUrlFromLocal = (req, res) => {
  const folder = req?.query?.folder;
  const filename = req?.file?.filename ?? "";

  logger.info(
    `URL_SERVER ::: ${util.inspect(URL_SERVER, {
      showHidden: false,
      depth: null,
      colors: false,
    })}`
  );

  logger.info(
    `filename ::: ${util.inspect(filename, {
      showHidden: false,
      depth: null,
      colors: false,
    })}`
  );

  logger.info(
    `folder ::: ${util.inspect(folder, {
      showHidden: false,
      depth: null,
      colors: false,
    })}`
  );



  let url = "";
  try {
    if (folder === "products") {
      url = URL_SERVER + STORAGE_IMG_PRODUCTS+ "/" + filename;
    } else if (folder === "categorys") {
      url = URL_SERVER + STORAGE_IMG_CATEGORYS+ "/" + filename;
    } else {
      url = URL_SERVER + STORAGE_IMG_COMMONS+ "/" + filename;
    }
    return res.status(200).json({ url });
  } catch (error) {
    console.error(error);
  }
};

module.exports = { getUrlFromLocal };