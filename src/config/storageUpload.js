const multer = require("multer");

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

const storageUpload = multer({ storage: storage });

module.exports = storageUpload;
