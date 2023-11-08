const { Schema, model } = require("mongoose"); // Erase if already required
const DOCUMENT_NAME = "Product";
const COLLECTION_NAME = "Products";

const productSchema = new Schema(
  {
    product_name: { type: String, required: true },
    product_thumb: { type: String, required: true },
    product_description: String,
    product_price: { type: Number, required: true },
    product_quantity: { type: Number, required: true },
    product_type: {
      type: String,
      required: true,
      enum: ["Electronic", "Clothing", "Furniture"],
    },
    product_shop: { type: Schema.Types.ObjectId, ref: "User" },
    product_attributes: { type: Schema.Types.Mixed, required: true },
  },
  {
    collection: COLLECTION_NAME,
    timestamps: true,
  }
);
const clothingSchema = new Schema(
  {
    brand: { type: String, require: true },
    size: String,
    material: String,
  },
  {
    collection: "clothes",
    timestamps: true,
  }
);

const electronicsSchema = new Schema(
  {
    brand: { type: String, require: true },
    size: String,
    material: String,
  },
  {
    collection: "clothes",
    timestamps: true,
  }
);

module.exports = {
  product: model(DOCUMENT_NAME, productSchema),
  clothing: model("clothing", clothingSchema),
  electronic: model("electronic", electronicsSchema),
};

// const mongoose = require("mongoose");

// const reviewSchema = mongoose.Schema(
//   {
//     name: { type: String, required: true },
//     rating: { type: Number, required: true },
//     comment: { type: String, required: true },
//     user: {
//       type: mongoose.Schema.Types.ObjectId,
//       required: true,
//       ref: "User",
//     },
//   },
//   {
//     timestamps: true,
//   }
// );

// const productSchema = mongoose.Schema(
//   {
//     name: {
//       type: String,
//       required: true,
//     },
//     category: {
//       name: { type: String, required: true },
//       brand: { type: String, required: true },
//       // category: {
//       //   type: mongoose.Schema.Types.ObjectId,
//       //   required: true,
//       //   ref: "Category",
//       // },
//     },
//     image: {
//       type: String,
//     },
//     description: {
//       type: String,
//       required: true,
//     },
//     reviews: [reviewSchema],
//     rating: {
//       type: Number,
//       required: true,
//       default: 0,
//     },
//     numReviews: {
//       type: Number,
//       required: true,
//       default: 0,
//     },
//     price: {
//       type: Number,
//       required: true,
//       default: 0,
//     },
//     countInStock: {
//       type: Number,
//       required: true,
//       default: 0,
//     },
//     stock: {
//       type: Number,
//       required: true,
//       default: 0,
//     },
//     deletedAt: { type: Date, required: false, default: null },
//   },
//   {
//     timestamps: true,
//   }
// );

// const Product = mongoose.model("Product", productSchema);

// module.exports = Product;
