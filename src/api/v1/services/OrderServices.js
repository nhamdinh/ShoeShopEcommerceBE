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
    {
      cartId: "65675236908dc0d252909123",
      orderItems: [
        {
          shopId: "655ddd78b15c27c5c9a5e021",
          itemProducts: [
            {
              product_id: "65644a8de4b05d0287f50570",
              image:
                "http://localhost:5000/products-img/1701073459629sg-11134201-22110-q7p5kylmwrjv91.jpg",
              name: "sai 2111111111",
              quantity: 10,
              price: 22,
            },
          ],
          shopDiscount: [
            {
              discount_shopId: "6566d9bb48178823d8d43919",
              discount_code: "TANG40",
            },
          ],
        },
      ],
    }
 **/

  static checkoutReviewCart = async ({ cartId, userId, orderItems = [] }) => {
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
      /* orderItems length = 1 always */
      const { shopId, shopDiscount = [], itemProducts = [] } = orderItems[i];
      const checkProducts = await checkProductsRepo(itemProducts);

      checkProducts.map((checkProduct) => {
        if (!checkProduct) {
          throw new ForbiddenRequestError("Order Wrong!");
        }
      });

      const totalAmountProducts = checkProducts.reduce((access, product) => {
        return +access + +product.price * +product.quantity;
      }, 0);
      checkCart.totalAmount = totalAmountProducts;

      if (shopDiscount.length > 0) {
        const calculateDiscounts = await Promise.all(
          shopDiscount.map(async (coupon) => {
            const objDiscount = await getDiscountsAmount({
              discount_code: coupon.discount_code,
              discount_shopId: shopId,
              discount_used_userId: convertToObjectId(userId),
              products_order: checkProducts,
            });

            if (objDiscount) {
              return objDiscount;
            }
          })
        );

        calculateDiscounts.map((checkDiscount, index) => {
          if (!checkDiscount) {
            throw new ForbiddenRequestError("Order Wrong!");
          }
          const { discountAmount } = checkDiscount;

          checkCart.totalDiscount += discountAmount;

          // logger.info(
          //   `discountAmount ${index}::: ${util.inspect(discountAmount, {
          //     showHidden: false,
          //     depth: null,
          //     colors: false,
          //   })}`
          // );
        });

        const orderItemNew = {
          shopId,
          shopDiscount,
          itemProducts: checkProducts,
          priceRaw: checkCart.totalAmount,
          discounted: checkCart.totalDiscount,
          priceAppliedDiscount:
            checkCart.totalAmount - checkCart.totalDiscount < 1
              ? 1
              : checkCart.totalAmount - checkCart.totalDiscount,
        };

        orderItemsNew.push(orderItemNew);
      }
    }
    checkCart.totalAmountPay =
      checkCart.totalAmount - checkCart.totalDiscount < 1
        ? 1
        : checkCart.totalAmount - checkCart.totalDiscount;

    return {
      orderItems,
      orderItemsNew,
      checkCart,
    };
  };

  static checkoutOrder = async ({
    cartId,
    userId,
    orderItems = [],
    userAddress = {},
    userPayment = {},
  }) => {
    const { orderItemsNew } = await OrderServices.checkoutReviewCart({
      cartId,
      userId,
      orderItems,
    });

    const products = orderItemsNew.flatMap((order) => order.itemProducts);

    for (let i = 0; i < products.length; i++) {
      const { quantity, price, productId } = products[i];
      //   logger.info(
      //     `products ${[i]}::: ${util.inspect(products[i], {
      //       showHidden: false,
      //       depth: null,
      //       colors: false,
      //     })}`
      //   );
    }
  };
}

module.exports = OrderServices;
