"use strict";
const { Schema, model } = require("mongoose"); // Erase if already required
//!dmbg
const DOCUMENT_NAME = "Cart";
const COLLECTION_NAME = "Carts";
// Declare the Schema of the Mongo model
const cartSchema = new Schema(
  {
    cart_state: {
      type: String,
      required: true,
      enum: ["active", "completed", "failed"],
      default: "active",
    },
    cart_products: {
      type: Array,
      default: [],
    },
    cart_products_deleted: {
      type: Array,
      default: [],
    },
    cart_userId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    cart_shopId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    completedAt: { type: Date, required: false, default: null },
  },
  {
    collection: COLLECTION_NAME,
    timestamps: true,
  }
);

//Export the model
module.exports = model(DOCUMENT_NAME, cartSchema);

// const mongoose = require("mongoose");

// const cartSchema = mongoose.Schema(
//   {
//     user: {
//       type: mongoose.Schema.Types.ObjectId,
//       required: true,
//       ref: "User",
//     },
//     cartItems: [
//       {
//         name: { type: String, required: true },
//         qty: { type: Number, required: true },
//         image: { type: String, required: true },
//         price: { type: Number, required: true },
//         product: {
//           type: String,
//           required: true,
//           ref: "Product",
//         },
//       },
//     ],
//     paymentMethod: {
//       type: String,
//       required: false,
//       default: "Paypal",
//     },
//     deletedAt: { type: Date, required: false, default: null },
//   },
//   {
//     timestamps: true,
//   }
// );

// const Cart = mongoose.model("Cart", cartSchema);

// module.exports = Cart;
