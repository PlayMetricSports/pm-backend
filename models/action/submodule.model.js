const mongoose = require("mongoose");

const SubModuleSchema = mongoose.Schema({
    subModuleName: {
        type: String,
        required: [true, "SubModule name is required."]
    },
    subModuleKey: {
        type: String,
        required: [true, "SubModule name is required."],
        lowercase: [true, "SubModule Key must be in lowercase."],
        match: [
            /^[a-zA-Z0-9]+(?:-[a-zA-Z0-9]+)*$/,
            "Enter a valid SubModule key e.g (k12-online-schools or edovu-ventures)"
        ]
    },
    subModuleIcon: {
        type: String,
        required: false
    },
    moduleId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Module",
        required: [true, "Module id is required."]
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

SubModuleSchema.index({ subModuleKey: 1 }, { unique: true });

module.exports = mongoose.model("SubModule", SubModuleSchema);