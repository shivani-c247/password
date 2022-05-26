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
    expiresAt: Date
  },
  { timestamps: true }
);

module.exports = mongoose.model("Otp", otpSchema);
