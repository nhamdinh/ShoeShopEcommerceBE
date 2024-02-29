"use strict";
const util = require("util");

const { Types } = require("mongoose"); // Erase if already required

const ProductModel = require("../Models/ProductModel");
const {
  getSelectData,
  getUnSelectData,
  convertToObjectId,
} = require("../utils/getInfo");
const logger = require("../log");

const createProductRepo = async (product) => {
  return await ProductModel.product.create({ ...product });
};

const createProductModelRepo = async (model, product) => {
  return await ProductModel[model].create({ ...product });
};

const findAllProductsByShopRepo = async ({ query, limit, skip }) => {
  const products = await ProductModel.product
    .find(query)
    .populate("product_shop", "name email productShopName _id")
    .sort({ updatedAt: -1 })
    .skip(skip)
    .limit(limit)
    .lean()
    .exec();

  return {
    totalCount: products.length ?? 0,
    products: products,
  };
};

// const findProductByIdByShopRepo = async ({ product_shop, product_id }) => {
//   return await ProductModel.product.findOne({
//     product_shop: new Types.ObjectId(product_shop),
//     _id: new Types.ObjectId(product_id),
//   });
// };

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

const findAllProductsRepo = async ({ limit, sort, page, filter, select }) => {
  const skip = (page - 1) * limit;
  const sortBy = sort === "ctime" ? { _id: -1 } : { _id: 1 };

  const count = await ProductModel.product.countDocuments({
    ...filter,
  });

  const products = await ProductModel.product
    .find(filter)
    .sort(sortBy)
    .skip(skip)
    .limit(limit)
    .populate({ path: "product_shop" })
    .select(getSelectData(select))
    .lean();

    return {
    totalCount: count ?? 0,
    totalPages: Math.ceil(count / limit),
    page: +page,
    limit: +limit,
    products: products,
  };
};

const findProductByIdRepo = async ({ product_id, unSelect = [] }) => {
  return await ProductModel.product
    .findById(product_id)
    .select(getUnSelectData(unSelect))
    // .lean();
};

const findProductById1Repo = async ({ product_id }) => {
  return await ProductModel.product.findById(product_id).lean();
};

const findOneProductRepo = async ({ filter }) => {
  // logger.info(
  //   `filter Repo ::: ${util.inspect(filter, {
  //     showHidden: false,
  //     depth: null,
  //     colors: false,
  //   })}`
  // );
  return await ProductModel.product.findOne(filter).lean();
};

const updateProductByIdRepo = async (
  model,
  { product_id, bodyUpdate, isNew = true }
) => {
  // logger.info(
  //   `bodyUpdate Repo ::: ${util.inspect(bodyUpdate, {
  //     showHidden: false,
  //     depth: null,
  //     colors: false,
  //   })}`
  // );
  return await ProductModel[model].findByIdAndUpdate(product_id, bodyUpdate, {
    new: isNew,
  });
};

const checkProductsRepo = async (products) => {
  return await Promise.all(
    products.map(async (product) => {
      const foundProduct = await ProductModel.product.findById(
        convertToObjectId(product?.product_id)
      );

      if (foundProduct) {
        return {
          ...product,
          price: foundProduct?.product_price,
        };
      }
    })
  );
};

module.exports = {
  createProductModelRepo,
  createProductRepo,
  findProductByIdRepo,
  publishedProductByShopRepo,
  draftProductByShopRepo,
  findAllProductsByShopRepo,
  searchProductsRepo,
  findAllProductsRepo,
  updateProductByIdRepo,
  findOneProductRepo,
  findProductById1Repo,
  checkProductsRepo,
};
