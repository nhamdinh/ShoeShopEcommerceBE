"use strict";
const { ForbiddenRequestError } = require("../core/errorResponse");
const {
  createProductRepo,
  createProductTypeRepo,
  publishedProductByShopRepo,
  findAllProductsByShopRepo,
  draftProductByShopRepo,
  searchProductsRepo,
  findAllProductsRepo,
  findProductByIdRepo,
} = require("../repositories/product.repo");
const { PRODUCT_TYPES } = require("../utils/constant");

class ProductFactory {
  static productTypeStrategy = {};
  static registryProductType(type, classRef) {
    ProductFactory.productTypeStrategy[type] = classRef;
  }

  static createProduct = async (type, payload) => {
    const productClass = ProductFactory.productTypeStrategy[type];
    if (!productClass)
      throw new ForbiddenRequestError(`Invalid Product type ::: ${type}`);

    return new productClass(payload).createProduct();
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

  static findProductById = async ({
    product_id,
    unSelect = ["__v", "product_attributes"],
  }) => {
    return await findProductByIdRepo({
      product_id,
      unSelect,
    });
  };
}

class Product {
  constructor({
    product_name,
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
}

const classRefStrategy = (type) => {
  return class ClassRef extends Product {
    async createProduct() {
      const newProductType = await createProductTypeRepo(type, {
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
      return newProduct;
    }
  };
};

// register product type
PRODUCT_TYPES.map((type) => {
  ProductFactory.registryProductType(type, classRefStrategy(type));
});

// console.log(ProductFactory.productTypeStrategy);

module.exports = ProductFactory;
