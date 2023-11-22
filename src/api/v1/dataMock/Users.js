const bcrypt = require("bcrypt");

const users = [
  {
    name: "Admin",
    productShopName: "SHOP_Admin",
    email: "admin@example.com",
    phone: "0680225733",
    password: bcrypt.hashSync("123456", 8),
    isAdmin: true,
  },
  {
    name: "User",
    productShopName: "SHOP_User",
    email: "user@example.com",
    phone: "0890845016",
    password: bcrypt.hashSync("123456", 8),
  },
];

module.exports = users;
