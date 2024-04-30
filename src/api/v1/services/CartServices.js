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
  findByIdAndUpdateCartRepo,
} = require("../repositories/cart.repo");

const {
  findProductById1Repo,
  findOneProductRepo,
} = require("../repositories/product.repo");
const { convertToObjectId } = require("../utils/getInfo");
const { findSkuByIdRepo } = require("../repositories/sku.repo");

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
    const filter = { cart_state: "active" };
    return await getAllCartRepo({ filter });
  };

  static createCart = async ({ cart_userId, cart_shopId, product }) => {
    return await createCartRepo({ cart_userId, cart_shopId });
    // const query = {
    //     cart_userId,
    //   },
    //   updateOrInsert = {
    //     $addToSet: {
    //       cart_products: product, // push them
    //     },
    //   },
    //   options = { upsert: false, new: true };
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
      options = { upsert: false, new: true };

    return await findOneAndUpdateRepo(query, updateSet, options);
  };

  static addProductToCart = async ({
    product = {},
    cart_userId = convertToObjectId(cart_userId),
  }) => {
    const { cart_shopId, product_id, quantity, name, image, sku_id } = product;
    const foundProduct = await findOneProductRepo({
      filter: {
        product_shop: convertToObjectId(cart_shopId),
        _id: convertToObjectId(product_id),
      },
    });

    if (!foundProduct || quantity < 0)
      throw new ForbiddenRequestError("Product not found", 404);

    const cartsCurrent = await CartServices.getCurrentCart({
      cart_userId,
      cart_shopId,
    });

    const sku = await findSkuByIdRepo({
      id: convertToObjectId(sku_id),
    });

    if (!sku) throw new ForbiddenRequestError("Sku not found", 404);

    const product_price = +sku.sku_price ?? +foundProduct.product_price;

    for (let i = 0; i < cartsCurrent.length; i++) {
      const cartCurrent = cartsCurrent[i];

      if (cartCurrent?.cart_shopId._id.toString() !== cart_shopId)
        throw new ForbiddenRequestError("Cart not found", 404);

      /* add new item */
      const newSkuOnCart = {
        sku_id,
        product_id,
        sku_values: sku.sku_values,
        image: foundProduct.product_thumb,
        name: foundProduct.product_name,
        quantity,
        price: +product_price,
      };
      const { cart_products, cart_products_deleted } = cartCurrent;

      if (cart_products.length === 0 && quantity > 0) {
        cartCurrent.cart_products = [newSkuOnCart];

        return await findByIdAndUpdateCartRepo({
          id: convertToObjectId(cartCurrent?._id),
          updateSet: cartCurrent,
        });
      }
      /* add new item */

      const skuObj = cart_products.find((product) => product.sku_id === sku_id);
      /* add new item */
      if (!skuObj && quantity > 0) {
        cartCurrent.cart_products = [...cart_products, newSkuOnCart];
        return await findByIdAndUpdateCartRepo({
          id: convertToObjectId(cartCurrent?._id),
          updateSet: cartCurrent,
        });
      }
      /* add new item */

      /* update quantity item */
      if (quantity === 0) {
        //delete ; tracking

        const skuDeletedObj = cart_products_deleted.find(
          (_sku_id) => _sku_id === sku_id
        );
        if (!skuDeletedObj) {
          cartCurrent.cart_products_deleted = [
            ...cart_products_deleted,
            sku_id,
          ];
        }
        cartCurrent.cart_products = cart_products.filter(
          (product) => product.sku_id !== sku_id
        );

        return await findByIdAndUpdateCartRepo({
          id: convertToObjectId(cartCurrent?._id),
          updateSet: cartCurrent,
        });
      }

      cart_products.map((product) => {
        if (product.sku_id === sku_id) {
          product.quantity = quantity;
          product.price = +product_price;
        }
      });

      /* update quantity item */

      return await findByIdAndUpdateCartRepo({
        id: convertToObjectId(cartCurrent?._id),
        updateSet: cartCurrent,
      });
    }
  };

  static getCurrentCart = async ({
    cart_userId = convertToObjectId(cart_userId),
    cart_shopId = convertToObjectId(cart_shopId),
  }) => {
    /* 1 shop chỉ 1 cart; 1 user có nhiều cart */
    const foundCarts = await findCartsRepo({
      filter: {
        cart_userId,
        cart_shopId,
        cart_state: "active",
      },
    });

    const foundCart = foundCarts.find(
      (cart) =>
        cart.cart_userId._id.toString() === cart_userId.toString() &&
        cart.cart_shopId._id.toString() === cart_shopId.toString()
    );

    if (!foundCart && cart_shopId.toString()) {
      const newCart = await CartServices.createCart({
        cart_userId,
        cart_shopId,
      });

      return [newCart];
    }
    /* return 1 arr ( vì có thể lỗi nên tồn tại > 1 cart) => update toàn bộ arr cart */
    return foundCarts;
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

  static getCartsByUser = async ({
    cart_userId = convertToObjectId(cart_userId),
  }) => {
    /* 1 shop chỉ 1 cart; 1 user có nhiều cart */
    const foundCarts = await findCartsRepo({
      filter: {
        cart_userId,
        cart_state: "active",
      },
    });

    return foundCarts;

    /* return 1 arr ( vì có thể lỗi nên tồn tại > 1 cart) => update toàn bộ arr cart */
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
    const foundCarts = await findCartsRepo({
      filter: {
        _id: convertToObjectId(cart_id),
        cart_userId: convertToObjectId(cart_userId),
        cart_state: "active",
      },
    });
    if (foundCarts.length === 0) {
      throw new ForbiddenRequestError("Cart delete not found", 404);
    }
    const foundCart = foundCarts[0];
    foundCart.cart_state = "failed";

    // const { modifiedCount } = await foundCart.update(foundCart);

    // return modifiedCount;

    return await findByIdAndUpdateCartRepo({
      id: convertToObjectId(foundCart?._id),
      updateSet: foundCart,
    });
  };
}
module.exports = CartServices;
