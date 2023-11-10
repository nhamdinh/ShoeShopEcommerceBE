"use strict";
const util = require("util");
const _ = require("lodash");
const logger = require("../log");
const { Types } = require("mongoose"); // Erase if already required

const convertToObjectId = (id) => Types.ObjectId(id);

const getInfoData = ({ object = {}, fields = [] }) => {
  return _.pick(object, fields);
};

// ['b','c','d','e']={a:1,b:1}
const getSelectData = (select = []) => {
  return Object.fromEntries(select.map((el) => [el, 1]));
};

const getUnSelectData = (select = []) => {
  return Object.fromEntries(select.map((el) => [el, 0]));
};

const removeNullObject = (obj) => {
  Object.keys(obj).forEach((key) => {
    if (obj[key] === null || obj[key] === undefined) {
      delete obj[key];
    }
  });

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
const updateNestedObjectParser = (obj) => {
  const final = {};
  Object.keys(obj).forEach((key) => {
    if (typeof obj[key] === "object" && !Array.isArray(obj[key])) {
      const response = updateNestedObjectParser(obj[key]);
      Object.keys(obj[key]).forEach((aa) => {
        final[`${key}.${aa}`] = response[aa];
      });
    } else {
      final[key] = obj[key];
    }
  });
  return final;
};

module.exports = {
  getInfoData,
  getSelectData,
  getUnSelectData,
  removeNullObject,
  updateNestedObjectParser,
  convertToObjectId,
};
