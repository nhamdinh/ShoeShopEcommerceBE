const { Schema, model } = require("mongoose"); // Erase if already required
// const slugify = require("slugify");

const { PRODUCT_TYPE } = require("../utils/constant");
const { toNonAccentVietnamese } = require("../utils/functionHelpers");
const DOCUMENT_NAME = "Product";
const COLLECTION_NAME = "Products";

const productSchema = new Schema(
  {
    product_name: { type: String, required: true, trim: true },
    product_slug: String,
    product_images: { type: Array, default: [] },
    product_thumb: { type: String, required: true },
    product_thumb_small: { type: String, trim: true },
    product_description: { type: String, default: "" },
    product_original_price: { type: Number, default: 0 },
    product_price: { type: Number, required: true },
    product_quantity: { type: Number, required: true },
    product_sold: { type: Number, default: 0 },
    // product_type: {
    //   type: String,
    //   required: true,
    //   enum: [...PRODUCT_TYPE],
    // },
    product_shop: { type: Schema.Types.ObjectId, ref: "User", required: true },
    product_attributes: { type: Array, default: [], required: false },
    /* 
    {
        attribute_id:"abc123",
        attribute_values:[
            {
                value_id:"value123"
            }
        ],
    }
     */
    product_ratings: {
      type: Number,
      default: 4.5,
      min: [1, "Rating must be above 1"],
      max: [5, "Rating must be below 5"],
      // set: (val) => {
      //   Math.round(val * 10) / 10;
      // },
    },
    product_variants: {
      type: Array,
      default: [],
    },

    /* 
    tier_variants: [
        {
            images:[],
            name:"color",
            value:["red", "green", "blue"],
        },
        {
            images:[],
            name:"size",
            value:["X", "M", "L"],
        },
    ]
    */
    product_categories: {
      type: Array,
      default: [],
    },
    product_brand: {
      type: Schema.Types.ObjectId,
      ref: "Brand",
      required: true,
    },
    isDraft: { type: Boolean, default: false, index: true },
    isDelete: { type: Boolean, default: false },
    isPublished: { type: Boolean, default: true, index: true }, //, select: T/F: always selected/not
    numReviews: {
      type: Number,
      default: 0,
    },
    reviews: {
      type: Array,
      default: [],
    },
  },
  {
    collection: COLLECTION_NAME,
    timestamps: true,
  }
);
productSchema.index({
  product_name: "text",
  product_description: "text",
});

productSchema.pre("save", async function (next) {
  this.product_slug = toNonAccentVietnamese(this.product_name).replaceAll(
    " ",
    "-"
  );
  next();
});
class ProductModelFactory {
  static productModelStrategy = {
    // clothing: model("clothing", clothingSchema),
    // electronic: model("electronic", electronicSchema),
  };
  static registryProductTypeSchema = (model, Schema) => {
    ProductModelFactory.productModelStrategy[model] = Schema;
  };
}

PRODUCT_TYPE.map(async (type) => {
  await ProductModelFactory.registryProductTypeSchema(
    type,
    model(
      type,
      new Schema(
        {
          brand: { type: String, require: true },
          size: String,
          material: String,
          product_shop: { type: Schema.Types.ObjectId, ref: "User" },
        },
        {
          collection: type + "s",
          timestamps: true,
        }
      )
    )
  );
});

module.exports = {
  ...ProductModelFactory.productModelStrategy,
  product: model(DOCUMENT_NAME, productSchema),
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
