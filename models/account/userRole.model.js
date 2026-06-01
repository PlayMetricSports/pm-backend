const mongoose = require("mongoose");

const UserRoleSchema = mongoose.Schema({
    userRoleName: {
        type: String,
        required: [true, "User role name is required."]
    },
    userRoleKey: {
        type: String,
        required: [true, "User role key is required."]
    },
    userRoleStatus: {
        type: String,
        required: [true, "User role status is required."],
        enum: ["active", "inactive"],
        default: "active"
    },
    actionIds: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Action"
    }],
    userType: {
        type: String,
        required: [true, "User type is required."],
        enum: ["admin", "employee", "student", "parent", "guard", "school-admin", "school-employee"]
    },
    isAdmin: {
        type: String,
        required: true,
        enum: ["yes", "no"],
        default: "no"

    }
}, { timestamps: true });


UserRoleSchema.index({ userRoleName: 1 }, { unique: true });
UserRoleSchema.index({ userRoleKey: 1 }, { unique: true });

module.exports = mongoose.model("UserRole", UserRoleSchema);