const util = require("util");
const logger = require("../log");
const { ForbiddenRequestError } = require("../core/errorResponse");
const { CREATED, OK } = require("../core/successResponse");
const CartServices = require("../services/CartServices");

class CartController {
  addProductToCart = async (req, res, next) => {
    new OK({
      message: "addProductToCart OK",
      metadata: await CartServices.addProductToCart({
        product: req.body.product,
        cart_userId: req.user._id,
      }),
    }).send(res);
  };

  getCartsByUser = async (req, res, next) => {
    new OK({
      message: "getCartsByUser OK",
      metadata: await CartServices.getCartsByUser({
        cart_userId: req.user._id,
      }),
    }).send(res);
  };

  getAllCart = async (req, res, next) => {
    new OK({
      message: "getAllCart OK",
      metadata: await CartServices.getAllCart(),
    }).send(res);
  };

  deleteCart = async (req, res, next) => {
    new OK({
      message: "deleteCart OK",
      metadata: await CartServices.deleteCart({
        cart_id: req.body.cart_id,
        cart_userId: req.user._id,
      }),
    }).send(res);
  };
}

module.exports = new CartController();

// const getCartById = asyncHandler(async (req, res) => {
//   try {
//     const cart = await Cart.findById(req.params.id);
//     if (cart) {
//       res.json(cart);
//     } else {
//       res.status(200).json({ message: "Cart not Found" });
//       throw new Error("Cart not Found");
//     }
//   } catch (error) {
//     throw new Error(error);
//   }
// });

// const createCart = asyncHandler(async (req, res) => {
//   try {
//     const { cartItems } = req.body;

//     const cartArr = await Cart.find({ user: req.user._id, deletedAt: null });

//     let createCart;
//     if (cartArr.length > 0) {
//       let hasItem = false;
//       cartArr[0].cartItems?.map((caDb) => {
//         if (caDb?.product === cartItems[0]?.product) {
//           caDb.qty = cartItems[0]?.qty;
//           hasItem = true;
//         }
//       });
//       if (!hasItem)
//         cartArr[0].cartItems = [...cartItems, ...cartArr[0].cartItems];

//       createCart = await cartArr[0].save();
//     } else {
//       const cart = new Cart({ user: req.user._id, cartItems });
//       createCart = await cart.save();
//     }
//     res.status(201).json(createCart);
//   } catch (error) {
//     throw new Error(error);
//   }
// });

// const deleteItemFromCart = asyncHandler(async (req, res) => {
//   try {
//     const { product } = req.body;
//     const cart = await Cart.findById(req.params.id);
//     if (cart) {
//       let cartItems = cart?.cartItems;
//       let cartItems_temp = [];
//       cartItems?.map((it) => {
//         if (it?.product.toString() !== product?.toString()) {
//           cartItems_temp.push(it);
//         }
//       });
//       cart.cartItems = cartItems_temp;
//       const updateCart = await cart.save();

//       res.json(updateCart);
//     } else {
//       res.status(200).json({ message: "Cart not Found" });
//       throw new Error("Cart not Found");
//     }
//   } catch (error) {
//     throw new Error(error);
//   }
// });

// const checkCart = asyncHandler(async (req, res) => {
//   try {
//     const cartArr = await Cart.find({ user: req.user._id, deletedAt: null });
//     let createCart = { cartItems: [] };
//     if (cartArr.length > 0) {
//       createCart = cartArr[0];
//     }
//     res.status(201).json(createCart);
//   } catch (error) {
//     throw new Error(error);
//   }
// });

// module.exports = {
//   getAllCart,
//   checkCart,
//   createCart,
//   getCartById,
//   deleteItemFromCart,
// };
