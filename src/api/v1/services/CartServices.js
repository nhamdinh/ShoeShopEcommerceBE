"use strict";
const util = require("util");
const logger = require("../log");

const { ForbiddenRequestError } = require("../core/errorResponse");
const { createCartRepo, findOneRepo } = require("../repositories/cart.repo");
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
  static createCart = async (cart_userId) => {
    return await createCartRepo({
      cart_userId,
    });
  };

  static addProductToCart = async ({
    cart_products,
    cart_userId = convertToObjectId(cart_userId),
  }) => {
    const foundCart = await findOneRepo({
      filter: {
        cart_userId,
        cart_state: "active",
      },
    });
    if (!foundCart) {
      const cart = await CartServices.createCart(cart_userId);
      return cart;
    }
    return foundCart;
  };
}
module.exports = CartServices;
