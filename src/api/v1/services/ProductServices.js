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
  findProductById1Repo,
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
const {
  createReviewRepo,
  findReviewsRepo,
} = require("../repositories/review.repo");
const ReviewServices = require("./ReviewServices");
const {
  toNonAccentVietnamese,
  removeNullObject,
  updateNestedObjectParser,
} = require("../utils/functionHelpers");
const { setAsync, getAsync } = require("./redis.service");
const { updateAllRepo } = require("../repositories/updateDB.repo");
const SkuServices = require("./sku.service");
const { findSkusRepo } = require("../repositories/sku.repo");

class ProductFactory {
  static productTypeStrategy = {
    // electronic: class ClassRef extends Product,
  };
  static registryProductType(type, classRef) {
    ProductFactory.productTypeStrategy[type] = classRef;
  }

  static createProductTypeFactory = async (payload) => {
    const product_shop = payload.user._id;

    payload.product_shop = product_shop;

    return new Product(payload).createProduct({ body: payload });
  };

  // static createProductTypeFactory = async (type, payload) => {
  //   const productTypeClass =
  //     ProductFactory.productTypeStrategy[
  //       type
  //     ]; /* = class ClassRef extends Product */
  //   if (!productTypeClass)
  //     throw new ForbiddenRequestError(
  //       `Invalid Product type createProductTypeFactory ::: ${type}`
  //     );

  //   const product_shop = payload.user._id;

  //   const user = await findUserByIdLeanRepo({
  //     id: convertToObjectId(product_shop),
  //     unSelect: [
  //       "buyer",
  //       "password",
  //       "__v",
  //       "refreshToken",
  //       "user_salt",
  //       "user_clients",
  //       "user_follower",
  //       "user_watching",
  //     ],
  //   });

  //   if (!user) throw new ForbiddenRequestError("User not Found");

  //   payload.product_shop = product_shop;

  //   return new productTypeClass(payload).createProductType(); // create CON -> CHA
  // };

  // static updateProductTypeById = async ({ type, product_id, payload }) => {
  //   const productTypeClass = ProductFactory.productTypeStrategy[type];

  //   if (!productTypeClass)
  //     throw new ForbiddenRequestError(
  //       `Invalid Product type updateProductTypeById ::: ${type}`
  //     );

  //   return new productTypeClass(payload).updateProductTypeById(product_id);
  //   /**
  //    * const productModel = new productTypeClass(payload)
  //    * update CON -> CHA
  //    **/
  // };

  static updateProductTypeByIdFactory = async ({
    type,
    product_id,
    payload,
  }) => {
    const foundProduct = await findProductById1Repo({
      product_id,
    });

    if (!foundProduct)
      throw new ForbiddenRequestError("Product not found", 404);

    const isOwner =
      foundProduct.product_shop.toString() === payload.product_shop.toString();
    if (!isOwner) throw new ForbiddenRequestError("You are not Owner", 403);

    return new Product(payload).updateProductById2(product_id, {
      body: payload,
    });
  };

  static findProductById = async ({
    product_id,
    unSelect = ["__v"],
    query,
  }) => {
    const foundProduct = await findProductById1Repo({
      product_id: product_id,
      unSelect,
    });

    if (!foundProduct) throw new ForbiddenRequestError("Product not Found");

    const limit = 50,
      page = 1,
      sort = { _id: -1 };

    const filter = {
      sku_product_id: convertToObjectId(product_id),
      isDelete: false,
    };

    const metadata = await findSkusRepo({
      sort,
      limit,
      page,
      filter,
      unSelect,
    });

    foundProduct.skus = metadata.skus;

    return foundProduct;
  };

