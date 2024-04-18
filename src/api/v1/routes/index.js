const express = require("express");
const routes = express.Router();

// routes.use("/", (req, res, next) => {
//   const strCompression = "hello world";
//   res.status(200).json({
//     mess: `API is running`,
//     metadata: strCompression.repeat(10000),
//   });
// });
routes.use("/api/import", require("./v1/dataImportRoute"));

routes.use("/api/products", require("./v1/productRoutes"));
routes.use("/api/orders", require("./v1/orderRoutes"));
routes.use("/api/users", require("./v1/userRoutes"));
routes.use("/api/carts", require("./v1/cartRoutes"));
routes.use("/api/address", require("./v1/addressRoutes"));
routes.use("/api/categorys", require("./v1/categoryRoutes"));
routes.use("/api/discounts", require("./v1/discountRoutes"));
routes.use("/api/inventories", require("./v1/inventoryRoutes"));
routes.use("/api/reviews", require("./v1/reviewRoutes"));
routes.use("/api/comments", require("./v1/comment.routes"));
routes.use("/api/chats", require("./v1/chat.routes"));
routes.use("/api/uploads", require("./v1/upload.routes"));
routes.use("/api/thudung", require("./v1/thuDungGio.routes"));
routes.use("/api/codes", require("./v1/mainCodeRoutes"));
routes.use("/api", require("./v1/sendEmailRoutes"));

module.exports = routes;
