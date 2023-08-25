const express = require("express");
const asyncHandler = require("express-async-handler");
const { protect, admin } = require("../../Middleware/AuthMiddleware");

const Category = require("../../Models/CategoryModel");
const Brand = require("../../Models/BrandModel");
const { PAGE_SIZE } = require("../../common/constant");
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
// ADMIN GET ALL CATEGORY WITHOUT SEARCH AND PEGINATION
categoryRoutes.get(
  "/all-admin",
  protect,
  admin,
  asyncHandler(async (req, res) => {
    const categorys = await Category.find({ deletedAt: null }).sort({
      createdAt: -1,
    });
    res.json({ categorys });
  })
);

// DELETE CATEGORY
categoryRoutes.post(
  "/delete/:id",
  protect,
  admin,
  asyncHandler(async (req, res) => {
    const category = await Category.findById(req.params.id);
    if (category) {
      category.deletedAt = Date.now();
      await category.save();
      res.json({ message: "Category deleted" });
    } else {
      res.status(404);
      throw new Error("Category not Found");
    }
  })
);

/* --------------------------------------------------------------------------------------------------------------- */
// GET ALL BRAND
categoryRoutes.get(
  "/get-all-brands",
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
    const count = await Brand.countDocuments({ ...keyword });
    const brands = await Brand.find({ ...keyword })
      .limit(PAGE_SIZE)
      .skip(PAGE_SIZE * (page - 1))
      .sort({ _id: -1 });
    res.json({ count, brands, page, pages: Math.ceil(count / PAGE_SIZE) });
  })
);

module.exports = categoryRoutes;