  static findProductsByShop = async ({
    user,
    queryShop,
    isDraft,
    isPublished,
  }) => {
    const {
      product_shop,
      limit = 50,
      page = 1,
      orderByKey = "_id",
      orderByValue = -1,
      select = [
        // "product_name",
        // "product_shop",
        // "product_price",
        // "product_original_price",
        // "product_thumb",
        // "isDraft",
        // "isPublished",
      ],
      keyword,
      brand = "",
      product_categories = "",
    } = queryShop;
    const sort = {};
    sort[orderByKey] = orderByValue;
    // if (user._id?.toString() !== product_shop?.toString())
    //   throw new ForbiddenRequestError("You are not Owner!!");

    const filter = { product_shop, isDelete: false };
    if (typeof isDraft === "boolean") filter.isDraft = isDraft;
    if (typeof isPublished === "boolean") filter.isPublished = isPublished;

    if (keyword) {
      const regexSearch = new RegExp(
        toNonAccentVietnamese(keyword).replaceAll(" ", "-"),
        "i"
      );
      filter.product_slug = { $regex: regexSearch };
    }
    if (brand) filter.product_brand = convertToObjectId(brand);

    if (product_categories) {
      const ids = product_categories.split(",");
      filter.product_categories = { $in: ids };
    }

    return await findProductsByShopRepo({
      sort,
      limit,
      page,
      filter,
      select,
    });
  };

  static updateStatusProductsByShop = async ({ user, body }) => {
    const { product_shop, bodyUpdate, ids } = body;
    // updateAllRepo()

    if (user._id?.toString() !== product_shop?.toString())
      throw new ForbiddenRequestError("You are not Owner!!");

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
      // product_type,
      keyword,
      brand = "",
      product_categories = "",
    } = body;

    // updateAllRepo();

    // if (user._id?.toString() !== product_shop?.toString())
    //   throw new ForbiddenRequestError("You are not Owner!!");

    const filter = { product_shop };
    if (typeof isDelete === "boolean") filter.isDelete = isDelete;
    if (typeof isPublished === "boolean") filter.isPublished = isPublished;
    // if (product_type) filter.product_type = product_type;

    if (keyword) {
      const regexSearch = new RegExp(
        toNonAccentVietnamese(keyword).replaceAll(" ", "-"),
        "i"
      );
      filter.product_slug = { $regex: regexSearch };
    }
    if (brand) filter.product_brand = convertToObjectId(brand);

