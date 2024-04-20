"use strict";
const util = require("util");
const logger = require("../log");

const { Types } = require("mongoose"); // Erase if already required

const ProductModel = require("../Models/ProductModel");
const {
  getSelectData,
  getUnSelectData,
  convertToObjectId,
} = require("../utils/getInfo");
const { toNonAccentVietnamese } = require("../utils/functionHelpers");
const InventoryServices = require("../services/InventoryServices");

const createProductRepo = async (product) => {

  logger.info(
    `product ::: ${util.inspect(product, {
      showHidden: false,
      depth: null,
      colors: false,
    })}`
  );



  return await ProductModel.product.create({ ...product });
};

const createProductModelRepo = async (type, product) => {
  return await ProductModel[type].create({ ...product });
};

const findAllProductsByShopRepo = async ({ query, limit, skip }) => {
  const count = await ProductModel.product.countDocuments({
    ...query,
  });

  const products = await ProductModel.product
    .find(query)
    .populate("product_shop", "name email productShopName _id")
    .sort({ _id: -1 })
    .skip(skip)
    .limit(limit)
    .lean()
    .exec();

  return {
    totalCount: +count ?? 0,
    totalPages: Math.ceil(count / limit),
    limit: +limit,
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

const updateAll = async () => {
  const products1 = await ProductModel.product.find({}).sort({
    _id: -1,
  });

  // for (let i = 0; i < products1.length; i++) {
  //   const item = products1[i];
  //   item.product_slug = toNonAccentVietnamese(item.product_name).replaceAll(" ","-=");
  //   await item.update(item);
  // }

  const startTime = performance.now();
  // await Promise.all(
  //   products1.map(async (product) => {
  //     product.product_slug = toNonAccentVietnamese(product.product_name).replaceAll(" ","-");
  // const zz  =  +product.product_price * ( (Math.random() * (50 - 10) + 10) +100    )/100
  //     await product.update(product);
  //   })
  // );

  const endTime = performance.now();
  logger.info(
    `endTime - startTime ::: ${util.inspect(endTime - startTime, {
      showHidden: false,
      depth: null,
      colors: false,
    })}`
  );
};

const findAllProductsRepo = async ({
  limit,
  sort,
  page,
  filter,
  select = [],
}) => {
  // updateAll();

  const skip = (page - 1) * limit;
  // const sortBy = sort === "ctime" ? { _id: -1 } : { _id: 1 };
  const sortBy = Object.keys(sort).length ? { ...sort } : { _id: -1 };

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
    totalCount: +count ?? 0,
    totalPages: Math.ceil(count / limit),
    page: +page,
    limit: +limit,
    products: products,
  };
};

const findProductByIdRepo = async ({ product_id, unSelect = [] }) => {
  return await ProductModel.product
    .findById(product_id)
    .select(getUnSelectData(unSelect));
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
  type,
  { product_id, bodyUpdate, options = { upsert: false, new: true } }
) => {
  // logger.info(
  //   `bodyUpdate Repo ::: ${util.inspect(bodyUpdate, {
  //     showHidden: false,
  //     depth: null,
  //     colors: false,
  //   })}`
  // );
  return await ProductModel[type].findByIdAndUpdate(
    product_id,
    bodyUpdate,
    options
  );
};

const checkPriceProductsRepo = async (products) => {
  return await Promise.all(
    products.map(async (product) => {
      const foundProduct = await ProductModel.product.findById(
        convertToObjectId(product?.product_id)
      );

      if (foundProduct) {
        return {
          ...product,
          price: foundProduct?.product_price,
          image: foundProduct?.product_thumb,
          name: foundProduct?.product_name,
        };
      }
    })
  );
};

const findOneAndUpdateProductRepo = async ({
  filter,
  updateSet,
  options = { upsert: false, new: true },
  /* upsert: them moi(true); new: return du lieu moi */
}) => {
  return await ProductModel.product.findOneAndUpdate(
    filter,
    updateSet,
    options
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
  checkPriceProductsRepo,
  findOneAndUpdateProductRepo,
};
