const mongoose = require("mongoose");

const brandSchema = mongoose.Schema(
  {
    brand: { type: String, required: true, unique: true },
    image: { type: String, required: false },
    deletedAt: { type: Date, required: false, default: null },
  },
  {
    timestamps: true,
  }
);

const Brand = mongoose.model("Brand", brandSchema);

module.exports = Brand;
