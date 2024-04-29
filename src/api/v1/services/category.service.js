"use strict";
const util = require("util");
const logger = require("../log");

const { ForbiddenRequestError } = require("../core/errorResponse");
const { convertToObjectId } = require("../utils/getInfo");

const { getBrandsRepo } = require("../repositories/category.repo");

class CategoryServices {
  static getAllBrand = async ({ query }) => {
    const { limit = 50, page = 1, sort = { _id: -1 }, unSelect = [] } = query;
    const filter = { deletedAt: null };
    return await getBrandsRepo({ limit, page, sort, filter, unSelect });
  };
  static getAllBrandByCategories = async ({ body }) => {
    const {
      ids = [],
      limit = 50,
      page = 1,
      sort = { _id: -1 },
      unSelect = [],
    } = body;

    // logger.info(
    //   `ids  ::: ${util.inspect(ids, {
    //     showHidden: false,
    //     depth: null,
    //     colors: false,
    //   })}`
    // );

    const filter = { deletedAt: null, br_category_ids: { $in: ids } };
    return await getBrandsRepo({ limit, page, sort, filter, unSelect });
  };
}

module.exports = CategoryServices;
