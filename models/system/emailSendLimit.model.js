const mongoose = require("mongoose");

const emailSendLimitSchema = new mongoose.Schema(
    {
        email: {
            type: String,
            required: true,
            lowercase: true,
            trim: true,
            index: true
        },
        sentCount: {
            type: Number,
            default: 0
        },
        lastResetDate: {
            type: Date,
            default: Date.now
        }
    },
    {
        timestamps: true
    }
);

emailSendLimitSchema.index({ email: 1, lastResetDate: 1 });

module.exports = mongoose.model("EmailSendLimit", emailSendLimitSchema);
