const express = require("express");
const asyncHandler = require("express-async-handler");

const Category = require("../../Models/CategoryModel");
const PAGE_SIZE = require("../../common/constant");
const categoryRoutes = express.Router();

// GET ALL CATEGORY
categoryRoutes.get(
    "/get-all",
    asyncHandler(async (req, res) => {
      const page = Number(req.query.pageNumber) || 1;
      const keyword = req.query.keyword
        ? {
            name: {
              $regex: req.query.keyword,
              $options: "i",
            },
          }
        : {};
      const count = await Category.countDocuments({ ...keyword });
      const categorys = await Category.find({ ...keyword })
        .limit(PAGE_SIZE)
        .skip(PAGE_SIZE * (page - 1))
        .sort({ _id: -1 });
      res.json({ count, categorys, page, pages: Math.ceil(count / PAGE_SIZE) });
    })
  );



module.exports = categoryRoutes;
