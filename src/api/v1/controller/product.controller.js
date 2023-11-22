const asyncHandler = require("express-async-handler");
const util = require("util");

const Product = require("../Models/ProductModel");
const User = require("../Models/UserModel");
const logger = require("../log");
const ProductServices = require("../services/ProductServices");
const { CREATED, OK } = require("../core/successResponse");

// const getAllProduct = asyncHandler(async (req, res) => {
//   try {
//     const page = Number(req.query?.page) || 1;
//     const PAGE_SIZE = Number(req.query?.limit) || 6;
//     const orderBy = req.query?.orderBy || "createdAt";
//     let brand = req.query?.brand ?? "";

//     if (brand === "" || brand === "All") {
//       brand = {};
//     } else {
//       brand = {
//         "category.brand": brand,
//       };
//     }

//     const keyword = req.query?.keyword
//       ? {
//           name: {
//             $regex: req.query?.keyword,
//             $options: "i",
//           },
//         }
//       : {};
//     const count = await Product.countDocuments({
//       ...keyword,
//       ...brand,
//       deletedAt: null,
//     });
//     const products = await Product.find({
//       ...keyword,
//       ...brand,
//       deletedAt: null,
//     })
//       .limit(PAGE_SIZE)
//       .skip(PAGE_SIZE * (page - 1))
//       .sort({ _id: -1 });
//     res.json({
//       count,
//       products,
//       page,
//       totalPages: Math.ceil(count / PAGE_SIZE),
//       limit: PAGE_SIZE,
//     });
//   } catch (error) {
//     throw new Error(error);
//   }
// });

// const getAllProductWithout = asyncHandler(async (req, res) => {
//   try {
//     const count = await Product.countDocuments({ deletedAt: null });
//     const products = await Product.find({ deletedAt: null }).sort({
//       createdAt: -1,
//     });
//     res.json({ code: "success", count, products });
//   } catch (error) {
//     throw new Error(error);
//   }
// });

// const getAllProductAdmin = asyncHandler(async (req, res) => {
//   try {
//     const page = Number(req.query?.page) || 1;
//     const PAGE_SIZE = Number(req.query?.limit) || 6;
//     const orderBy = req.query?.orderBy || "createdAt";
//     let brand = req.query?.brand ?? "";

//     if (brand === "" || brand === "All") {
//       brand = {};
//     } else {
//       brand = {
//         "category.brand": brand,
//       };
//     }

//     const keyword = req.query?.keyword
//       ? {
//           name: {
//             $regex: req.query?.keyword,
//             $options: "i",
//           },
//         }
//       : {};
//     const count = await Product.countDocuments({
//       ...keyword,
//       ...brand,
//       deletedAt: null,
//     });
//     const products = await Product.find({
//       ...keyword,
//       ...brand,
//       deletedAt: null,
//     })
//       .limit(PAGE_SIZE)
//       .skip(PAGE_SIZE * (page - 1))
//       .sort({ _id: -1 });
//     res.json({
//       count,
//       products,
//       page,
//       totalPages: Math.ceil(count / PAGE_SIZE),
//       limit: PAGE_SIZE,
//     });
//   } catch (error) {
//     throw new Error(error);
//   }
// });

// const getProductById = asyncHandler(async (req, res, next) => {
//   try {
//     const product = await Product.findById(req.params.id);
//     logger.info("product.id === " + product?._id);

//     if (product) {
//       res.json(product);
//     } else {
//       const error = new Error(`Product not Found : ${req.originalUrl}`);
//       res.status(200);
//       next(error);
//       // throw new Error("Product not Found");
//     }
//   } catch (error) {
//     throw new Error(error);
//   }
// });

// const deleteProductById = asyncHandler(async (req, res) => {
//   try {
//     const product = await Product.findById(req.params.id);
//     if (product) {
//       product.deletedAt = Date.now();
//       await product.save();
//       res.json({ message: "Product deleted" });
//     } else {
//       res.status(200).json({ message: "Product not Found" });
//       throw new Error("Product not Found");
//     }
//   } catch (error) {
//     throw new Error(error);
//   }
// });

// const createProduct = asyncHandler(async (req, res) => {
//   try {
//     const { name, price, description, image, countInStock, category } =
//       req.body;
//     const productExist = await Product.findOne({ name }).lean();
//     if (productExist) {
//       res.status(400).json({ message: "Product name already exist" });
//       throw new Error("Product name already exist");
//     } else {
//       const product = new Product({
//         name,
//         price,
//         description,
//         image,
//         countInStock,
//         category,
//         user: req.user._id,
//       });
//       if (product) {
//         const createdproduct = await product.save();
//         res.status(201).json(createdproduct);
//       } else {
//         res.status(400).json({ message: "Invalid product data" });
//         throw new Error("Invalid product data");
//       }
//     }
//   } catch (error) {
//     throw new Error(error);
//   }
// });

// const updateProduct = asyncHandler(async (req, res) => {
//   try {
//     const { name, price, description, image, countInStock, category } =
//       req.body;
//     const product = await Product.findById(req.params.id);
//     if (product) {
//       product.name = name || product.name;
//       product.price = price || product.price;
//       product.description = description || product.description;
//       product.image = image || product.image;
//       product.countInStock = countInStock || product.countInStock;
//       product.category = category || product.category;

