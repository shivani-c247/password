const mongoose = require("mongoose");
const LinkSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
    },
    token: {
        type: String,
        required: true,
    },
},
    { timestamps: true });

LinkSchema.index({ createdAt: 1 }, { expireAfterSeconds: 1200 });
module.exports = mongoose.model("MagicLink", LinkSchema);

