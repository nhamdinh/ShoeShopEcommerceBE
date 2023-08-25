const mongoose = require("mongoose");

const categorySchema = mongoose.Schema(
  {
    category: { type: String, required: true },
    deletedAt: { type: Date, required: false, default: null },
  },
  {
    timestamps: true,
  }
);

const Category = mongoose.model("Category", categorySchema);

module.exports = Category;
