"use strict";
const util = require("util");

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
const { PRODUCT_MODEL } = require("../utils/constant");
const logger = require("../log");
const {
  removeNullObject,
  updateNestedObjectParser,
} = require("../utils/getInfo");

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
      throw new ForbiddenRequestError(`Invalid Product model ::: ${model}`);

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
      throw new ForbiddenRequestError(`Invalid Product model ::: ${model}`);

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
    return await findProductByIdRepo({
      product_id,
      unSelect,
    });
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

  static findAllProducts = async ({
    limit = 50,
    sort = "ctime",
    page = 1,
    filter = { isPublished: true },
    select = ["product_name", "product_price", "product_thumb"],
  }) => {
    return await findAllProductsRepo({
      limit,
      sort,
      page,
      filter,
      select,
    });
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
    this.product_name = product_name;
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
      return newProduct;
    }

    async updateProductById(product_id) {
      const objectParams = removeNullObject(this);

      if (objectParams.product_attributes) {
        await updateProductByIdRepo(model, {
          product_id,
          bodyUpdate: updateNestedObjectParser(removeNullObject(objectParams.product_attributes)),
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
