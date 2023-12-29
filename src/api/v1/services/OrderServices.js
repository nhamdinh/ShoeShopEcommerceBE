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
const {
  createOrderRepo,
  findOrdersRepo,
  getOrderByIdRepo,
} = require("../repositories/order.repo");
const { findAddressByUserRepo } = require("../repositories/address.repo");
const OrderModel = require("../Models/OrderModel");
const {
  findAllUsersOrdersRepo,
  findUserByIdRepo,
} = require("../repositories/user.repo");
/**
 * 1. Create New Order [User]
 * 2. Query Orders [User]
 * 3. Query Order [User]
 * 4. Update Order Status [Admin | User]
 **/

class OrderServices {
  static getAllOrderByAdmin = async ({ query }) => {
    const searchBy = query?.searchBy ?? "email";
    let shopId = query?.shopId ?? "";

    if (shopId === "") {
      shopId = {};
    } else {
      shopId = {
        shopId: convertToObjectId(shopId),
      };
    }

    const keyword = query?.keyword
      ? searchBy === "email"
        ? {
            email: {
              $regex: query?.keyword,
              $options: "i",
            },
          }
        : {
            phone: {
              $regex: query?.keyword,
              $options: "i",
            },
          }
      : {};

    const users = await findAllUsersOrdersRepo({ ...keyword });

    if (users.length === 0) return [];

    const userIds = [];
    users.map((us) => {
      userIds.push(convertToObjectId(us._id));
    });

    const orders = await findOrdersRepo({
      userId: { $in: [...userIds] },
      ...shopId,
    });

    // logger.info(
    //   `users ::: ${util.inspect(users, {
    //     showHidden: false,
    //     depth: null,
    //     colors: false,
    //   })}`
    // );

    if (orders.length === 0) return [];
    return orders;
  };

  static orderIsDelivered = async ({ id }) => {
    const order = await OrderModel.findById(convertToObjectId(id));

    if (!order) {
      throw new ForbiddenRequestError("Order not found", 404);
    }
    order.isDelivered = true;
    order.deliveredAt = Date.now();

    const updatedOrder = await order.save();
    return updatedOrder;
  };

  static orderIsPaid = async ({ id, body }) => {
    const order = await OrderModel.findById(convertToObjectId(id));

    if (!order) {
      throw new ForbiddenRequestError("Order not found", 404);
    }
    order.isPaid = true;
    order.paidAt = Date.now();
    order.paymentResult = {
      id: body.id,
      status: body.status,
      update_time: body.update_time,
      email_address: body.email_address,
    };

    const updatedOrder = await order.save();

    // logger.info(
    //   `order ::: ${util.inspect(order, {
    //     showHidden: false,
    //     depth: null,
    //     colors: false,
    //   })}`
    // );

    /* ADD  product TO user.buyer */
    const user = await findUserByIdRepo(order?.userId);
    const buyerArr = user?.buyer;
    let orderItems = [];
    order?.orderItems[0]?.itemProducts?.map((or) => {
      orderItems.push(or?.product_id);
    });

    const arr = Array.from(new Set([...buyerArr, ...orderItems]));
    user.buyer = [...arr];
    await user.save();
    // /* ADD  product TO user.buyer */

    // let productList = [];

    // /* UPDATE countInStock product */
    // order?.orderItems?.map((or) => {
    //   productList.push({
    //     id: or?.product,
    //     qty: or?.qty,
    //   });
    // });

    // for (let i = 0; i < productList.length; i++) {
    //   const product = await Product.findById(productList[i]?.id);
    //   if (product) {
    //     product.countInStock =
    //       Number(product?.countInStock) - Number(productList[i]?.qty);
    //     await product.save();
    //   }
    // }
    /* UPDATE countInStock product */

    return updatedOrder;
  };

  static getOrderById = async ({ id }) => {
    const order = await getOrderByIdRepo(convertToObjectId(id));
    if (order) {
      return order;
    }
    throw new ForbiddenRequestError("order not found", 404);
  };

  static getAllOrderByUser = async ({ userId }) => {
    const orders = await OrderModel.find({ userId }).sort({
      _id: -1,
    });

    if (orders.length === 0) {
      throw new ForbiddenRequestError("orders not found", 404);
    }

    return orders;
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

  static checkoutCartUtil = async ({ cartId, userId, orderItems = [] }) => {
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
      const obj = await OrderServices.checkoutCartUtil({
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
      const obj = await OrderServices.checkoutCartUtil({
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
