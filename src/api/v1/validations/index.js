const { check } = require("express-validator");

const validateRegisterUser = () => {
  return [
    check("name", "username does not Empty").not().isEmpty(),
    check("name", "username must be Alphanumeric").isAlphanumeric(),
    check("name", "username more than 3 degits").isLength({ min: 3 }),
    check("email", "Invalid does not Empty").not().isEmpty(),
    check("email", "Invalid email").isEmail(),
    // check("birthday", "Invalid birthday").isISO8601("yyyy-mm-dd"),
    check("password", "password more than 6 degits").isLength({ min: 6 }),
    check("phone", "phone more than 10 degits").isLength({ min: 10 }),
  ];
};

const validateLogin = () => {
  return [
    check("email", "Invalid does not Empty").not().isEmpty(),
    check("email", "Invalid email").isEmail(),
    check("password", "password more than 6 degits").isLength({ min: 6 }),
  ];
};

const validateEmail = () => {
  return [
    check("email", "Invalid does not Empty").not().isEmpty(),
    check("email").isEmail().withMessage("Invalid Email Address"),
  ];
};

const validate = {
  validateRegisterUser: validateRegisterUser,
  validateLogin: validateLogin,
  validateEmail: validateEmail,
};
module.exports = { validate };
