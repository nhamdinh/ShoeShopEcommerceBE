"use strict";
const util = require("util");
const logger = require("../log");

const { ForbiddenRequestError } = require("../core/errorResponse");
const {
  createProductRepo,
  createProductModelRepo,
  publishedProductByShopRepo,
  findAllProductsByShopRepo,
  draftProductByShopRepo,
  searchProductsRepo,
  findAllProductsRepo,
  findProductByIdRepo,
  updateProductByIdRepo,
} = require("../repositories/product.repo");
const { findUserByIdRepo } = require("../repositories/user.repo");
const { PRODUCT_MODEL } = require("../utils/constant");
const {
  removeNullObject,
  updateNestedObjectParser,
  convertToObjectId,
  toNonAccentVietnamese,
} = require("../utils/getInfo");
const InventoryServices = require("./InventoryServices");
const { createReviewRepo } = require("../repositories/review.repo");
const ReviewServices = require("./ReviewServices");

class ProductFactory {
  static productModelStrategy = {
    // electronic: class ClassRef extends Product,
  };
  static registryProductType(model, classRef) {
    ProductFactory.productModelStrategy[model] = classRef;
  }

  static createProduct = async (model, payload) => {
    const productModelClass =
      ProductFactory.productModelStrategy[
        model
      ]; /* = class ClassRef extends Product */
    if (!productModelClass)
      throw new ForbiddenRequestError(`Invalid Product model 2 ::: ${model}`);

    // logger.info(
    //   `payload ::: ${util.inspect(payload, {
    //     showHidden: false,
    //     depth: null,
    //     colors: false,
    //   })}`
    // );

    return new productModelClass(payload).createProduct(); // create CON -> CHA
  };

  static updateProductById = async (model, product_id, payload) => {
    const productModelClass = ProductFactory.productModelStrategy[model];

    if (!productModelClass)
      throw new ForbiddenRequestError(`Invalid Product model 1 ::: ${model}`);

    return new productModelClass(payload).updateProductById(product_id);
    /**
     * const productModel = new productModelClass(payload)
     * update CON -> CHA
     **/
  };

  static findProductById = async ({
    product_id,
    unSelect = ["__v", "product_slug"],
  }) => {
    const foundProduct = await findProductByIdRepo({
      product_id: product_id,
      unSelect,
    });

    if (!foundProduct) {
      return null;
    }
    return foundProduct;
  };

  static findAllDaftByShop = async ({ product_shop, limit = 50, skip = 0 }) => {
    const query = { product_shop, isDraft: true };
    return await findAllProductsByShopRepo({ query, limit, skip });
  };

  static findAllPublishedByShop = async ({
    product_shop,
    limit = 50,
    skip = 0,
  }) => {
    // logger.info(
    //   `    product_shop
    //   ::: ${util.inspect(product_shop, {
    //     showHidden: false,
    //     depth: null,
    //     colors: false,
    //   })}`
    // );
    const query = { product_shop, isPublished: true };
    return await findAllProductsByShopRepo({ query, limit, skip });
  };

  static publishedProductByShop = async ({ product_shop, product_id }) => {
    return await publishedProductByShopRepo({ product_shop, product_id });
  };

  static draftProductByShop = async ({ product_shop, product_id }) => {
    return await draftProductByShopRepo({ product_shop, product_id });
  };

  static searchProducts = async ({ keySearch }) => {
    return await searchProductsRepo({ keySearch });
  };

  static findAllProducts = async ({ query }) => {
    // logger.info(
    //   `limit ::: ${util.inspect(query?.limit, {
    //     showHidden: false,
    //     depth: null,
    //     colors: false,
    //   })}`
    // );
    let {
      sort = "ctime",
      page = +(query?.page ?? 1),
      limit = +(query?.limit ?? 50),
      product_shop = query?.product_shop ?? "",
      keyword = query?.keyword ?? "",
      brand = query?.brand ?? "",
      select = [
        // "product_name",
        // "product_shop",
        // "product_price",
        // "product_thumb",
        // "isDraft",
        // "isPublished",
      ],
    } = query;
    if (product_shop === "") {
      product_shop = {};
    } else {
      product_shop = {
        product_shop: convertToObjectId(product_shop),
      };
    }

    if (keyword === "") {
      keyword = {};
    } else {
      const regexSearch = new RegExp(toNonAccentVietnamese(keyword), "i");

      keyword = {
        product_name_nonVi: { $regex: regexSearch },
      };
    }
    const regexSearchBrand = new RegExp(toNonAccentVietnamese(brand), "i");

    const filter = {
      isPublished: true,
      ...product_shop,
      ...keyword,
      'product_attributes.brand': { $regex: regexSearchBrand }
    };

    // logger.info(
    //   `filter ::: ${util.inspect(
    //     {
    //       sort,
    //       limit,
    //       page,
    //       filter,
    //       select,
    //     },
    //     {
    //       showHidden: false,
    //       depth: null,
    //       colors: false,
    //     }
    //   )}`
    // );

    return await findAllProductsRepo({
      sort,
      limit,
      page,
      filter,
      select,
    });
  };

