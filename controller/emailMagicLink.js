const nodemailer = require("nodemailer");
const MagicLink = require("../model/linkModel");
const jwt = require("jsonwebtoken");
const jwt_secret = process.env.JWT_SECRET;

const URL = "http://localhost:3000/email/";
const sendEmail = async ({ _id, email }, res) => {
  try {
    const token = jwt.sign(
      { email: email },
      process.env.JWT_SECRET,
      {
        expiresIn: "5m",
      }
    );
    let transporter = nodemailer.createTransport({
      port: process.env.PORT,
      host: "smtp.gmail.com",
      auth: {
        user: process.env.EMAIL,
        pass: process.env.PASS,
      },
    });
    const mailOptions = {
      from: process.env.EMAIL,
      to: email,
      subject: "This is Your link",
      html: `${URL + email + "/" + token} is the link for login and is valid for 3 mins. <br>
       <h> Please DO NOT share with anyone to keep your account safe<h>`,
    };
    const linkDetail = new MagicLink({
      email,
      userId: _id,
      token,
      expiresAt: Date.now() + 1800000
    });
    linkDetail.save()
    await transporter.sendMail(mailOptions);
    return res.json({
      status: "PENDING",
      message: "link has been sent",
      data: {
        token,
        email,
        userId: _id
      },
    });
  } catch (e) {
    console.log(e);
    res.json({
      status: "FAILED",
      message: e.message,
    });
  }
};

module.exports.sendEmail = sendEmail;
