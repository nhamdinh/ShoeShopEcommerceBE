const express = require("express");
const routes = express.Router();

routes.use("/api/import", require("./v1/dataImportRoute"));

routes.use("/api/products", require("./v1/productRoutes"));
routes.use("/api/orders", require("./v1/orderRoutes"));
routes.use("/api/users", require("./v1/userRoutes"));
routes.use("/api/carts", require("./v1/cartRoutes"));
routes.use("/api/address", require("./v1/addressRoutes"));
routes.use("/api/categorys", require("./v1/categoryRoutes"));
routes.use("/api", require("./v1/sendEmailRoutes"));

module.exports = routes;
