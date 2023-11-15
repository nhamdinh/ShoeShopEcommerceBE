"use strict";
const util = require("util");
const logger = require("../log");

const { ForbiddenRequestError } = require("../core/errorResponse");
const { findCartsRepo } = require("../repositories/cart.repo");
const { convertToObjectId } = require("../utils/getInfo");
const { checkProductsRepo } = require("../repositories/product.repo");
const { getDiscountsAmount } = require("./DiscountServices");
/**
 * 1. Create New Order [User]
 * 2. Query Orders [User]
 * 3. Query Order [User]
 * 4. Update Order Status [Admin | User]
 **/

class OrderServices {
  /**
    orderItems: [
    {
        shopId,
        shopDiscount: [
        {
            shopId,
            code,
            discountId,
        },
        ],
        itemProducts: [
        {
            productId,
            quantity,
            price,
        },
        ],
    },
    ];
 **/

  static checkoutReviewCart = async ({ cartId, userId, orderItems = [] }) => {
    // logger.info(
    //   `checkProducts ${i}::: ${util.inspect(checkProducts, {
    //     showHidden: false,
    //     depth: null,
    //     colors: false,
    //   })}`
    // );
    const foundCarts = await findCartsRepo({
      filter: {
        _id: convertToObjectId(cartId),
        cart_userId: convertToObjectId(userId),
        cart_state: "active",
      },
    });
    if (foundCarts.length === 0) {
      throw new ForbiddenRequestError("Cart not found", 404);
    }

    const checkCart = {
        totalAmount: 0,
        feeShip: 0,
        totalDiscount: 0,
        totalAmountPay: 0,
      },
      orderItemsNew = [];

    for (let i = 0; i < orderItems.length; i++) {
      const { shopId, shopDiscount = [], itemProducts = [] } = orderItems[i];
      const checkProducts = await checkProductsRepo(itemProducts);
      checkProducts.map((checkProduct) => {
        if (!checkProduct) {
          throw new ForbiddenRequestError("Order Wrong!");
        }
      });

      const checkProductsPrice = checkProducts.reduce((access, product) => {
        return access + +product.price * +product.quantity;
      }, 0);
      checkCart.totalAmount += checkProductsPrice;

      if (shopDiscount.length > 0) {
        const xxx = await getDiscountsAmount({
          discount_code: shopDiscount[0].discount_code,
          discount_shopId: shopId,
          discount_used_userId: convertToObjectId(userId),
          products_order: checkProducts,
        });

        logger.info(
          `xxx ${i}::: ${util.inspect(xxx, {
            showHidden: false,
            depth: null,
            colors: false,
          })}`
        );
      }
    }

    const foundCart = foundCarts[0];
    return checkCart;
  };
}

module.exports = OrderServices;