//       const updatedProduct = await product.save();
//       res.json(updatedProduct);
//     } else {
//       res.status(200).json({ message: "Product not Found" });
//       throw new Error("Product not found");
//     }
//   } catch (error) {
//     throw new Error(error);
//   }
// });

// const createProductReview = asyncHandler(async (req, res) => {
//   try {
//     const { rating, comment } = req.body;
//     const product = await Product.findById(req.params.id);

//     if (product) {
//       const alreadyReviewed = product.reviews.find(
//         (r) => r.user.toString() === req.user._id.toString()
//       );
//       if (alreadyReviewed) {
//         res.status(400).json({ message: "Product already Reviewed" });
//         throw new Error("Product already Reviewed");
//       }
//       const review = {
//         name: req.user.name,
//         rating: Number(rating),
//         comment,
//         user: req.user._id,
//       };
//       product.reviews.push(review);
//       product.numReviews = product.reviews.length;
//       product.rating = (
//         product.reviews.reduce((acc, item) => item.rating + acc, 0) /
//         product.reviews.length
//       ).toFixed(1);

//       await product.save();
//       res.status(201).json({ message: "Reviewed Added" });
//     } else {
//       res.status(200).json({ message: "Product not Found" });
//       throw new Error("Product not Found");
//     }
//   } catch (error) {
//     throw new Error(error);
//   }
// });

// const updateProductReview = asyncHandler(async (req, res) => {
//   try {
//     const { comment, productId } = req.body;
//     const product = await Product.findById(productId);

//     if (product) {
//       let reviews = product?.reviews;

//       reviews?.map((review) => {
//         if (review?._id.toString() === req.params.id) {
//           review.comment = comment;
//         }
//       });
//       product.reviews = reviews;
//       const updatedProduct = await product.save();
//       res.json(updatedProduct);
//     } else {
//       res.status(200).json({ message: "Product not Found" });
//       throw new Error("Product not found");
//     }
//   } catch (error) {
//     throw new Error(error);
//   }
// });

// const checkUserIsBuy = asyncHandler(async (req, res) => {
//   try {
//     const user = await User.findById(req.user._id);

//     if (user) {
//       const buyerArr = user?.buyer;
//       let hasBuyer = false;
//       buyerArr?.map((buyer) => {
//         if (req.params.id === buyer) hasBuyer = true;
//       });
//       res.status(201).json({ hasBuyer });
//     } else {
//       res.status(200).json({ message: "User not Found" });
//       throw new Error("User not Found");
//     }
//   } catch (error) {
//     throw new Error(error);
//   }
// });

// module.exports = {
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
// };

class ProductController {
  updateProductById = async (req, res, next) => {
    new OK({
      message: "updateProductById OK",
      metadata: await ProductServices.updateProductById(
        req.body?.product_type,
        req.params.product_id,
        {
          ...req.body,
          product_shop: req.user._id,
        }
      ),
    }).send(res);
  };

  createProduct = async (req, res, next) => {
    new CREATED({
      message: "createProduct CREATED",
      metadata: await ProductServices.createProduct(req.body?.product_type, {
        ...req.body,
      }),
    }).send(res);
  };

  findAllDaftByShop = async (req, res, next) => {
    new OK({
      message: "findAllDaftByShop OK",
      metadata: await ProductServices.findAllDaftByShop({
        product_shop: req.query.product_shop,
      }),
    }).send(res);
  };

  findAllPublishedByShop = async (req, res, next) => {
    // logger.info(
    //   `req.query 1::: ${util.inspect(req.query, {
    //     showHidden: false,
    //     depth: null,
    //     colors: false,
    //   })}`
    // );

    new OK({
      message: "findAllPublishedByShop OK",
      metadata: await ProductServices.findAllPublishedByShop({
        product_shop: req.query.product_shop,
      }),
    }).send(res);
  };

  publishedProductByShop = async (req, res, next) => {
    new OK({
      message: "publishedProductByShop OK",
      metadata: await ProductServices.publishedProductByShop({
        product_shop: req.user._id,
        product_id: req.params.id,
      }),
    }).send(res);
  };

  draftProductByShop = async (req, res, next) => {
    new OK({
      message: "draftProductByShop OK",
      metadata: await ProductServices.draftProductByShop({
        product_shop: req.user._id,
        product_id: req.params.id,
      }),
    }).send(res);
  };

  searchProducts = async (req, res, next) => {
    new OK({
      message: "searchProducts OK",
      metadata: await ProductServices.searchProducts({
        keySearch: req.params.keySearch,
      }),
    }).send(res);
  };

  findAllProducts = async (req, res, next) => {
    new OK({
      message: "findAllProducts OK",
      metadata: await ProductServices.findAllProducts(req.query),
    }).send(res);
  };

  findProductById = async (req, res, next) => {
    new OK({
      message: "findProductById OK",
      metadata: await ProductServices.findProductById({
        product_id: req.params.product_id,
      }),
    }).send(res);
  };
}

module.exports = new ProductController();
