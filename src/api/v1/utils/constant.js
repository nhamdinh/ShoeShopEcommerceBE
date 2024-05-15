"use strict";
module.exports = {
  PAGE_SIZE: 6,
  strCompression: "hello world 444",
  URL_SERVER: process.env.URL_SERVER,
  COOKIE_REFRESH_TOKEN: "refreshToken",
  PRODUCT_TYPE: ["electronic", "clothing", "furniture", "household"],

  RD_ALL_PRODUCTS: "RD_ALL_PRODUCTS",
  RD_FILTER_PRODUCTS: "RD_FILTER_PRODUCTS",

  RD_ALL_PRODUCTS_MAX: "RD_ALL_PRODUCTS_MAX",
  RD_FILTER_PRODUCTS_MAX: "RD_FILTER_PRODUCTS_MAX",

  RD_EXPIRE: 6000,
  PATH_IMG_COMMONS: "commons",
  PATH_IMG_PRODUCTS: "products-img",
  PATH_IMG_CATEGORYS: "categorys-img",

  DIRNAME_IMG_COMMONS: "public/images/commons",
  DIRNAME_IMG_PRODUCTS: "public/images/products",
  DIRNAME_IMG_CATEGORYS: "public/images/categorys",

  AVATAR:
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTPYWi23AJDPw9hwCYw9TbBTS_VXSI_bVHoIj8S4XN19A&s",
  PATH_IMG_AVATAR: "avatar",
  UserUnSelectData: [
    "buyer",
    "password",
    "__v",
    "refreshToken",
    "user_salt",
    "user_clients",
    "user_follower",
    "user_watching",
  ],
};