    if (product_categories) {
      const ids = product_categories.split(",");
      filter.product_categories = { $in: ids };
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
    const {
      page = +(query?.page ?? 1),
      limit = +(query?.limit ?? 50),

      orderByKey = query?.orderByKey ?? "_id",
      orderByValue = +(query?.orderByValue ?? -1),
      product_shop = query?.product_shop ?? "",
      keyword = query?.keyword ?? "",
      brand = query?.brand ?? "",
      product_categories = query?.product_categories ?? "",
      // product_type = query?.product_type ?? "",
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

    const filter = {
      isPublished: true,
      // "product_attributes.brand": { $regex: regexSearchBrand },
    };

    if (product_shop) filter.product_shop = convertToObjectId(product_shop);

    if (keyword) {
      const regexSearch = new RegExp(
        toNonAccentVietnamese(keyword).replaceAll(" ", "-"),
        "i"
      );
      filter.product_slug = { $regex: regexSearch };
    }

    if (brand) filter.product_brand = convertToObjectId(brand);

    if (product_categories) {
      const ids = product_categories.split(",");
      filter.product_categories = { $in: ids };
    }

    const cacheFilterObj = {
      sort,
      limit,
      page,
      filter,
      keywords: toNonAccentVietnamese(keyword),
    };

    const cachedFilter = await getAsync(RD_FILTER_PRODUCTS);

    if (cachedFilter && cachedFilter === JSON.stringify(cacheFilterObj)) {
      // 1. exists cachedFilter and same cache
      logger.info(
        `cachedFilter ::: ${util.inspect(cachedFilter, {
          showHidden: false,
          depth: null,
          colors: false,
        })}`
      );

      const cachedData = await getAsync(RD_ALL_PRODUCTS);

      // 2. exists cachedData
      if (cachedData) return JSON.parse(cachedData);

      // 3. NOT exists cachedData
      return await ProductFactory.getAndSetProductsHelper({
        sort,
        limit,
        page,
        filter,
        select,
        rdKey: RD_ALL_PRODUCTS,
      });
    }

    // 4. NOT exists cachedFilter
    await setAsync(
      RD_FILTER_PRODUCTS,
      JSON.stringify(cacheFilterObj),
      "EX",
      RD_EXPIRE
    );

    return await ProductFactory.getAndSetProductsHelper({
      sort,
      limit,
      page,
      filter,
      select,
      rdKey: RD_ALL_PRODUCTS,
    });
    // const metadata = await findAllProductsRepo({
    //   sort,
    //   limit,
    //   page,
    //   filter,
    //   select,
    // });
    // await setAsync(RD_ALL_PRODUCTS, JSON.stringify(metadata), "EX", RD_EXPIRE);
    // return metadata;
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

    const cacheFilterObj = {
      limit,
      page,
      filter,
    };

    const cachedFilterMax = await getAsync(RD_FILTER_PRODUCTS_MAX);

    if (cachedFilterMax && cachedFilterMax === JSON.stringify(cacheFilterObj)) {
      // 1. exists cachedFilter and same cache
      logger.info(
        `cachedFilter Max ::: ${util.inspect(cachedFilterMax, {
          showHidden: false,
          depth: null,
          colors: false,
        })}`
      );
      const cachedData = await getAsync(RD_ALL_PRODUCTS_MAX);

      // 2. exists cachedData
      if (cachedData) return JSON.parse(cachedData);
      // 3. NOT exists cachedData
      return await ProductFactory.getAndSetProductsHelper({
        sort,
        limit,
        page,
        filter,
        select,
        rdKey: RD_ALL_PRODUCTS_MAX,
      });
    }
    // 4. NOT exists cachedFilter
    await setAsync(
      RD_FILTER_PRODUCTS_MAX,
      JSON.stringify(cacheFilterObj),
      "EX",
      RD_EXPIRE
    );

    return await ProductFactory.getAndSetProductsHelper({
      sort,
      limit,
      page,
      filter,
      select,
      rdKey: RD_ALL_PRODUCTS_MAX,
    });

    //   const metadata = await findAllProductsRepo({
    //     sort,
    //     limit,
    //     page,
    //     filter,
    //     select,
    //   });
    //   await setAsync(
    //     RD_ALL_PRODUCTS_MAX,
    //     JSON.stringify(metadata),
    //     "EX",
    //     RD_EXPIRE
    //   );
    //   return metadata;
  };

  static getAndSetProductsHelper = async ({
    sort,
    limit,
    page,
    filter,
    select,
    rdKey,
  }) => {
    const metadata = await findAllProductsRepo({
      sort,
      limit,
      page,
      filter,
      select,
    });
    await setAsync(rdKey, JSON.stringify(metadata), "EX", RD_EXPIRE);
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

  static createProductReview = async ({ params, body, user }) => {
    const { id } = params;
    const { rating = 5, comment } = body;

    const product = await findProductById1Repo({
      product_id: convertToObjectId(id),
    });

    if (!product) throw new ForbiddenRequestError("Product not Found");

    const review = {
      rating: +rating,
      comment,
      userId: convertToObjectId(user._id),
      productId: convertToObjectId(id),
      shopId: convertToObjectId(product?.product_shop),
    };

    const newReview = await createReviewRepo(review);

    if (!newReview) throw new ForbiddenRequestError("createReview Error");

    const metadataReviews = await findReviewsRepo({
      filter: { productId: convertToObjectId(product._id) },
      limit: 999,
      sort: { _id: -1 },
      page: 1,
      select: ["_id", "rating"],
    });

    const { reviews = [], totalCount } = metadataReviews;

    const bodyUpdate = {
      reviews,
      numReviews: +totalCount,
      product_ratings: +(
        reviews.reduce((acc, item) => +acc + +item?.rating, 0) /
          reviews?.length ?? 1
      ).toFixed(1),
    };

    await updateProductByIdRepo("product", {
      product_id: convertToObjectId(id),
      bodyUpdate,
    });

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
    // product_type,
    product_shop,
    product_attributes,
    product_categories,
    product_brand,
    product_variants,
  }) {
    this.product_name = product_name;
    this.product_thumb = product_thumb;
    this.product_thumb_small = product_thumb_small;
    this.product_description = product_description;
    this.product_price = product_price;
    this.product_original_price = product_original_price;
    this.product_quantity = product_quantity;
    // this.product_type = product_type;
    this.product_shop = product_shop;
    this.product_attributes = product_attributes;
    this.product_categories = product_categories;
    this.product_brand = product_brand;
    this.product_variants = product_variants;
  }

  async createProduct({ body }) {
    const { sku_list = [] } = body;

    // 1. check shop exists
    const foundShop = await findUserByIdLeanRepo({
      id: convertToObjectId(this.product_shop),
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
    if (!foundShop) throw new ForbiddenRequestError("Shop not Found");

    // 2. create newSpu
    const newProduct = await createProductRepo({ ...this });
    if (!newProduct)
      throw new ForbiddenRequestError("Wrong create new Product");

    if (newProduct && sku_list.length) {
      // 3.1. create new Skus
      await SkuServices.createSkus({
        sku_product_id: newProduct._id,
        sku_product_shop: newProduct.product_shop,
        sku_list,
        sku_slug: newProduct.product_slug,
      });
    }
    // 3.2. create new Inventory
    await InventoryServices.createInventory({
      inven_productId: newProduct._id,
      inven_shopId: newProduct.product_shop,
      inven_product_slug: newProduct.product_slug,
      inven_stock: newProduct.product_quantity,
      inven_location: "unknown",
    });

    // 4. sycn data via elasticsearch

    // 5. response
    await Product.resetFilter();
    return newProduct;
  }

  // async createProduct(product_id) {
  //   await Product.resetFilter();
  //   return await createProductRepo({ ...this, _id: product_id });
  // }

  async updateProductById2(product_id, { body }) {
    const { sku_list = [] } = body;

    const objectParams = removeNullObject(this);

    if (objectParams?.product_name)
      objectParams.product_slug = toNonAccentVietnamese(
        objectParams.product_name
      ).replaceAll(" ", "-");

    delete objectParams["product_shop"];

    const updatedProduct = await updateProductByIdRepo("product", {
      product_id,
      bodyUpdate: updateNestedObjectParser(objectParams),
    });

    if (updatedProduct && sku_list.length) {
      // 1. update Skus
      await SkuServices.updateSkus({
        sku_product_id: updatedProduct._id,
        sku_product_shop: updatedProduct.product_shop,
        sku_list,
        sku_slug: updatedProduct.product_slug,
      });
    }

    await InventoryServices.findOneAndUpdateInventory({
      filter: { inven_productId: convertToObjectId(updatedProduct._id) },
      updateSet: {
        inven_product_slug: updatedProduct.product_slug,
        inven_stock: updatedProduct.product_quantity,
      },
    });

    await Product.resetFilter();
    return updatedProduct;
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
        inven_shopId: newProduct.product_shop,
        inven_product_slug: newProduct.product_slug,
        inven_stock: newProduct.product_quantity,
        inven_location: "unknown",
      });

      return newProduct;
    }

    async updateProductTypeById(product_id) {
      const objectParams = removeNullObject(this);

      const foundProduct = await findProductByIdRepo({
        product_id,
      });

      if (!foundProduct)
        throw new ForbiddenRequestError("Product not found", 404);

      const isOwner =
        foundProduct.product_shop.toString() ===
        objectParams.product_shop.toString();
      if (!isOwner) throw new ForbiddenRequestError("You are not Owner", 403);

      if (objectParams?.product_name)
        objectParams.product_slug = toNonAccentVietnamese(
          objectParams.product_name
        ).replaceAll(" ", "-");
      // const isModel =
      //   foundProduct.product_type.toString() ===
      //   objectParams.product_type.toString();
      // if (!isModel) {
      //   throw new ForbiddenRequestError("Wrong product type");
      // }

      // if (objectParams.product_attributes) {
      //   await updateProductByIdRepo(type, {
      //     product_id,
      //     bodyUpdate: updateNestedObjectParser(objectParams.product_attributes),
      //   });
      // }

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
