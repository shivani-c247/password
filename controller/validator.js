const { body } = require("express-validator");
const User = require("../model/userOtpModel");
const Magic = require("../model/userMagic")

exports.validate = [
  body("email")
    .not()
    .isEmpty()
    .withMessage("email is required")
    .isEmail()
    .withMessage("Invalid Email")
    .custom(async (value) => {
      const user = await User.findOne({ email: value });
      if (user) {
        throw new Error("email is already taken");
      }
    }),
];

exports.loginValidation = [
  body("email")
    .not()
    .isEmpty()
    .withMessage("email is required")
    .isEmail()
    .withMessage("Invalid Email")
    .custom(async (value) => {
      const user = await User.findOne({ email: value });
      if (!user) {
        throw new Error("user not found");
      }
    }),
];
exports.otpValidation = [
  body("email")
    .not()
    .isEmpty()
    .withMessage("email is required")
    .isEmail()
    .withMessage("Invalid Email")
    .custom(async (value) => {
      const user = await User.findOne({ email: value });
      if (!user) {
        throw new Error("user not found");
      }
    }),
  body("otp").not().isEmpty().withMessage("otp is required"),
];

exports.registerValidation = [
  body("email")
    .not()
    .isEmpty()
    .withMessage("email is required")
    .isEmail()
    .withMessage("Invalid Email")
    .custom(async (value) => {
      const user = await Magic.findOne({ email: value });
      if (user) {
        throw new Error("email is already taken");
      }
    }),
];

exports.linkSendValidation = [
  body("email")
    .not()
    .isEmpty()
    .withMessage("email is required")
    .isEmail()
    .withMessage("Invalid Email")
    .custom(async (value) => {
      const user = await Magic.findOne({ email: value });
      if (!user) {
        throw new Error("user not found");
      }
    }),

];

exports.linkValidation = [
  body("email")
    .not()
    .isEmpty()
    .withMessage("email is required")
    .isEmail()
    .withMessage("Invalid Email")
    .custom(async (value) => {
      const user = await Magic.findOne({ email: value });
      if (!user) {
        throw new Error("user not found");
      }
    }),
  body("token").not().isEmpty().withMessage("token is required"),
];