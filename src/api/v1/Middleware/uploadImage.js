const { URL_SERVER } = require("../utils/constant");

const uploadPhoto = (req, res) => {
  let folder = req?.query?.folder;
  let url = "";
  try {
    if (folder === "products") {
      url = URL_SERVER + "products-img/" + req?.file?.filename;
    } else if (folder === "categorys") {
      url = URL_SERVER + "categorys-img/" + req?.file?.filename;
    } else {
      url = URL_SERVER + "commons/" + req?.file?.filename;
    }
    return res.status(200).json({ url });
  } catch (error) {
    console.error(error);
  }
};

module.exports = { uploadPhoto };
