const mongoose = require("mongoose");

const R2Schema = mongoose.Schema({
    url: {
        type: String,
        required: [true, "File url/path is required."]
    },
    size: {
        type: Number,
        required: [true, "File size is required."]
    },
    name: {
        type: String,
        required: [true, "File name is required."]
    },
    deleteStatus: {
        type: String,
        required: [true, "Delete status is required."],
        default: "not-delete"
    }
}, { timestamps: true });

R2Schema.index({ url: 1 }, { unique: true });

module.exports = mongoose.model("R2", R2Schema);