const asyncHandler = require("express-async-handler");

const Product = require("../Models/ProductModel");
const User = require("../Models/UserModel");
const Cart = require("./../../Models/CartModel");

const getAllCart = asyncHandler(async (req, res) => {
  try {
    const page = Number(req.query?.page) || 1;
    const PAGE_SIZE = Number(req.query?.limit) || 6;
    const orderBy = req.query?.orderBy || "createdAt";
    let brand = req.query?.brand ?? "";

    if (brand === "" || brand === "All") {
      brand = {};
    } else {
      brand = {
        "category.brand": brand,
      };
    }

    const keyword = req.query?.keyword
      ? {
          name: {
            $regex: req.query?.keyword,
            $options: "i",
          },
        }
      : {};
    const count = await Product.countDocuments({
      ...keyword,
      ...brand,
      deletedAt: null,
    });
    const products = await Product.find({
      ...keyword,
      ...brand,
      deletedAt: null,
    })
      .limit(PAGE_SIZE)
      .skip(PAGE_SIZE * (page - 1))
      .sort({ _id: -1 });
    res.json({
      count,
      products,
      page,
      totalPages: Math.ceil(count / PAGE_SIZE),
      limit: PAGE_SIZE,
    });
  } catch (error) {
    throw new Error(error);
  }
});

module.exports = {
  getAllCart,
};
