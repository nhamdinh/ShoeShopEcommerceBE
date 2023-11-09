"use strict";
const { Types } = require("mongoose"); // Erase if already required

const ProductModel = require("../Models/ProductModel");

const createProductRepo = async (product) => {
  return await ProductModel.product.create({ ...product });
};

const createProductTypeRepo = async (type, product) => {
  return await ProductModel[type].create({ ...product });
};

const findAllProductsByShopRepo = async ({ query, limit, skip }) => {
  return await ProductModel.product
    .find(query)
    .populate("product_shop", "name email -_id")
    .sort({ updatedAt: -1 })
    .skip(skip)
    .limit(limit)
    .lean()
    .exec();
};

const findProductByIdRepo = async ({ product_shop, product_id }) => {
  return await ProductModel.product.findOne({
    product_shop: new Types.ObjectId(product_shop),
    _id: new Types.ObjectId(product_id),
  });
};

const publishedProductByShopRepo = async ({ product_shop, product_id }) => {
  const productUpdate = await ProductModel.product.findOne({
    product_shop: new Types.ObjectId(product_shop),
    _id: new Types.ObjectId(product_id),
  });

  if (!productUpdate) return null;

  productUpdate.isDraft = false;
  productUpdate.isPublished = true;
  const { modifiedCount } = await productUpdate.update(productUpdate);

  return modifiedCount;
};

const draftProductByShopRepo = async ({ product_shop, product_id }) => {
  const productUpdate = await ProductModel.product.findOne({
    product_shop: new Types.ObjectId(product_shop),
    _id: new Types.ObjectId(product_id),
  });

  if (!productUpdate) return null;

  productUpdate.isPublished = false;
  productUpdate.isDraft = true;
  const { modifiedCount } = await productUpdate.update(productUpdate);

  return modifiedCount;
};

const searchProductsRepo = async ({ keySearch }) => {
  const regexSearch = new RegExp(keySearch);
  const result = await ProductModel.product
    .find(
      {
        isDraft: false,
        $text: { $search: regexSearch },
      },
      {
        score: { $meta: "textScore" },
      }
    )
    .sort({
      score: { $meta: "textScore" },
    })
    .lean();
  return result;
};

module.exports = {
  createProductTypeRepo,
  createProductRepo,
  findProductByIdRepo,
  publishedProductByShopRepo,
  draftProductByShopRepo,
  findAllProductsByShopRepo,
  searchProductsRepo,
};
