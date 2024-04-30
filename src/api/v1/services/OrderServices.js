"use strict";
const util = require("util");
const logger = require("../log");
const { ForbiddenRequestError } = require("../core/errorResponse");
const {
  findCartsRepo,
  findByIdAndUpdateCartRepo,
} = require("../repositories/cart.repo");
const { convertToObjectId } = require("../utils/getInfo");
const {
  checkPriceProductsRepo,
  findProductById1Repo,
} = require("../repositories/product.repo");
const { getDiscountsAmount } = require("./DiscountServices");
const {
  createOrderRepo,
  findOrdersRepo,
  getOrderByIdRepo,
  findOrdersByShopRepo,
} = require("../repositories/order.repo");
const { findAddressByUserRepo } = require("../repositories/address.repo");
const OrderModel = require("../Models/OrderModel");
const {
  findAllUsersOrdersRepo,
  findUserByIdRepo,
} = require("../repositories/user.repo");
const { checkNumber } = require("../utils/functionHelpers");
const { acquireLock, releaseLock } = require("./redis.service");
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
    return orders;
  };

  static findAllOrdersByShop = async ({ user, body }) => {
    const {
      shopId = convertToObjectId(shopId),
      limit = 50,
      page = 1,
      sort = { _id: -1 },
      select = [],
      isPaid,
      isDelivered,
      keyword,
      createdAt,
    } = body;

    // if (user._id?.toString() !== shopId?.toString())
    //   throw new ForbiddenRequestError("You are not Owner!!");

    const filter = {
      shopId,
    };
    if (typeof isPaid === "boolean") filter.isPaid = isPaid;
    if (typeof isDelivered === "boolean") filter.isDelivered = isDelivered;

    if (keyword) {
      const regexSearch = new RegExp(
        toNonAccentVietnamese(keyword).replaceAll(" ", "-"),
        "i"
      );
      filter.product_slug = { $regex: regexSearch };
    }

    if (createdAt)
      filter.createdAt = {
        $gte: new Date(createdAt.gte),
        $lt: new Date(createdAt.lt),
        // $gte: new Date("2023-02-20T00:00:00+07:00"),
        // $lt: new Date("2024-04-20T00:00:00+07:00"),
      };

    // logger.info(
    //   `filter ::: ${util.inspect(filter, {
    //     showHidden: false,
    //     depth: null,
    //     colors: false,
    //   })}`
    // );

    const metadata = await findOrdersByShopRepo({
      sort,
      limit,
      page,
      filter,
      select,
    });

    const orders = metadata.orders.map((od) => {
      const itemProducts = od?.orderItems[0]?.itemProducts ?? od?.orderItems;
      return { ...od, itemProducts };
    });

    return {
      ...metadata,
      orders: await Promise.all(
        orders.map(async (od) => {
          const { itemProducts } = od;
          const _itemProducts = await Promise.all(
            itemProducts.map(async (prd) => {
              return {
                ...(await findProductById1Repo({
                  product_id: convertToObjectId(prd.product_id),
                })),
                order_id: od._id,
              };
            })
          );
          return { ...od, itemProducts: _itemProducts };
        })
      ),
    };
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
    const productIds = [];

    const itemProducts =
      order?.orderItems[0]?.itemProducts ?? order?.orderItems;

    itemProducts.map((or) => {
      productIds.push(or?.product_id);
    });

    const arr = Array.from(new Set([...buyerArr, ...productIds]));
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
          shopDiscounts: [
            {
              discount_shopId: "6566d9bb48178823d8d43919",
              discount_code: "TANG40",
            },
          ],
        },
      ],
    }
 **/

  static checkoutCartUtil = async ({
    cartId,
    userId,
    shopDiscounts,
    shopId,
  }) => {
    const foundCarts = await findCartsRepo({
      filter: {
        _id: convertToObjectId(cartId),
        cart_userId: convertToObjectId(userId),
        cart_shopId: convertToObjectId(shopId),
        cart_state: "active",
      },
    });
    if (!foundCarts.length) {
      throw new ForbiddenRequestError("Cart not found", 404);
    }

    const objCart = foundCarts[0];

    const result = {
      checkCart: {
        userId,
        cartId,
        shopId,
        shopDiscounts,
        totalAmount: 0,
        feeShip: 9,
        totalDiscount: 0,
        totalAmountPay: 0,
      },
      orderItemsNew: {},
    };
    const { checkCart } = result;
    const { cart_products = [] } = objCart;
    const checkedProducts = await checkPriceProductsRepo(cart_products);

    if (checkedProducts.includes(undefined))
      throw new ForbiddenRequestError("Order Wrong!");

    checkCart.totalAmount = checkedProducts.reduce((access, product) => {
      return +access + +product.price * +product.quantity;
    }, 0);

    const uniqueCodes = [
      ...new Set(shopDiscounts.map((sss) => sss.discount_code)),
    ];
    if (uniqueCodes.length !== shopDiscounts.length)
      throw new ForbiddenRequestError("The same CODES cannot be applied");

    if (shopDiscounts.length) {
      const calculateDiscounts = await Promise.all(
        shopDiscounts.map(async (coupon) => {
          const objDiscount = await getDiscountsAmount({
            discount_code: coupon.discount_code,
            discount_shopId: shopId,
            discount_used_userId: convertToObjectId(userId),
            products_order: checkedProducts,
          });

          if (objDiscount) {
            return objDiscount;
          }
        })
      );

      if (calculateDiscounts.includes(undefined))
        throw new ForbiddenRequestError("Order Wrong!");

      checkCart.totalDiscount = +calculateDiscounts
        .reduce((acc, item) => +acc + +item.totalDiscountedForCoupon, [0])
        .toFixed(2);
      const { totalAmount, totalDiscount } = checkCart;
      result.orderItemsNew = {
        shopId,
        itemProductsForCoupons: calculateDiscounts,
        priceRaw: totalAmount,
        discounted: totalDiscount,
        priceAppliedDiscount: checkNumber(totalAmount - totalDiscount),
      };
    }
    const { totalAmount, totalDiscount, feeShip } = checkCart;

    checkCart.totalAmountPay = checkNumber(
      totalAmount - totalDiscount - feeShip
    );
    result.checkedProducts = checkedProducts;
    return result;
  };

  static checkoutReviewCart = async ({
    // cartId,
    // orderItems = [],
    userId,
    cartsReview,
  }) => {
    const cartsReviewed = await Promise.all(
      cartsReview.map(async (cartReview) => {
        const { cartId, shopDiscounts, shopId } = cartReview;

        const obj = await OrderServices.checkoutCartUtil({
          cartId,
          userId,
          shopDiscounts,
          shopId,
        });

        if (obj) return obj;
      })
    );

    return cartsReviewed;
  };

  static checkoutOrder = async ({
    // cartId,
    // orderItems = [],
    userId,
    cartsReview,
  }) => {
    const addressArr = await findAddressByUserRepo({
      userId: convertToObjectId(userId),
    });

    if (!addressArr.length)
      throw new ForbiddenRequestError("User have Address YET", 400);

    const createAddress = addressArr[0];

    /* check product again */
    const cartsReviewed = await OrderServices.checkoutReviewCart({
      userId,
      cartsReview,
    });

    /* END check product again */
    // const checkedProducts = orderItemsNew.flatMap((order) => order.itemProducts);
    const acquireProducts = [];
    const ordersNew = await Promise.all(
      cartsReviewed.map(async (cart) => {
        const cartReviewed = { ...cart };
        const { checkedProducts, checkCart } = cartReviewed;

        const acquireProductsItem = [];
        for (let i = 0; i < checkedProducts.length; i++) {
          const { quantity, price, product_id, sku_id } = checkedProducts[i];

          const keyLock = await acquireLock(
            product_id,
            quantity,
            checkCart.cartId,
            sku_id,
            userId,
            cartReviewed?.checkCart?.shopId
          );
          acquireProducts.push(keyLock ? true : false);
          acquireProductsItem.push(keyLock ? true : false);
          // if (keyLock) await releaseLock(keyLock);/* done update Inventory */
        }

        if (!acquireProductsItem.includes(false)) {
          /* create order */

          const orderObj = {
            userId: convertToObjectId(cartReviewed?.checkCart?.userId),
            shippingAddress: convertToObjectId(createAddress?._id),
            cartId: convertToObjectId(cartReviewed?.checkCart?.cartId),
            shopId: convertToObjectId(cartReviewed?.checkCart?.shopId),

            orderItems: cartReviewed?.checkedProducts,
            shopDiscounts: cartReviewed?.checkCart?.shopDiscounts,
            paymentMethod: "Paypal",
            taxPrice: 0,
            feeShip: cartReviewed?.checkCart?.feeShip,
            totalAmount: cartReviewed?.checkCart?.totalAmount,
            totalAmountPay: cartReviewed?.checkCart?.totalAmountPay,
            totalDiscount: cartReviewed?.checkCart?.totalDiscount,
          };

          const orderNew = await createOrderRepo(orderObj);
          /* END create order */
          /* update cart */

          if (orderNew) {
            const updateSet = {
              completedAt: Date.now(),
              cart_state: "completed",
            };
            await findByIdAndUpdateCartRepo({
              id: convertToObjectId(cartReviewed?.checkCart?.cartId),
              updateSet,
            });
          }
          return orderNew;

          /* END update cart */
        }
      })
    );
    if (acquireProducts.includes(false)) {
      throw new ForbiddenRequestError(
        "Have been update product, please turn back cart",
        403
      );
    }
    return ordersNew;

    // const addressArr = await findAddressByUserRepo({
    //   userId: convertToObjectId(userId),
    // });

    // let createAddress = {};
    // if (addressArr.length > 0) {
    //   createAddress = addressArr[0];
    // } else {
    //   throw new ForbiddenRequestError("User have Address YET", 400);
    // }

    // const orders = await Promise.all(
    //   cartsReviewed.map(async (cart) => {
    //     const orderNew = await createOrderRepo({
    //       userId: convertToObjectId(cart?.checkCart?.userId),
    //       shippingAddress: createAddress?._id,
    //       cartId: convertToObjectId(cart?.checkCart?.cartId),
    //       shopId: convertToObjectId(cart?.orderItems[0]?.shopId),

    //       orderItems: cart?.orderItems,
    //       paymentMethod: "Paypal",
    //       taxPrice: 0,
    //       feeShip: cart?.checkCart?.feeShip,
    //       totalAmount: cart?.checkCart?.totalAmount,
    //       totalAmountPay: cart?.checkCart?.totalAmountPay,
    //       totalDiscount: cart?.checkCart?.totalDiscount,
    //     });

    //     if (orderNew) {
    //       const updateSet = {
    //         completedAt: Date.now(),
    //         cart_state: "completed",
    //       };
    //       await findByIdAndUpdateCartRepo({
    //         id: convertToObjectId(cart?.checkCart?.cartId),
    //         updateSet,
    //       });

    //       return orderNew;
    //     }
    //   })
    // );

    // return orders;

    return cartsReviewed;
  };
}

module.exports = OrderServices;
