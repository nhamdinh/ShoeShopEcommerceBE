"use strict";
const util = require("util");
const logger = require("../api/v1/log");
const {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
} = require("@aws-sdk/client-s3");

const s3Config = {
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_API_KEY,
    secretAccessKey: process.env.AWS_API_SECRET,
  },
};

// logger.info(
//   `s3Config ::: ${util.inspect(s3Config, {
//     showHidden: false,
//     depth: null,
//     colors: false,
//   })}`
// );

const clientS3 = new S3Client(s3Config);

module.exports = { clientS3, PutObjectCommand, GetObjectCommand };
