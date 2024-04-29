const express = require("express");
const { protect, admin } = require("./../../Middleware/AuthMiddleware");
const asyncHandler = require("express-async-handler");

const {
  getAllCategory,
  getAllCategoryByAdmin,
  deleteCategoryById,
  createCategory,
  getAllBrand,
  getAllBrandByAdmin,
  deleteBrandById,
  createBrand,
  getAllBrandByCategories,
} = require("../../controller/category.controller");

const categoryRoutes = express.Router();

// GET ALL CATEGORY
categoryRoutes.get("/get-all", getAllCategory);

// ADMIN GET ALL CATEGORY WITHOUT SEARCH AND PAGINATION
categoryRoutes.get("/all-admin", getAllCategoryByAdmin);

// DELETE CATEGORY
categoryRoutes.post("/delete/:id", protect, admin, deleteCategoryById);

// CREATE CATEGORY
categoryRoutes.post("/create", protect, admin, createCategory);

/* --------------------------------------------------------------------------------------------------------------- */
// GET ALL BRAND
categoryRoutes.get("/get-all-brands", asyncHandler(getAllBrand));

// GET ALL BRAND BY CATEGORIES
categoryRoutes.put(
  "/get-all-brands-categories",
  asyncHandler(getAllBrandByCategories)
);

// ADMIN GET ALL BRAND WITHOUT SEARCH AND PAGINATION
categoryRoutes.get("/all-admin/brand", protect, admin, getAllBrandByAdmin);

// DELETE BRAND
categoryRoutes.post("/delete/:id/brand", protect, admin, deleteBrandById);

// CREATE BRAND
categoryRoutes.post("/create-brand", protect, admin, createBrand);

module.exports = categoryRoutes;
