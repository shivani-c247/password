const mongoose = require("mongoose");
const otpSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
    },
    otp: {
      type: String,
      required: true,
    },
    createdAt: Date,
    // createdAt: { type: Date, expires: '2m', default: Date.now }
    expiresAt: Date
  },
  { timestamps: true }
);

module.exports = mongoose.model("Otp", otpSchema);
