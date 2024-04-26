const express = require("express");
const asyncHandler = require("express-async-handler");

const { protect, admin } = require("./../../Middleware/AuthMiddleware");
const productController = require("../../controller/product.controller");

const productRoute = express.Router();
/**
 * PUT 201 tao thanh cong
 * PATCH chinh sua nhung gi can chinh
 *
 *  */
// CREATE PRODUCT
productRoute.put(
  "/create",
  protect,
  asyncHandler(productController.createProduct)
);

// CREATE SPU PRODUCT
productRoute.put(
  "/create-spu",
  protect,
  asyncHandler(productController.createSpu)
);

// PUBLISHED PRODUCT
productRoute.put(
  "/published/:id",
  protect,
  asyncHandler(productController.publishedProductByShop)
);

// DRAFT PRODUCT
productRoute.put(
  "/draft/:id",
  protect,
  asyncHandler(productController.draftProductByShop)
);

// GET DRAFT PRODUCT
productRoute.get(
  "/draft/all",
  asyncHandler(productController.findAllDaftByShop)
);

// GET PUBLISHED PRODUCT
productRoute.get(
  "/published/all",
  // protect,
  asyncHandler(productController.findAllPublishedByShop)
);

// GET PRODUCTS BY SHOP
productRoute.put(
  "/all-by-shop",
  // protect,
  asyncHandler(productController.findAllProductsByShop)
);

// UPDATE-STATUS-PRODUCTS-BY-SHOP
productRoute.put(
  "/update-status-products-by-shop",
  // protect,
  asyncHandler(productController.updateStatusProductsByShop)
);

// GET SEARCH PRODUCTS
productRoute.get(
  "/search/:keySearch",
  protect,
  asyncHandler(productController.searchProducts)
);

// GET ALL PRODUCTS
productRoute.get("/all", asyncHandler(productController.findAllProducts));

// GET ALL PRODUCTS MAX
productRoute.get("/all-max", asyncHandler(productController.findAllProductsMax));

// ADMIN GET ALL PRODUCT
productRoute.get(
  "/all-admin",
  protect,
  admin,
  asyncHandler(productController.findAllProducts)
);

// GET PRODUCT BY ID
productRoute.get(
  "/detail/:product_id",
  // protect,
  asyncHandler(productController.findProductById)
);
// UPDATE PRODUCT BY ID
productRoute.patch(
  "/update/:product_id",
  protect,
  asyncHandler(productController.updateProductById)
);

// CHECK USER IS BUY PRODUCT?
productRoute.get(
  "/:id/user-buyer",
  protect,
  asyncHandler(productController.checkUserIsBuy)
);

// CREATE PRODUCT REVIEW
productRoute.post(
  "/:id/review",
  protect,
  asyncHandler(productController.createProductReview)
);

// // USER GET ALL PRODUCT WITHOUT SEARCH AND PAGINATION
// productRoute.get("/all-user", getAllProductWithout);

// // GET SINGLE PRODUCT
// productRoute.get("/:id", getProductById);

// // DELETE PRODUCT
// productRoute.post("/delete/:id", protect, admin, deleteProductById);

// // CREATE PRODUCT
// productRoute.post("/create", protect, admin, createProduct);

// // UPDATE PRODUCT
// productRoute.put("/:id/update", protect, admin, updateProduct);

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

module.exports = productRoute;
