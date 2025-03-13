const JWT = require("jsonwebtoken");

const generateRefreshToken = (id) => {
  return JWT.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: 30 * 24 * 60 * 60,
    // expiresIn: '30d',
  });
};

module.exports = generateRefreshToken;
