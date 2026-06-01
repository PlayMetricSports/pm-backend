const mongoose = require("mongoose");

const ModuleSchema = mongoose.Schema({
    moduleName: {
        type: String,
        required: [true, "Module name is required."]
    },
    moduleKey: {
        type: String,
        required: [true, "Module key is required."],
        lowercase: [true, "Module Key must be in lowercase."],
        match: [
            /^[a-zA-Z0-9]+(?:-[a-zA-Z0-9]+)*$/,
            "Enter a valid module key e.g (k12-online-schools or edovu-ventures)"
        ]
    },
    moduleIcon: {
        type: String,
        required: [true, "Module Icon is required."],
        lowercase: [true, "Module Icon must be in lowercase."]
    },
    subSystemId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "SubSystem",
        required: [true, "SubSystem id is required."]
    },
    indexing: {
        type: Number,
        required: [true, "Indexing is required."],
        default: 0
    }
}, { timestamps: true });

ModuleSchema.index({ moduleKey: 1 }, { unique: true });

module.exports = mongoose.model("Module", ModuleSchema);