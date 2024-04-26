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
  findProductsByShopRepo,
} = require("../repositories/product.repo");
const {
  findUserByIdRepo,
  findUserByIdLeanRepo,
} = require("../repositories/user.repo");
const {
  PRODUCT_TYPE,
  RD_EXPIRE,
  RD_ALL_PRODUCTS,
  RD_FILTER_PRODUCTS,
  RD_FILTER_PRODUCTS_MAX,
  RD_ALL_PRODUCTS_MAX,
} = require("../utils/constant");
const { convertToObjectId } = require("../utils/getInfo");
const InventoryServices = require("./InventoryServices");
const { createReviewRepo } = require("../repositories/review.repo");
const ReviewServices = require("./ReviewServices");
const {
  toNonAccentVietnamese,
  removeNullObject,
  updateNestedObjectParser,
} = require("../utils/functionHelpers");
const { setAsync, getAsync } = require("./redis.service");
const { updateAllRepo } = require("../repositories/updateDB.repo");

class ProductFactory {
  static productTypeStrategy = {
    // electronic: class ClassRef extends Product,
  };
  static registryProductType(type, classRef) {
    ProductFactory.productTypeStrategy[type] = classRef;
  }

  static createProductTypeFactory = async (type, payload) => {
    const productTypeClass =
      ProductFactory.productTypeStrategy[
        type
      ]; /* = class ClassRef extends Product */
    if (!productTypeClass)
      throw new ForbiddenRequestError(
        `Invalid Product type createProductTypeFactory ::: ${type}`
      );

    const product_shop = payload.user._id;

    const user = await findUserByIdLeanRepo({
      id: convertToObjectId(product_shop),
      unSelect: [
        "buyer",
        "password",
        "__v",
        "refreshToken",
        "user_salt",
        "user_clients",
        "user_follower",
        "user_watching",
      ],
    });

    if (!user) throw new ForbiddenRequestError("User not Found");

    payload.product_shop = product_shop;

    return new productTypeClass(payload).createProductType(); // create CON -> CHA
  };

