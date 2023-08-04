
const express = require("express");
const asyncHandler = require("express-async-handler");
const Product = require("../Models/ProductModel");
const PAGE_SIZE = require("../common/constant");

const productRoute = express.Router();

// GET ALL PRODUCT
productRoute.get(
  "/",
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
    const count = await Product.countDocuments({ ...keyword });
    const products = await Product.find({ ...keyword })
      .limit(PAGE_SIZE)
      .skip(PAGE_SIZE * (page - 1))
      .sort({ _id: -1 });
    res.json({ products, page, pages: Math.ceil(count / PAGE_SIZE) });
  })
);


module.exports = productRoute;

