const mongoose = require("mongoose");

const ActionSchema = mongoose.Schema({
    actionKey: {
        type: String,
        required: [true, "Action key is required."],
        lowercase: [true, "Action Key must be in lowercase."],
        match: [
            /^[a-zA-Z0-9]+(?:-[a-zA-Z0-9]+)*$/,
            "Enter a valid action key e.g (k12-online-schools or edovu-ventures)"
        ]
    },
    subModuleId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "SubModule",
        required: [true, "SubModule id is required."]
    },
    userRoleId: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "UserRole",
        required: [true, "User Role id is required."]
    }],
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
    superAdminAccess: {
        type: String,
        required: [true, "Super Admin status is required."],
        enum: ["yes", "no"],
        default: "no"
    },
}, { timestamps: true });

ActionSchema.index({ actionKey: 1 }, { unique: true });


module.exports = mongoose.model("Action", ActionSchema);