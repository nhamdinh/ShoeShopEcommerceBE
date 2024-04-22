"use strict";
const { uid } = require("uid");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");
const util = require("util");
const logger = require("../log");
const cloudinary = require("../../../config/cloudinary.config");
const {
  clientS3,
  PutObjectCommand,
  GetObjectCommand,
} = require("../../../config/s3.config");

const { ForbiddenRequestError } = require("../core/errorResponse");
const {
  PATH_IMG_PRODUCTS,
  PATH_IMG_CATEGORYS,
  PATH_IMG_COMMONS,
  URL_SERVER,
  PATH_IMG_AVATAR,
} = require("../utils/constant");
const { randomName } = require("../utils/functionHelpers");
const miniSize = {
  width: 370,
  height: 250,
};
const miniSizeAvatar = {
  width: 400,
  height: 400,
};
class UploadServices {
  /* s3 */
  static uploadFromLocalS3 = async ({ file, query }) => {
    // const filename = file?.filename ?? "";
    // const folder = query?.folder ?? "commons";
    const keyName = (file.originalname ?? "unknown") + randomName();
    const objectCommand = {
      Bucket: process.env.AWS_CLOUD_NAME,
      Key: keyName,
    };

    const command = new PutObjectCommand({
      ...objectCommand,
      Body: file.buffer,
      ContentType: "image/jpeg",
    });

    const result = await clientS3.send(command);

    const signedUrl = new GetObjectCommand(objectCommand);

    const url = await getSignedUrl(clientS3, signedUrl, { expiresIn: 3600 });

    return {
      url,
    };
  };
  /* s3 */

  /* cloudinary */

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

  static uploadFromUrl = async ({ body }) => {
    const {
      urlImage = "https://genk.mediacdn.vn/139269124445442048/2024/4/12/220915df66e0e99bc5d39317f5a64b11823ab76d-1712821336971764153781-1712882558761-17128825589311749566008.png",
    } = body;

    const newFileName = "url" + Date.now() + uid();
    const folder = body?.folder ?? "commons";
    const options = {
      use_filename: true,
      unique_filename: false,
      overwrite: true,
      public_id: newFileName,
      folder,
    };

    const result = await cloudinary.uploader.upload(urlImage, options);

    return {
      ...result,
      thumb_url: await cloudinary.url(result.public_id, {
        ...miniSize,
        format: "jpg",
      }),
    };
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

    const mini = folder === PATH_IMG_AVATAR ? miniSizeAvatar : miniSize;
    return {
      ...result,
      thumb_url: await cloudinary.url(result.public_id, {
        ...mini,
        format: "jpg",
      }),
    };
  };

  /* cloudinary */

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
