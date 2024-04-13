"use strict";
const util = require("util");
const logger = require("../log");
const cloudinary = require("../../../config/cloudinary.config");

const { ForbiddenRequestError } = require("../core/errorResponse");
const { PATH_IMG_PRODUCTS, PATH_IMG_CATEGORYS, PATH_IMG_COMMONS, URL_SERVER } = require("../utils/constant");

class UploadServices {
  static getUrlFromLocal = ({ file, query }) => {
    const folder = query?.folder;
    const filename = file?.filename ?? "";

    const toFolder = {
      products: PATH_IMG_PRODUCTS,
      categorys: PATH_IMG_CATEGORYS,
    };

    const url =
      URL_SERVER + (toFolder[folder] ?? PATH_IMG_COMMONS) + "/" + filename;

    return { url };
  };

  static uploadFromUrl = async () => {
    const urlImage =
      "https://genk.mediacdn.vn/139269124445442048/2024/4/12/220915df66e0e99bc5d39317f5a64b11823ab76d-1712821336971764153781-1712882558761-17128825589311749566008.png";
    const folderName = "shop/1202";
    const newFileName = "testdev" + Date.now();
    const options = {
      use_filename: true,
      unique_filename: false,
      overwrite: true,
      public_id: newFileName,
      folder: folderName,
    };

    const result = await cloudinary.uploader.upload(urlImage, options);

    // logger.info(
    //   `result ::: ${util.inspect(result, {
    //     showHidden: false,
    //     depth: null,
    //     colors: false,
    //   })}`
    // );

    return result;
  };

  static uploadFromLocal = async ({ file, query }) => {
    const filename = file?.filename ?? "";
    const folder = query?.folder ?? "commons";

    const options = {
      use_filename: true,
      unique_filename: false,
      overwrite: true,
      public_id: filename,
      folder,
    };
    const path = file?.path ?? "";

    const result = await cloudinary.uploader.upload(path, options);

    return {
      ...result,
      thumb_url: await cloudinary.url(result.public_id, {
        width: 100,
        height: 100,
        format: "jpg",
      }),
    };
  };
  /////////////////////////
  // Uploads an image file
  /////////////////////////
  static uploadImage = async (imagePath) => {
    // Use the uploaded file's name as the asset's public ID and
    // allow overwriting the asset with new versions
    const options = {
      use_filename: true,
      unique_filename: false,
      overwrite: true,
    };

    try {
      // Upload the image
      const result = await cloudinary.uploader.upload(imagePath, options);
      console.log(result);
      return result.public_id;
    } catch (error) {
      console.error(error);
    }
  };

  /////////////////////////////////////
  // Gets details of an uploaded image
  /////////////////////////////////////
  static getAssetInfo = async (publicId) => {
    // Return colors in the response
    const options = {
      colors: true,
    };

    try {
      // Get details about the asset
      const result = await cloudinary.api.resource(publicId, options);
      console.log(result);
      return result.colors;
    } catch (error) {
      console.error(error);
    }
  };

  //////////////////////////////////////////////////////////////
  // Creates an HTML image tag with a transformation that
  // results in a circular thumbnail crop of the image
  // focused on the faces, applying an outline of the
  // first color, and setting a background of the second color.
  //////////////////////////////////////////////////////////////
  static createImageTag = (publicId, ...colors) => {
    // Set the effect color and background color
    const [effectColor, backgroundColor] = colors;

    // Create an image tag with transformations applied to the src URL
    let imageTag = cloudinary.image(publicId, {
      transformation: [
        { width: 250, height: 250, gravity: "faces", crop: "thumb" },
        { radius: "max" },
        { effect: "outline:10", color: effectColor },
        { background: backgroundColor },
      ],
    });

    return imageTag;
  };

  //////////////////
  //
  // Main function
  //
  //////////////////
  // (async () => {
  //   // Set the image to upload
  //   const imagePath =
  //     "https://cloudinary-devs.github.io/cld-docs-assets/assets/images/happy_people.jpg";

  //   // Upload the image
  //   const publicId = await uploadImage(imagePath);

  //   // Get the colors in the image
  //   const colors = await getAssetInfo(publicId);

  //   // Create an image tag, using two of the colors in a transformation
  //   const imageTag = await createImageTag(publicId, colors[0][0], colors[1][0]);

  //   // Log the image tag to the console
  //   console.log(imageTag);
  // })();
}

module.exports = UploadServices;
