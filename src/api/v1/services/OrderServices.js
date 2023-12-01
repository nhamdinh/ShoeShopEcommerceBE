"use strict";
const util = require("util");
const logger = require("../log");

const { ForbiddenRequestError } = require("../core/errorResponse");
const {
  findCartsRepo,
  findByIdAndUpdateCartRepo,
} = require("../repositories/cart.repo");
const { convertToObjectId } = require("../utils/getInfo");
const { checkProductsRepo } = require("../repositories/product.repo");
const { getDiscountsAmount } = require("./DiscountServices");
const Order = require("../Models/OrderModel");
const { createOrderRepo } = require("../repositories/order.repo");
const { findAddressByUserRepo } = require("../repositories/address.repo");
/**
 * 1. Create New Order [User]
 * 2. Query Orders [User]
 * 3. Query Order [User]
 * 4. Update Order Status [Admin | User]
 **/

class OrderServices {
  static createOrder = async ({ req }) => {
    try {
      const {
        orderItems,
        shippingAddress,
        paymentMethod,
        taxPrice,
        cart,
        shippingPrice,
        totalPriceItems,
        totalPrice,
        user,
      } = req.body;

      if (orderItems && orderItems.length === 0) {
        throw new ForbiddenRequestError("Wrong product model", 400);
      } else {
        // const order = new Order({
        //   orderItems,
        //   user: {
        //     ...user,
        //     user: req.user._id,
        //   },
        //   userId: req.user._id,
        //   shippingAddress,
        //   paymentMethod,
        //   taxPrice,
        //   cart,
        //   shippingPrice,
        //   totalPriceItems,
        //   totalPrice,
        // });
        // const createOrder = await order.save();

        return await Order.create({
          orderItems,
          userId: req.user._id,
          shippingAddress,
          paymentMethod,
          taxPrice,
          cart,
          shippingPrice,
          totalPriceItems,
          totalPrice,
        });

        // const cart1 = await Cart.findById(cart);

        // if (cart1) {
        //   cart1.deletedAt = Date.now();
        //   const updatedCart = await cart1.save();
        // } else {
        //   res.status(200).json({ message: "Cart not Found" });
        //   throw new Error("Cart not found");
        // }

        return { createOrder };
      }
    } catch (error) {
      throw new Error(error);
    }
  };

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

  static checkoutReviewCart11 = async ({ cartId, userId, orderItems = [] }) => {
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
        userId,
        cartId,
        totalAmount: 0,
        feeShip: 9,
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
      checkCart.totalAmount - checkCart.totalDiscount - checkCart.feeShip < 1
        ? 1
        : checkCart.totalAmount - checkCart.totalDiscount - checkCart.feeShip;

    return {
      orderItems,
      orderItemsNew,
      checkCart,
    };
  };

  static checkoutReviewCart = async ({
    // cartId,
    // orderItems = [],
    userId,
    cartsReview,
  }) => {
    const cartReviewed = [];
    for (let i = 0; i < cartsReview.length; i++) {
      const cartReview = cartsReview[i];
      const { cartId, orderItems } = cartReview;
      const obj = await OrderServices.checkoutReviewCart11({
        cartId,
        userId,
        orderItems,
      });

      if (obj) cartReviewed.push(obj);
    }

    // logger.info(
    //   `cartReviewed ::: ${util.inspect(cartReviewed, {
    //     showHidden: false,
    //     depth: null,
    //     colors: false,
    //   })}`
    // );
    return cartReviewed;
  };

  static checkoutOrder = async ({
    // cartId,
    // orderItems = [],
    userId,
    cartsReview,
  }) => {
    const cartReviewed = [];
    for (let i = 0; i < cartsReview.length; i++) {
      const cartReview = cartsReview[i];
      const { cartId, orderItems } = cartReview;
      const obj = await OrderServices.checkoutReviewCart11({
        cartId,
        userId,
        orderItems,
      });

      if (obj) cartReviewed.push(obj);
    }

    const addressArr = await findAddressByUserRepo({
      userId: convertToObjectId(userId),
    });

    let createAddress = {};
    if (addressArr.length > 0) {
      createAddress = addressArr[0];
    } else {
      throw new ForbiddenRequestError("User have Address YET", 400);
    }

    const orders = await Promise.all(
      cartReviewed.map(async (cart) => {
        const order = await createOrderRepo({
          userId: convertToObjectId(cart?.checkCart?.userId),
          shippingAddress: createAddress?._id,
          cartId: convertToObjectId(cart?.checkCart?.cartId),
          shopId: convertToObjectId(cart?.orderItems[0]?.shopId),

          orderItems: cart?.orderItems,
          paymentMethod: "Paypal",
          taxPrice: 0,
          feeShip: cart?.checkCart?.feeShip,
          totalAmount: cart?.checkCart?.totalAmount,
          totalAmountPay: cart?.checkCart?.totalAmountPay,
          totalDiscount: cart?.checkCart?.totalDiscount,
        });

        await findByIdAndUpdateCartRepo({
          id: convertToObjectId(cart?.checkCart?.cartId),
        });

        if (order) return order;
      })
    );

    return orders;

    // const { orderItemsNew } = await OrderServices.checkoutReviewCart({
    //   cartId,
    //   userId,
    //   orderItems,
    // });
    /* check product again */
    // const products = orderItemsNew.flatMap((order) => order.itemProducts);

    // for (let i = 0; i < products.length; i++) {
    //   const { quantity, price, productId } = products[i];
    //   //   logger.info(
    //   //     `products ${[i]}::: ${util.inspect(products[i], {
    //   //       showHidden: false,
    //   //       depth: null,
    //   //       colors: false,
    //   //     })}`
    //   //   );
    // }
  };
}

module.exports = OrderServices;
