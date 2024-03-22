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

module.exports = {
  getInfoData,
  getSelectData,
  getUnSelectData,
  convertToObjectId,
};
