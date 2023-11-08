"use strict";

const ProductModel = require("../Models/ProductModel");
const { ForbiddenRequestError } = require("../core/errorResponse");

class ProductFactory {
  static productRegistry = {};

  static registryProductType(type, classRef) {
    ProductFactory.productRegistry[type] = classRef;
  }

  static createProduct = async (type, payload) => {
    const productClass = ProductFactory.productRegistry[type];
    if (!productClass)
      throw new ForbiddenRequestError(`Invalid Product type ::: ${type}`);

    return new productClass(payload).createProduct();
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
    return await ProductModel.product.create({ ...this, _id: product_id });
  }
}

class Clothing extends Product {
  async createProduct() {
    const newClothing = await ProductModel.clothing.create({
      ...this.product_attributes,
      product_shop: this.product_shop,
    });
    if (!newClothing) throw new ForbiddenRequestError("Wrong create clothing");

    const newProduct = await super.createProduct(newClothing._id);
    if (!newProduct)
      throw new ForbiddenRequestError("Wrong create new Product");
    return newProduct;
  }
}
class Electronic extends Product {
  async createProduct() {
    const newElectronic = await ProductModel.electronic.create({
      ...this.product_attributes,
      product_shop: this.product_shop,
    });
    console.log(`newElectronic ::: ${newElectronic}`);
    if (!newElectronic)
      throw new ForbiddenRequestError("Wrong create electronic");

    const newProduct = await super.createProduct(newElectronic._id);
    if (!newProduct)
      throw new ForbiddenRequestError("Wrong create new Product");
    return newProduct;
  }
}
// register product type
ProductFactory.registryProductType("Clothing", Clothing);
ProductFactory.registryProductType("Electronic", Electronic);
module.exports = ProductFactory;
