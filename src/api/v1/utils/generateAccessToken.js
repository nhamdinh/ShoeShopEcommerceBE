const JWT = require("jsonwebtoken");

const generateAccessToken = (id) => {
  return JWT.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: 1 * 24 * 60 * 60,
  });
};

module.exports = generateAccessToken;
