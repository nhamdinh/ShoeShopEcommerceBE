const express = require("express");
const routes = express.Router();

routes.use("/api/import", require("./v1/dataImportRoute"));

routes.use("/api/products", require("./v1/productRoutes"));
routes.use("/api/orders", require("./v1/orderRoutes"));
routes.use("/api/users", require("./v1/userRoutes"));

module.exports = routes;
