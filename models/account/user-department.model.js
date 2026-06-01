const mongoose = require("mongoose");

const UserDepartmentSchema = mongoose.Schema({
    departmentName: {
        type: String,
        required: [true, "Department name is required."]
    },
    departmentKey: {
        type: String,
        required: [true, "Department key is required."]
    },
    departmentStatus: {
        type: String,
        enum: ["active", "inactive"],
        required: [true, "Department status is required."]
    }
}, { timestamps: true });


module.exports = mongoose.model("UserDepartment", UserDepartmentSchema);