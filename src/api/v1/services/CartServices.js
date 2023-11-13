"use strict";
const util = require("util");
const logger = require("../log");

const { ForbiddenRequestError } = require("../core/errorResponse");
const {
  findOneAndUpdateRepo,
  findOneRepo,
  updateCartRepo,
} = require("../repositories/cart.repo");
const { convertToObjectId } = require("../utils/getInfo");

/**
 * 1. add product to cart [User]
 * 2. reduce product quantity by one [User]
 * 3. increase product quantity by One [User]
 * 4. get cart [User]
 * 5. Delete cart [User]
 * 6. Delete cart item [User]
 **/

class CartServices {
  static createCart = async ({ cart_userId, product }) => {
    const query = {
        cart_userId,
      },
      updateOrInsert = {
        $addToSet: {
          cart_products: product,
        },
      },
      options = { upsert: true, new: true };
    return await findOneAndUpdateRepo(query, updateOrInsert, options);
  };

  static updateQuantityProducts = async ({
    cart_id = convertToObjectId(cart_id),
    cart_userId,
    product,
  }) => {
    const { productId, quantity } = product;
    const query = {
        _id: cart_id,
        cart_userId,
        "cart_products.productId": productId,
      },
      updateSet = {
        $inc: {
          "cart_products.$.quantity": quantity,
        },
      },
      options = { upsert: true, new: true };
    logger.info(
      `product ::: ${util.inspect(product, {
        showHidden: false,
        depth: null,
        colors: false,
      })}`
    );

    const xxx = await findOneAndUpdateRepo(query, updateSet, options);

    return xxx;
  };

  static addProductToCart = async ({
    product = {},
    cart_userId = convertToObjectId(cart_userId),
  }) => {
    const foundCart = await findOneRepo({
      filter: {
        cart_userId,
        cart_state: "active",
      },
    });
    if (!foundCart) {
      const cart = await CartServices.createCart({
        cart_userId,
        product,
      });
      return cart;
    }

    if (!foundCart.cart_products.length) {
      foundCart.cart_products = [product];
      return foundCart.save(foundCart);
    }

    return await CartServices.updateQuantityProducts({
      cart_id: foundCart._id,
      cart_userId,
      product,
    });

    // return foundCart;
  };
}
module.exports = CartServices;
