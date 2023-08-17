
const express = require("express");
const asyncHandler = require("express-async-handler");

const PAGE_SIZE = require("../../common/constant");
const Product = require("../../Models/ProductModel");

const productRoute = express.Router();

// GET ALL PRODUCT
productRoute.get(
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
    const count = await Product.countDocuments({ ...keyword });
    const products = await Product.find({ ...keyword })
      .limit(PAGE_SIZE)
      .skip(PAGE_SIZE * (page - 1))
      .sort({ _id: -1 });
    res.json({count, products, page, pages: Math.ceil(count / PAGE_SIZE) });
  })
);

// GET SINGLE PRODUCT
productRoute.get(
  "/:id",
  asyncHandler(async (req, res) => {
    const product = await Product.findById(req.params.id);
    if (product) {
      res.json(product);
    } else {
      res.status(404);
      throw new Error("Product not Found");
    }
  })
);


module.exports = productRoute;

