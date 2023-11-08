const express = require("express");
const asyncHandler = require("express-async-handler");

const { protect, admin } = require("./../../Middleware/AuthMiddleware");
const productController = require("../../controller/product.controller");
// const {
//   getAllProduct,
//   getAllProductWithout,
//   getAllProductAdmin,
//   getProductById,
//   deleteProductById,
//   createProduct,
//   updateProduct,
//   createProductReview,
//   updateProductReview,
//   checkUserIsBuy,
// } = require("../../controller/product.controller");

const productRoute = express.Router();

// CREATE PRODUCT
productRoute.post(
  "/create",
  protect,
  asyncHandler(productController.createProduct)
);

// // GET ALL PRODUCT
// productRoute.get("/get-all", getAllProduct);

// // USER GET ALL PRODUCT WITHOUT SEARCH AND PAGINATION
// productRoute.get("/all-user", getAllProductWithout);

// // ADMIN GET ALL PRODUCT
// productRoute.get("/all-admin", protect, admin, getAllProductAdmin);

// // GET SINGLE PRODUCT
// productRoute.get("/:id", getProductById);

// // DELETE PRODUCT
// productRoute.post("/delete/:id", protect, admin, deleteProductById);

// // CREATE PRODUCT
// productRoute.post("/create", protect, admin, createProduct);

// // UPDATE PRODUCT
// productRoute.put("/:id/update", protect, admin, updateProduct);

// // CREATE PRODUCT REVIEW
// productRoute.post("/:id/review", protect, createProductReview);

// // // GET ALL PRODUCT REVIEW
// // productRoute.get(
// //   "/all-admin/reviews",
// //   // protect,
// //   // admin,
// //   asyncHandler(async (req, res) => {
// //     const products = await Product.find({ deletedAt: null }).sort({
// //       createdAt: -1,
// //     });
// //     let reviews = [];
// //     products?.map((product) => {
// //       product?.reviews?.map((rew) => {
// //         reviews.push(rew);
// //       });
// //     });
// //     res.json(reviews);
// //   })
// // );

// // UPDATE REVIEW
// productRoute.put("/:id/update-review", protect, admin, updateProductReview);

// // CHECK USER IS BUY PRODUCT?
// productRoute.get("/:id/user-buyer", protect, checkUserIsBuy);

module.exports = productRoute;
