"use strict";

const ProductModel = require("../Models/ProductModel");
const { ForbiddenRequestError } = require("../core/errorResponse");

class ProductFactory {
  static createProduct = async (req) => {
    const user = await findUserById(req.user._id);
    if (!user) {
      throw new ForbiddenRequestError("User not Found");
    }
    const admins = await findAllAdminUsers();
    // logger.info(`admins ::: ${admins}`);
    return {
      ...getInfoData({
        object: user,
        fields: ["_id", "name", "email", "phone", "isAdmin", "createdAt"],
      }),
      admins,
    };
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

  async createProduct() {
    return await ProductModel.product.create(this);
  }
}

class Clothing extends Product {
  async createProduct() {
    const newClothing = await ProductModel.clothing.create(
      this.product_attributes
    );
    if (!newClothing) throw new ForbiddenRequestError("Wrong create clothing");

    const newProduct = await super.createProduct();
    if (!newProduct)
      throw new ForbiddenRequestError("Wrong create new Product");
    return newProduct;
  }
}
class Electronic extends Product {
  async createProduct() {
    const newElectronic = await ProductModel.electronic.create(
      this.product_attributes
    );
    if (!newElectronic)
      throw new ForbiddenRequestError("Wrong create electronic");

    const newProduct = await super.createProduct();
    if (!newProduct)
      throw new ForbiddenRequestError("Wrong create new Product");
    return newProduct;
  }
}

module.exports = ProductFactory;
