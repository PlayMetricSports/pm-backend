const mongoose = require("mongoose");

const FileSchema = mongoose.Schema({
    name: {
        type: String,
        required: [true, "File name is required."]
    },
    alternative_text: {
        type: String,
        required: [true, "File alternative name is required."]
    },
    caption: {
        type: String,
        required: [true, "File caption is required."]
    },
    extension: {
        type: String,
        required: [true, "File extension is required."]
    },
    mime: {
        type: String,
        required: [true, "File mime is required."]
    },
    size: {
        type: Number,
        required: [true, "File size is required."]
    },
    url: {
        type: String,
        required: [true, "File url/path is required."]
    },
    used: {
        type: Boolean,
        required: [true, "File condition used/unused is required."]
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: false
    },
    updatedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: false
    },
    storage: {
        type: String,
        required: [true, "File storage type is required."]
    }
}, { timestamps: true });


FileSchema.index({ extension: 1 });
FileSchema.index({ url: 1 }, { unique: true });

module.exports = mongoose.model("File", FileSchema);