"use strict";
const util = require("util");
const _ = require("lodash");
const logger = require("../log");
const { Types } = require("mongoose"); // Erase if already required

const removeNullObject = (obj) => {
  for (let key in obj) {
    if (obj[key] === null || obj[key] === undefined) {
      delete obj[key];
    } else if (typeof obj[key] === "object" && !Array.isArray(obj[key])) {
      obj[key] = removeNullObject(obj[key]);
      if (Object.keys(obj[key]).length === 0) {
        delete obj[key];
      }
    }
  }

  return obj;
};
/**
 * const a ={
 *           b:{
 *            c:1,
 *            d:2
 *           }
 *          }
 * ==>
 * const a ={
 *           b.c: 1
 *           b.d: 2,
 *          }
 *
 **/
// const updateNestedObjectParser = (obj) => {
//   const final = {};
//   Object.keys(obj).forEach((key) => {
//     if (typeof obj[key] === "object" && !Array.isArray(obj[key])) {
//       const response = updateNestedObjectParser(obj[key]);
//       Object.keys(obj[key]).forEach((aa) => {
//         final[`${key}.${aa}`] = response[aa];
//       });
//     } else {
//       final[key] = obj[key];
//     }
//   });
//   return final;
// };

const updateNestedObjectParser = (obj) => {
  const final = {};

  const recurse = (obj, currentKey = "") => {
    for (let key in obj) {
      if (obj[key] !== null && obj[key] !== undefined) {
        // console.log(`!Array.isArray(obj[key]) ::: ${JSON.stringify(obj[key])} ::: ${!Array.isArray(obj[key])}`);
        if (typeof obj[key] === "object" && !Array.isArray(obj[key])) {
          if (currentKey !== "") {
            recurse(obj[key], `${currentKey}.${key}`);
          } else {
            recurse(obj[key], key);
          }
        } else {
          if (currentKey !== "") {
            final[`${currentKey}.${key}`] = obj[key];
          } else {
            final[key] = obj[key];
          }
        }
      }
    }
  };

  recurse(obj);

  return final;
};

const  toNonAccentVietnamese = (str) => {
  str = str.replace(/A|Á|À|Ã|Ạ|Ả|Â|Ấ|Ầ|Ẫ|Ậ|Ẩ|Ă|Ắ|Ằ|Ẵ|Ặ|Ẳ/g, "A");
  str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, "a");
  str = str.replace(/E|É|È|Ẽ|Ẹ|Ẻ|Ê|Ế|Ề|Ễ|Ệ|Ể/, "E");
  str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, "e");
  str = str.replace(/I|Í|Ì|Ĩ|Ị|Ỉ/g, "I");
  str = str.replace(/ì|í|ị|ỉ|ĩ/g, "i");
  str = str.replace(/O|Ó|Ò|Õ|Ọ|Ỏ|Ô|Ố|Ồ|Ỗ|Ộ|Ổ|Ơ|Ớ|Ờ|Ỡ|Ợ|Ở/g, "O");
  str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, "o");
  str = str.replace(/U|Ú|Ù|Ũ|Ụ|Ủ|Ư|Ứ|Ừ|Ữ|Ự|Ử/g, "U");
  str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, "u");
  str = str.replace(/Y|Ý|Ỳ|Ỹ|Ỵ|Ỷ/g, "Y");
  str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, "y");
  str = str.replace(/Đ/g, "D");
  str = str.replace(/đ/g, "d");
  // Some system encode vietnamese combining accent as individual utf-8 characters
  // str = str.replace(/\u0300|\u0301|\u0303|\u0309|\u0323/g, ""); // Huyền sắc hỏi ngã nặng
  // str = str.replace(/\u02C6|\u0306|\u031B/g, ""); // Â, Ê, Ă, Ơ, Ư
  return str;
}

module.exports = {
  removeNullObject,
  updateNestedObjectParser,
  toNonAccentVietnamese,
};
