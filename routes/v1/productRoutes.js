const express = require("express");
const asyncHandler = require("express-async-handler");
const { protect, admin } = require("../../Middleware/AuthMiddleware");

const { PAGE_SIZE } = require("../../common/constant");
const Product = require("../../Models/ProductModel");
const User = require("../../Models/UserModel");

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
    res.json({ count, products, page, pages: Math.ceil(count / PAGE_SIZE) });
  })
);

// ADMIN GET ALL PRODUCT WITHOUT SEARCH AND PEGINATION
productRoute.get(
  "/all-admin",
  protect,
  admin,
  asyncHandler(async (req, res) => {
    const products = await Product.find({ deletedAt: null }).sort({
      createdAt: -1,
    });
    res.json(products);
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

// DELETE PRODUCT
productRoute.post(
  "/delete/:id",
  protect,
  admin,
  asyncHandler(async (req, res) => {
    const product = await Product.findById(req.params.id);
    if (product) {
      product.deletedAt = Date.now();
      await product.save();
      res.json({ message: "Product deleted" });
    } else {
      res.status(404);
      throw new Error("Product not Found");
    }
  })
);

// CREATE PRODUCT
productRoute.post(
  "/create",
  protect,
  admin,
  asyncHandler(async (req, res) => {
    const { name, price, description, image, countInStock, category } =
      req.body;
    const productExist = await Product.findOne({ name });
    if (productExist) {
      res.status(400).json({ message: "Product name already exist" });
      throw new Error("Product name already exist");
    } else {
      const product = new Product({
        name,
        price,
        description,
        image,
        countInStock,
        category,
        user: req.user._id,
      });
      if (product) {
        const createdproduct = await product.save();
        res.status(201).json(createdproduct);
      } else {
        res.status(400).json({ message: "Invalid product data" });
        throw new Error("Invalid product data");
      }
    }
  })
);

// UPDATE PRODUCT
productRoute.put(
  "/:id/update",
  protect,
  admin,
  asyncHandler(async (req, res) => {
    const { name, price, description, image, countInStock, category } =
      req.body;
    const product = await Product.findById(req.params.id);
    if (product) {
      product.name = name || product.name;
      product.price = price || product.price;
      product.description = description || product.description;
      product.image = image || product.image;
      product.countInStock = countInStock || product.countInStock;
      product.category = category || product.category;

      const updatedProduct = await product.save();
      res.json(updatedProduct);
    } else {
      res.status(404);
      throw new Error("Product not found");
    }
  })
);

// PRODUCT REVIEW
productRoute.post(
  "/:id/review",
  protect,
  asyncHandler(async (req, res) => {
    const { rating, comment } = req.body;
    const product = await Product.findById(req.params.id);

    if (product) {
      const alreadyReviewed = product.reviews.find(
        (r) => r.user.toString() === req.user._id.toString()
      );
      if (alreadyReviewed) {
        res.status(400).json({ message: "Product already Reviewed" });
        throw new Error("Product already Reviewed");
      }
      const review = {
        name: req.user.name,
        rating: Number(rating),
        comment,
        user: req.user._id,
      };
      console.log("review ========= ", review);
      product.reviews.push(review);
      product.numReviews = product.reviews.length;
      product.rating = (
        product.reviews.reduce((acc, item) => item.rating + acc, 0) /
        product.reviews.length
      ).toFixed(1);

      await product.save();
      res.status(201).json({ message: "Reviewed Added" });
    } else {
      res.status(404);
      throw new Error("Product not Found");
    }
  })
);

// GET ALL PRODUCT REVIEW
productRoute.get(
  "/all-admin/reviews",
  // protect,
  // admin,
  asyncHandler(async (req, res) => {
    const products = await Product.find({ deletedAt: null }).sort({
      createdAt: -1,
    });
    let reviews = [];
    products?.map((product) => {
      product?.reviews?.map((review) => {
        reviews.push(review);
      });
    });
    res.json(reviews);
  })
);

// CHECK USER IS BUY PRODUCT?
productRoute.get(
  "/:id/user-buyer",
  protect,
  asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id);

    if (user) {
      const buyerArr = user?.buyer;
      let hasBuyer = false;
      buyerArr?.map((buyer) => {
        if (req.params.id === buyer) hasBuyer = true;
      });
      res.status(201).json({ hasBuyer });
    } else {
      res.status(404);
      throw new Error("User not Found");
    }
  })
);

module.exports = productRoute;