  static checkUserIsBuy = async (req) => {
    const user = await findUserByIdRepo(req.user._id);

    if (!user) throw new ForbiddenRequestError("User not Found");

    const buyerArr = user?.buyer;
    let hasBuyer = false;
    buyerArr?.map((buyer) => {
      if (req.params.id === buyer) hasBuyer = true;
    });
    return hasBuyer;
  };

  static createProductReview = async (req) => {
    const product = await findProductByIdRepo({
      product_id: req.params?.id,
    });

    if (!product) throw new ForbiddenRequestError("Product not Found");

    const {
      rating = +req.body?.rating ?? 5,
      comment,
      productId,
      shopId,
    } = req.body;

    const productReviews = product?.reviews ?? [];

    logger.info(
      `productReviews ::: ${util.inspect(productReviews, {
        showHidden: false,
        depth: null,
        colors: false,
      })}`
    );

    const alreadyReviewed = productReviews.find(
      (re) => re?.toString() === productId.toString()
    );

    if (alreadyReviewed) {
      throw new ForbiddenRequestError("Product already Reviewed");
    }

    const review = {
      rating: +rating,
      comment,
      userId: convertToObjectId(req.user._id),
      productId: convertToObjectId(productId),
      shopId: convertToObjectId(shopId),
    };

    const newReview = await createReviewRepo(review);

    if (!newReview) throw new ForbiddenRequestError("createReview Error");

    const foundReviews = await ReviewServices.getReviewsByProduct({
      productId: req.params?.id,
    });
    product.reviews.push(productId);
    product.numReviews = +foundReviews?.length ?? 1;
    product.product_ratings = (
      foundReviews.reduce((acc, item) => +acc + +item?.rating, 0) /
        foundReviews?.length ?? 1
    ).toFixed(1);

    await product.save();
    return newReview;
  };
}

class Product {
  // CHA
  constructor({
    /* = payload */ product_name,
    product_thumb,
    product_description,
    product_price,
    product_quantity,
    product_type,
    product_shop,
    product_attributes,
  }) {
    this.product_name = toNonAccentVietnamese(product_name);
    this.product_name_nonVi = product_name;
    this.product_thumb = product_thumb;
    this.product_description = product_description;
    this.product_price = product_price;
    this.product_quantity = product_quantity;
    this.product_type = product_type;
    this.product_shop = product_shop;
    this.product_attributes = product_attributes;
  }

  async createProduct(product_id) {
    return await createProductRepo({ ...this, _id: product_id });
  }

  async updateProductById(product_id, bodyUpdate) {
    return await updateProductByIdRepo("product", { product_id, bodyUpdate });
  }
}

const classRefStrategy = (model) => {
  return class ClassRef extends Product {
    // CON
    async createProduct() {
      const user = await findUserByIdRepo(this.product_shop);

      if (!user) {
        throw new ForbiddenRequestError("User not Found");
      }

      const newProductType = await createProductModelRepo(model, {
        ...this.product_attributes,
        product_shop: this.product_shop,
      });
      // const newProductType = await ProductModel[model].create({
      //   ...this.product_attributes,
      //   product_shop: this.product_shop,
      // });
      // console.log(`newProductType ::: ${newProductType}`);
      if (!newProductType)
        throw new ForbiddenRequestError(`Wrong create new Product ${model}`);

      const newProduct = await super.createProduct(newProductType._id);
      if (!newProduct)
        throw new ForbiddenRequestError("Wrong create new Product");
      await InventoryServices.createInventory({
        inven_productId: newProduct._id,
        inven_shopId: this.product_shop,
        inven_stock: this.product_quantity,
        inven_location: "unknown",
      });

      logger.info(
        `newProduct ::: ${util.inspect(newProduct, {
          showHidden: false,
          depth: null,
          colors: false,
        })}`
      );

      return newProduct;
    }

    async updateProductById(product_id) {
      const objectParams = removeNullObject(this);

      const foundProduct = await findProductByIdRepo({
        product_id,
      });

      if (!foundProduct) {
        throw new ForbiddenRequestError("Product not found", 404);
      }

      const isOwner =
        foundProduct.product_shop.toString() ===
        objectParams.product_shop.toString();
      if (!isOwner) {
        throw new ForbiddenRequestError("You are not Owner", 401);
      }

      const isModel =
        foundProduct.product_type.toString() ===
        objectParams.product_type.toString();
      if (!isModel) {
        throw new ForbiddenRequestError("Wrong product model");
      }

      if (objectParams.product_attributes) {
        await updateProductByIdRepo(model, {
          product_id,
          bodyUpdate: updateNestedObjectParser(
            removeNullObject(objectParams.product_attributes)
          ),
        });
      }

      const updateProduct = await super.updateProductById(
        product_id,
        updateNestedObjectParser(objectParams)
      );
      return updateProduct;
    }
  };
};

// register product model
PRODUCT_MODEL.map((model) => {
  ProductFactory.registryProductType(model, classRefStrategy(model));
});

// console.log(ProductFactory.productModelStrategy);

module.exports = ProductFactory;
