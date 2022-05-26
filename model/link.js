const mongoose = require("mongoose");
const { v4: uuidv4 } = require("uuid");
const UserSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
    },
    magic_link: {
        type: String,
        required: false,
    },
    createdAt: Date,
    //createdAt: { type: Date, expires: '2m', default: Date.now }
    expiresAt: Date
});

const MagicL = mongoose.model("MagicL", UserSchema);
module.exports = MagicL;