  static updateProductTypeById = async (type, product_id, payload) => {
    const productTypeClass = ProductFactory.productTypeStrategy[type];

    if (!productTypeClass)
      throw new ForbiddenRequestError(
        `Invalid Product type updateProductTypeById ::: ${type}`
      );

    return new productTypeClass(payload).updateProductTypeById(product_id);
    /**
     * const productModel = new productTypeClass(payload)
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
    user,
  }) => {
    // updateAllRepo()
    // if (user._id?.toString() !== product_shop?.toString())
    //   throw new ForbiddenRequestError("You are not Owner!!");

    const query = { product_shop, isPublished: true, isDelete: false };
    return await findAllProductsByShopRepo({ query, limit, skip });
  };

  static updateStatusProductsByShop = async ({ user, body }) => {
    const { product_shop, bodyUpdate, ids } = body;
    // updateAllRepo()

    // if (user._id?.toString() !== product_shop?.toString())
    //   throw new ForbiddenRequestError("You are not Owner!!");

    if (!ids.length) return false;

    await Promise.all(
      ids.map(async (id) => {
        return await updateProductByIdRepo("product", {
          product_id: convertToObjectId(id),
          bodyUpdate,
        });
      })
    );

    return true;
  };

  static findAllProductsByShop = async ({ user, body }) => {
    const {
      product_shop,
      limit = 50,
      page = 1,
      sort = { _id: -1 },
      select = [
        // "product_name",
        // "product_shop",
        // "product_price",
        // "product_original_price",
        // "product_thumb",
        // "isDraft",
        // "isPublished",
      ],
      isDelete,
      isPublished,
      product_type,
      keyword,
    } = body;

    // updateAllRepo()

    // if (user._id?.toString() !== product_shop?.toString())
    //   throw new ForbiddenRequestError("You are not Owner!!");

    const filter = { product_shop };
    if (typeof isDelete === "boolean") filter.isDelete = isDelete;
    if (typeof isPublished === "boolean") filter.isPublished = isPublished;
    if (product_type) filter.product_type = product_type;

    if (keyword) {
      const regexSearch = new RegExp(
        toNonAccentVietnamese(keyword).replaceAll(" ", "-"),
        "i"
      );
      filter.product_slug = { $regex: regexSearch };
    }

    return await findProductsByShopRepo({
      sort,
      limit,
      page,
      filter,
      select,
    });
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
    let {
      page = +(query?.page ?? 1),
      limit = +(query?.limit ?? 50),

      orderByKey = query?.orderByKey ?? "_id",
      orderByValue = +(query?.orderByValue ?? -1),
      product_shop = query?.product_shop ?? "",
      keyword = query?.keyword ?? "",
      brand = query?.brand ?? "",
      product_type = query?.product_type ?? "",
      select = [
        // "product_name",
        // "product_shop",
        // "product_price",
        // "product_original_price",
        // "product_thumb",
        // "isDraft",
        // "isPublished",
      ],
    } = query;
    const sort = {};
    sort[orderByKey] = +orderByValue;
    const keywords = keyword;

    if (product_type) {
      product_type = {
        product_type,
      };
    } else {
      product_type = {};
    }

    if (product_shop) {
      product_shop = {
        product_shop: convertToObjectId(product_shop),
      };
    } else {
      product_shop = {};
    }

    if (keyword) {
      const regexSearch = new RegExp(
        toNonAccentVietnamese(keyword).replaceAll(" ", "-"),
        "i"
      );

      keyword = {
        product_slug: { $regex: regexSearch },
      };
    } else {
      keyword = {};
    }

    const regexSearchBrand = new RegExp(
      toNonAccentVietnamese(brand.toUpperCase() !== "ALL" ? brand : ""),
      "i"
    );

    const filter = {
      isPublished: true,
      ...product_shop,
      ...product_type,
      ...keyword,
      "product_attributes.brand": { $regex: regexSearchBrand },
    };

    // const cachedData = await getAsync(RD_ALL_PRODUCTS);

    // if (cachedData) return JSON.parse(cachedData);

    const cachedDataFilter = await getAsync(RD_FILTER_PRODUCTS);

    if (cachedDataFilter) {
      if (
        cachedDataFilter ===
        JSON.stringify({
          sort,
          limit,
          page,
          filter,
          keywords: toNonAccentVietnamese(keywords),
          brand,
        })
      ) {
        logger.info(
          `findAllProducts GIONG ::: ${util.inspect(cachedDataFilter, {
            showHidden: false,
            depth: null,
            colors: false,
          })}`
        );

        const cachedData = await getAsync(RD_ALL_PRODUCTS);

        if (cachedData) return JSON.parse(cachedData);

        const metadata = await findAllProductsRepo({
          sort,
          limit,
          page,
          filter,
          select,
        });
        await setAsync(
          RD_ALL_PRODUCTS,
          JSON.stringify(metadata),
          "EX",
          RD_EXPIRE
        );
        return metadata;
      }

      await setAsync(
        RD_FILTER_PRODUCTS,
        JSON.stringify({
          sort,
          limit,
          page,
          filter,
          keywords: toNonAccentVietnamese(keywords),
          brand,
        }),
        "EX",
        RD_EXPIRE
      );

      const metadata = await findAllProductsRepo({
        sort,
        limit,
        page,
        filter,
        select,
      });
      await setAsync(
        RD_ALL_PRODUCTS,
        JSON.stringify(metadata),
        "EX",
        RD_EXPIRE
      );
      return metadata;
    }

    await setAsync(
      RD_FILTER_PRODUCTS,
      JSON.stringify({
        sort,
        limit,
        page,
        filter,
        keywords: toNonAccentVietnamese(keywords),
        brand,
      }),
      "EX",
      RD_EXPIRE
    );

    const metadata = await findAllProductsRepo({
      sort,
      limit,
      page,
      filter,
      select,
    });
    await setAsync(RD_ALL_PRODUCTS, JSON.stringify(metadata), "EX", RD_EXPIRE);
    return metadata;
  };

  static findAllProductsMax = async ({ query }) => {
    const {
      sort = { _id: -1 },
      page = +(query?.page ?? 1),
      limit = +(query?.limit ?? 50),
      select = [
        // "product_name",
        // "product_shop",
        // "product_price",
        // "product_original_price",
        // "product_thumb",
        // "isDraft",
        // "isPublished",
      ],
    } = query;

    const filter = {
      isPublished: true,
    };

    const cachedFilter = {
      limit,
      page,
      filter,
    };

    const cachedDataFilter = await getAsync(RD_FILTER_PRODUCTS_MAX);

    if (cachedDataFilter) {
      if (cachedDataFilter === JSON.stringify(cachedFilter)) {
        logger.info(
          `findAllProductsMax GIONG ::: ${util.inspect(cachedDataFilter, {
            showHidden: false,
            depth: null,
            colors: false,
          })}`
        );

        const cachedData = await getAsync(RD_ALL_PRODUCTS_MAX);

        if (cachedData) return JSON.parse(cachedData);

        const metadata = await findAllProductsRepo({
          sort,
          limit,
          page,
          filter,
          select,
        });
        await setAsync(
          RD_ALL_PRODUCTS_MAX,
          JSON.stringify(metadata),
          "EX",
          RD_EXPIRE
        );
        return metadata;
      }

      await setAsync(
        RD_FILTER_PRODUCTS_MAX,
        JSON.stringify(cachedFilter),
        "EX",
        RD_EXPIRE
      );

      const metadata = await findAllProductsRepo({
        sort,
        limit,
        page,
        filter,
        select,
      });
      await setAsync(
        RD_ALL_PRODUCTS_MAX,
        JSON.stringify(metadata),
        "EX",
        RD_EXPIRE
      );
      return metadata;
    }

    await setAsync(
      RD_FILTER_PRODUCTS_MAX,
      JSON.stringify(cachedFilter),
      "EX",
      RD_EXPIRE
    );

    const metadata = await findAllProductsRepo({
      sort,
      limit,
      page,
      filter,
      select,
    });
    await setAsync(
      RD_ALL_PRODUCTS_MAX,
      JSON.stringify(metadata),
      "EX",
      RD_EXPIRE
    );
    return metadata;
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

    // logger.info(
    //   `productReviews ::: ${util.inspect(productReviews, {
    //     showHidden: false,
    //     depth: null,
    //     colors: false,
    //   })}`
    // );

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
    product_thumb_small,
    product_description,
    product_price,
    product_original_price,
    product_quantity,
    product_type,
    product_shop,
    product_attributes,
  }) {
    this.product_name = product_name;
    // this.product_name_nonVi = toNonAccentVietnamese(product_name);
    this.product_thumb = product_thumb;
    this.product_thumb_small = product_thumb_small;
    this.product_description = product_description;
    this.product_price = product_price;
    this.product_original_price = product_original_price;
    this.product_quantity = product_quantity;
    this.product_type = product_type;
    this.product_shop = product_shop;
    this.product_attributes = product_attributes;
  }

  async createProduct(product_id) {
    await Product.resetFilter();
    return await createProductRepo({ ...this, _id: product_id });
  }

  async updateProductById(product_id, bodyUpdate) {
    await Product.resetFilter();
    return await updateProductByIdRepo("product", { product_id, bodyUpdate });
  }

  static async resetFilter() {
    await setAsync(RD_FILTER_PRODUCTS_MAX, "", "EX", RD_EXPIRE);
    await setAsync(RD_FILTER_PRODUCTS, "", "EX", RD_EXPIRE);
  }
}

const classRefStrategy = (type) => {
  return class ClassRef extends Product {
    // CON
    async createProductType() {

      const newProductType = await createProductModelRepo(type, {
        ...this.product_attributes,
        product_shop: this.product_shop,
      });
      // const newProductType = await ProductModel[type].create({
      //   ...this.product_attributes,
      //   product_shop: this.product_shop,
      // });
      // console.log(`newProductType ::: ${newProductType}`);
      if (!newProductType)
        throw new ForbiddenRequestError(`Wrong create new Product ${type}`);

      const newProduct = await super.createProduct(newProductType._id);
      if (!newProduct)
        throw new ForbiddenRequestError("Wrong create new Product");

      await InventoryServices.createInventory({
        inven_productId: newProduct._id,
        inven_shopId: this.product_shop,
        inven_product_slug: this.product_slug,
        inven_stock: this.product_quantity,
        inven_location: "unknown",
      });

      return newProduct;
    }

    async updateProductTypeById(product_id) {
      const objectParams = removeNullObject(this);
      if (objectParams?.product_name)
        objectParams.product_slug = toNonAccentVietnamese(
          objectParams.product_name
        ).replaceAll(" ", "-");

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
        throw new ForbiddenRequestError("Wrong product type");
      }

      if (objectParams.product_attributes) {
        await updateProductByIdRepo(type, {
          product_id,
          bodyUpdate: updateNestedObjectParser(objectParams.product_attributes),
        });
      }

      delete objectParams["product_shop"];
      const updatedProduct = await super.updateProductById(
        product_id,
        updateNestedObjectParser(objectParams)
      );

      const updatedInventory =
        await InventoryServices.findOneAndUpdateInventory({
          filter: { inven_productId: updatedProduct._id },
          updateSet: {
            inven_product_slug: updatedProduct.product_slug,
            inven_stock: updatedProduct.product_quantity,
          },
        });

      // logger.info(
      //   `updatedInventory ::: ${util.inspect(updatedInventory, {
      //     showHidden: false,
      //     depth: null,
      //     colors: false,
      //   })}`
      // );

      if (!updatedInventory)
        throw new ForbiddenRequestError("update Inventory failed");

      return updatedProduct;
    }
  };
};

// register product type
PRODUCT_TYPE.map((type) => {
  ProductFactory.registryProductType(type, classRefStrategy(type));
});

// console.log(ProductFactory.productTypeStrategy);

module.exports = ProductFactory;
