const mongoose = require("mongoose");

const SubSystemSchema = mongoose.Schema({
    subSystemName: {
        type: String,
        required: [true, "SubSystem name is required."]
    },
    subSystemKey: {
        type: String,
        required: [true, "SubSystem key is required."],
        lowercase: [true, "SubSystem Key must be in lowercase."],
        match: [
            /^[a-zA-Z0-9]+(?:-[a-zA-Z0-9]+)*$/,
            "Enter a valid SubSystem key e.g (k12-online-schools or edovu-ventures)"
        ]
    },
    subSystemIcon: {
        type: String,
        required: false,
        lowercase: [true, "SubSystem Icon must be in lowercase."]
    },
    indexing: {
        type: Number,
        required: [true, "Indexing is required."],
        default: 0
    }
}, { timestamps: true });

SubSystemSchema.index({ subSystemKey: 1 }, { unique: true });

module.exports = mongoose.model("SubSystem", SubSystemSchema);