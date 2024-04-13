const multer = require("multer");
const sharp = require("sharp");
const fs = require("fs");
const {
  DIRNAME_IMG_PRODUCTS,
  DIRNAME_IMG_CATEGORYS,
  DIRNAME_IMG_COMMONS,
} = require("../api/v1/utils/constant");

const diskStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const folder = req.query?.folder ?? "commons";
    const toFolder = {
      products: DIRNAME_IMG_PRODUCTS,
      categorys: DIRNAME_IMG_CATEGORYS,
    };
    cb(null, toFolder[folder] ?? DIRNAME_IMG_COMMONS);
  },
  filename: (req, file, cb) => {
    cb(null, req.body.name);
  },
});

const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    cb({ message: "Unsupported file format" }, false);
  }
};

const productImgResize = async (req, res, next) => {
  // if (!req.files) return next();

  try {
    console.log("productImgResize ::::::::::::::::", req);

    await Promise.all(
      req.files.map(async (file) => {
        await sharp(file.path)
          .resize(30, 30)
          .toFormat("jpeg")
          .jpeg({ quality: 90 })
          .toFile(`public/images/products/${file.filename}`);
        fs.unlinkSync(`public/images/products/${file.filename}`);
      })
    );
    next();
  } catch (error) {
    res.status(200);
    next(error);
  }
};

const diskUpload = multer({
  storage: diskStorage,
  fileFilter: multerFilter,
  limits: { fileSize: 10 * 1024 * 1024 },
});

const memoryUpload = multer({
  storage: multer.memoryStorage(),
});

module.exports = { diskUpload, memoryUpload, productImgResize };
