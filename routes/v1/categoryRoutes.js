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

// CREATE CATEGORY
categoryRoutes.post(
  "/create",
  protect,
  admin,
  asyncHandler(async (req, res) => {
    const { category } = req.body;
    const categoryExist = await Category.findOne({ category });
    if (categoryExist) {
      res.status(400);

      throw new Error("Category name already exist");
    } else {
      const category1 = new Category({
        category,
        user: req.user._id,
      });
      if (category) {
        const createCategory = await category1.save();
        res.status(201).json(createCategory);
      } else {
        res.status(400);
        throw new Error("Invalid category data");
      }
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

// ADMIN GET ALL BRAND WITHOUT SEARCH AND PEGINATION
categoryRoutes.get(
  "/all-admin/brand",
  protect,
  admin,
  asyncHandler(async (req, res) => {
    const brands = await Brand.find({ deletedAt: null }).sort({
      createdAt: -1,
    });
    res.json({ brands });
  })
);

// DELETE BRAND
categoryRoutes.post(
  "/delete/:id/brand",
  protect,
  admin,
  asyncHandler(async (req, res) => {
    const brands = await Brand.findById(req.params.id);
    if (brands) {
      brands.deletedAt = Date.now();
      await brands.save();
      res.json({ message: "Brand deleted" });
    } else {
      res.status(404);
      throw new Error("Brand not Found");
    }
  })
);

// CREATE BRAND
categoryRoutes.post(
  "/create-brand",
  protect,
  admin,
  asyncHandler(async (req, res) => {
    const { brand, image } = req.body;
    const brandExist = await Brand.findOne({ brand });
    if (brandExist) {
      res.status(400);

      throw new Error("Brand name already exist");
    } else {
      const brand1 = new Brand({
        brand,
        image,
        user: req.user._id,
      });
      if (brand) {
        const createBrand = await brand1.save();
        res.status(201).json(createBrand);
      } else {
        res.status(400);
        throw new Error("Invalid brand data");
      }
    }
  })
);

module.exports = categoryRoutes;
