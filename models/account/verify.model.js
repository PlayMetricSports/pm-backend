const mongoose = require("mongoose");

const VerifySchema = mongoose.Schema({
    otp: {
        type: String,
        required: [true, "OTP is required."],
        match: [
            /^[0-9]{6}$/g,
            "The OTP must be a 6-digit number."
        ]
    },
    email: {
        type: String,
        required: [true, "Email is required."],
        match: [
            /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
            "Please provide a valid email address."
        ]
    }
}, { timestamps: true });

VerifySchema.index({ email: 1 });
VerifySchema.index({ otp: 1, email: 1 });

module.exports = mongoose.model("Verify", VerifySchema);