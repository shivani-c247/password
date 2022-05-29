const User = require("../model/userOtpModel");
const Otp = require("../model/otpModel");
const { validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");
const { Email } = require("../utils/emailTemplate")
const dotenv = require("dotenv");
dotenv.config();
exports.signUp = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(422).json({ errors: errors.array() });
      return;
    }
    const { email } = req.body;
    const newUser = new User({
      email,
    });
    newUser.save().then((result) => {
      res.send(result);
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message:
        "We are having some error while completing your request. Please try again after some time.",
      error: error,
    });
  }
};

exports.loginOtpSend = async (req, res, _id) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(422).json({ errors: errors.array() });
      return;
    }
    const { email } = req.body;
    const otp = `${Math.floor(100 + Math.random() * 9000)}`;
    const user = await User.findOne({ email })
    const OtpDetail = new Otp({
      email,
      userId: _id,
      otp,
      expiresAt: Date.now() + 1800000,

    });
    OtpDetail.save();
    const emailClient = new Email();
    emailClient.setBody(`${otp} is the one time password(OTP) for login and is valid for 3 mins. <br>
    <h> Please DO NOT share with anyone to keep your account safe<h>`);
    emailClient.setSubject("This is your One Time Password ");
    emailClient.send(email);
    console.log(OtpDetail);
    return res.status(200).json({
      message: "Otp has been sent successfully",
      otp: otp,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message:
        "We are having some error while completing your request. Please try again after some time.",
      error: error,
    });
  }
};

exports.loginWithOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(422).json({ errors: errors.array() });
      return;
    }
    const userDetail = await Otp.findOne(
      {
        email, otp, expiresAt: { $gte: new Date() }
      });
    console.log(userDetail)
    if (!userDetail) {
      return res.status(400).json({
        type: "FAILED",
        message: " otp has been expired or incorrect ",
      });
    }
    else {
      const token = jwt.sign(
        { email: userDetail.email },
        process.env.JWT_SECRET,
        {
          expiresIn: "1h",
        }
      );
      console.log("user email data", userDetail)
      await Otp.deleteMany({ email });
      res.status(200).json({
        type: "success",
        message: "welcome to our Website",
        token,
      });
    }
  } catch (e) {
    console.log(e);
    res.json({
      status: "FAILED",
      message: e.message,
    });
  }
};
