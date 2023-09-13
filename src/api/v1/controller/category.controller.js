const asyncHandler = require("express-async-handler");

const Category = require("../Models/CategoryModel");
const Brand = require("../Models/BrandModel");

const { PAGE_SIZE } = require("../utils/constant");

const getAllCategory = asyncHandler(async (req, res) => {
  try {
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
  } catch (error) {
    throw new Error(error);
  }
});

const getAllCategoryByAdmin = asyncHandler(async (req, res) => {
  try {
    const categorys = await Category.find({ deletedAt: null }).sort({
      createdAt: -1,
    });
    res.json({ categorys });
  } catch (error) {
    throw new Error(error);
  }
});

const deleteCategoryById = asyncHandler(async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (category) {
      category.deletedAt = Date.now();
      await category.save();
      res.json({ message: "Category deleted" });
    } else {
      res.status(404).json({ message: "Category not Found" });
      throw new Error("Category not Found");
    }
  } catch (error) {
    throw new Error(error);
  }
});

const createCategory = asyncHandler(async (req, res) => {
  try {
    const { category } = req.body;
    const categoryExist = await Category.findOne({ category });
    if (categoryExist) {
      res.status(400).json({ message: "Category name already exist" });

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
        res.status(400).json({ message: "Invalid category data" });
        throw new Error("Invalid category data");
      }
    }
  } catch (error) {
    throw new Error(error);
  }
});
/* --------------------------------------------------------------------------------------------------------------- */

const getAllBrand = asyncHandler(async (req, res) => {
  try {
    const count = await Brand.countDocuments({});
    const brands = await Brand.find({ deletedAt: null }).sort({
      createdAt: -1,
    });
    res.json({ count, brands });
  } catch (error) {
    throw new Error(error);
  }
});

const getAllBrandByAdmin = asyncHandler(async (req, res) => {
  try {
    const count = await Brand.countDocuments({});
    const brands = await Brand.find({ deletedAt: null }).sort({
      createdAt: -1,
    });
    res.json({ count, brands });
  } catch (error) {
    throw new Error(error);
  }
});

const deleteBrandById = asyncHandler(async (req, res) => {
  try {
    const brands = await Brand.findById(req.params.id);
    if (brands) {
      brands.deletedAt = Date.now();
      await brands.save();
      res.json({ message: "Brand deleted" });
    } else {
      res.status(404).json({ message: "Brand not Found" });
      throw new Error("Brand not Found");
    }
  } catch (error) {
    throw new Error(error);
  }
});

const createBrand = asyncHandler(async (req, res) => {
  try {
    const { brand, image } = req.body;
    const brandExist = await Brand.findOne({ brand });
    if (brandExist) {
      res.status(400).json({ message: "Brand name already exist" });

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
        res.status(400).json({ message: "Invalid brand data" });
        throw new Error("Invalid brand data");
      }
    }
  } catch (error) {
    throw new Error(error);
  }
});

module.exports = {
  getAllCategory,
  getAllCategoryByAdmin,
  deleteCategoryById,
  createCategory,
  getAllBrand,
  getAllBrandByAdmin,
  deleteBrandById,
  createBrand,
};
