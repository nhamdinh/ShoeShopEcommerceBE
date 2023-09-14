const multer = require("multer");
const sharp = require("sharp");
const fs = require("fs");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    let folder = req?.query?.folder;
    if (folder === "products") {
      cb(null, "public/images/products");
    } else if (folder === "categorys") {
      cb(null, "public/images/categorys");
    } else {
      cb(null, "public/images/commons");
    }
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

const storageUpload = multer({
  storage: storage,
  fileFilter: multerFilter,
  limits: { fileSize: 10 * 1024 * 1024 },
});

module.exports = { storageUpload, productImgResize };
