const Magic = require("../model/userMagic");
const MagicLink = require("../model/linkModel")
const jwt = require("jsonwebtoken");
const { validationResult } = require("express-validator");
const { sendEmail } = require("../utils/emailTemplate")
exports.register = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(422).json({ errors: errors.array() });
      return;
    }
    const { email } = req.body;
    const newUser = new Magic({
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

exports.loginLinkSend = async (req, res, _id) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(422).json({ errors: errors.array() });
      return;
    }
    const { email } = req.body;
    const user = await Magic.findOne({ email })
    const payload = {
      email: user.email,
    };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "3m" });
    const link = `http://localhost:3000/V1/api/link/${email}/${token}`;

    const linkDetail = new MagicLink({
      email,
      userId: _id,
      token,
      expiresAt: Date.now() + 1800000
    });
    linkDetail.save()
    const emailClient = new sendEmail();
    emailClient.setBody(`${link} is the one time link for login and is valid for 3 mins. <br>
       Please DO NOT share with anyone to keep your account safe`);
    emailClient.setSubject("This is your link for login ");
    emailClient.send(email);
    console.log(linkDetail);
    return res.status(200).json({
      message: "Link has been sent",
      link: token,
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

exports.loginWithLink = async (req, res) => {
  try {
    const { email, token } = req.body;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(422).json({ errors: errors.array() });
      return;
    }
    const linkDetail = await MagicLink.findOne(
      {
        email, token, expiresAt: { $gte: new Date() }
      });
    console.log(linkDetail)
    if (!linkDetail) {
      console.log("link has been expired", linkDetail)
      return res.status(400).json({
        type: "FAILED",
        message: " link has been expired or incorrect ",
      });
    }
    else {
      console.log("user email data", linkDetail)
      await MagicLink.deleteMany({ email });
      res.status(200).json({
        type: "success",
        message: "welcome to our Website",
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
