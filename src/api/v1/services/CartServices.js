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
    const { cart_shopId, product_id, quantity, name, image } = product;
    const foundProduct = await findOneProductRepo({
      filter: {
        product_shop: convertToObjectId(cart_shopId),
        _id: convertToObjectId(product_id),
      },
    });

    if (!foundProduct || quantity < 0) {
      throw new ForbiddenRequestError("Product not found", 404);
    }

    const cartsCurrent = await CartServices.getCurrentCart({
      cart_userId,
      cart_shopId,
    });

    for (let i = 0; i < cartsCurrent.length; i++) {
      const cartCurrent = cartsCurrent[i];

      if (cartCurrent?.cart_shopId._id.toString() === cart_shopId)
        throw new ForbiddenRequestError("Cart not found", 404);

      /* add new item */
      const newProductOnCart = {
        product_id,
        image,
        name,
        quantity,
        price: +foundProduct.product_price,
      };
      const { cart_products, cart_products_deleted } = cartCurrent;

      if (cart_products.length === 0 && quantity > 0) {
        cartCurrent.cart_products = [newProductOnCart];

        return await findByIdAndUpdateCartRepo({
          id: convertToObjectId(cartCurrent?._id),
          updateSet: cartCurrent,
        });
      }
      /* add new item */

      const productObj = cart_products.find(
        (product) => product.product_id === product_id
      );
      /* add new item */
      if (!productObj && quantity > 0) {
        cartCurrent.cart_products = [...cart_products, newProductOnCart];
        return await findByIdAndUpdateCartRepo({
          id: convertToObjectId(cartCurrent?._id),
          updateSet: cartCurrent,
        });
      }
      /* add new item */

      /* update quantity item */
      if (quantity === 0) {
        //delete ; tracking

        const productDeletedObj = cart_products_deleted.find(
          (productId) => productId === product_id
        );
        if (!productDeletedObj) {
          cartCurrent.cart_products_deleted = [
            ...cart_products_deleted,
            product_id,
          ];
        }
        cartCurrent.cart_products = cart_products.filter(
          (product) => product.product_id !== product_id
        );

        return await findByIdAndUpdateCartRepo({
          id: convertToObjectId(cartCurrent?._id),
          updateSet: cartCurrent,
        });
      }

      cart_products.map((product) => {
        if (product.product_id === product_id) {
          product.quantity = quantity;
          product.price = +foundProduct.product_price;
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
    cart_shopId,
  }) => {
    const foundCarts = await findCartsRepo({
      filter: {
        cart_userId,
        cart_state: "active",
      },
    });

    const foundCart = foundCarts.find(
      (cart) => cart.cart_userId._id.toString() === cart_userId.toString()
    );

    if (!foundCart && cart_shopId) {
      const newCart = await CartServices.createCart({
        cart_userId,
        cart_shopId: convertToObjectId(cart_shopId),
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

    const { modifiedCount } = await foundCart.update(foundCart);

    return modifiedCount;
  };
}
module.exports = CartServices;
