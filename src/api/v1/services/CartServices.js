"use strict";
const util = require("util");
const logger = require("../log");

const { ForbiddenRequestError } = require("../core/errorResponse");
const {
  findOneAndUpdateRepo,
  findOneRepo,
  updateCartRepo,
  getAllCartRepo,
  createCartRepo,
  findCartsRepo,
} = require("../repositories/cart.repo");

const { findProductById1Repo } = require("../repositories/product.repo");
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
  static getAllCart = async () => {
    return await getAllCartRepo({ filter: { cart_state: "active" } });
  };

  static createCart = async ({ cart_userId, product }) => {
    return await createCartRepo({ cart_userId });
    // const query = {
    //     cart_userId,
    //   },
    //   updateOrInsert = {
    //     $addToSet: {
    //       cart_products: product, // push them
    //     },
    //   },
    //   options = { upsert: true, new: true };
    // return await findOneAndUpdateRepo(query, updateOrInsert, options);
  };

  static updateQuantityProducts = async ({ cart_id, cart_userId, product }) => {
    const { product_id, quantity } = product;
    const query = {
        _id: cart_id,
        cart_userId,
        "cart_products.product_id": product_id,
      },
      updateSet = {
        $inc: {
          "cart_products.$.quantity": quantity,
        },
      },
      options = { upsert: true, new: true };

    return await findOneAndUpdateRepo(query, updateSet, options);
  };

  static addProductToCart = async ({
    product = {},
    cart_userId = convertToObjectId(cart_userId),
  }) => {
    const { product_id, quantity } = product;
    const foundProduct = await findProductById1Repo({
      product_id,
    });

    if (!foundProduct || quantity < 0) {
      throw new ForbiddenRequestError("Product not found", 404);
    }

    const cartCurrent = await CartServices.getCurrentCart({
      cart_userId,
    });
    /* add new item */
    if (cartCurrent.cart_products.length === 0) {
      cartCurrent.cart_products = [
        {
          product_id,
          quantity,
          price: +foundProduct.product_price,
        },
      ];
      return await cartCurrent.save();
    }
    /* add new item */

    const productArr = cartCurrent.cart_products.filter(
      (product) => product.product_id === product_id
    );
    /* add new item */
    if (productArr.length === 0) {
      cartCurrent.cart_products = [
        ...cartCurrent.cart_products,
        {
          product_id,
          quantity,
          price: +foundProduct.product_price,
        },
      ];
      return await cartCurrent.save();
    }
    /* add new item */

    /* update quantity item */
    if (quantity === 0) {
      //delete
      const productArrDeleted = cartCurrent.cart_products.filter(
        (product) => product.product_id !== product_id
      );
      cartCurrent.cart_products = productArrDeleted;
      return await cartCurrent.save();
    }

    cartCurrent.cart_products.map((product) => {
      if (product.product_id === product_id) {
        product.quantity = quantity;
        product.price = +foundProduct.product_price;
      }
    });
    /* update quantity item */

    return await cartCurrent.save();
  };

  static getCurrentCart = async ({
    cart_userId = convertToObjectId(cart_userId),
  }) => {
    const foundCarts = await findCartsRepo({
      filter: {
        cart_userId,
        cart_state: "active",
      },
    });
    if (foundCarts.length === 0) {
      return await CartServices.createCart({
        cart_userId,
      });
    }

    return foundCarts[0];

    // const foundCart = await findOneRepo({
    //   filter: {
    //     cart_userId,
    //     cart_state: "active",
    //   },
    // });
    // if (!foundCart) {
    //   return await CartServices.createCart({
    //     cart_userId,
    //   });
    // }
  };

  static deleteCart = async ({
    cart_userId = convertToObjectId(cart_userId),
    cart_id = convertToObjectId(cart_id),
  }) => {
    const foundCart = await findOneRepo({
      filter: {
        _id: cart_id,
        cart_userId,
        cart_state: "active",
      },
    });
    if (!foundCart) {
      throw new ForbiddenRequestError("Cart not found", 404);
    }

    foundCart.cart_state = "failed";

    const { modifiedCount } = await foundCart.update(foundCart);

    return modifiedCount;
  };
}
module.exports = CartServices;
