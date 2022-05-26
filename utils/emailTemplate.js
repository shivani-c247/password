const nodemailer = require("nodemailer");
const Otp = require("../model/otpModel")
const sendOtp = async ({ _id, email }, res) => {
  try {
    const otp = `${Math.floor(100 + Math.random() * 9000)}`;
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
      subject: "This is Your one time password",
      html: `${otp} is the one time password(OTP) for login and is valid for 6 mins. <br>
       <h> Please DO NOT share with anyone to keep your account safe<h>`,
    };
    const OtpDetail = new Otp({
      email,
      userId: _id,
      otp,
      createdAt: Date.now(),
      expiresAt: Date.now() + 1800000,

    });
    OtpDetail.save()
    await transporter.sendMail(mailOptions);
    return res.json({
      status: "PENDING",
      message: "Otp has been sent",
      date: {
        userId: _id,
        email,
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

module.exports.sendOtp = sendOtp;
