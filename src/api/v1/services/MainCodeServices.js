"use strict";
const util = require("util");
const logger = require("../log");

const { ForbiddenRequestError } = require("../core/errorResponse");
const {
  createMainCodeRepo,
  getAllMainCodesRepo,
} = require("../repositories/mainCode.repo");

class MainCodeServices {
  static createMainCode = async (mainCode) => {
    const { mainCode_type, mainCode_value } = mainCode;
    if (!mainCode_type || !mainCode_value)
      throw new ForbiddenRequestError("mainCode invalid");
    const { mainCodes } = await getAllMainCodesRepo({
      filter: { mainCode_type, mainCode_value },
    });
    if (mainCodes.length !== 0)
      throw new ForbiddenRequestError("mainCode is existing");

    return await createMainCodeRepo(mainCode);
  };
  static getAllMainCodes = async ({ mainCode_type }) => {
    return await getAllMainCodesRepo({
      filter: { mainCode_type },
    });
  };
}

module.exports = MainCodeServices;
