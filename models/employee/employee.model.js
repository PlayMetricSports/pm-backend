const mongoose = require("mongoose");

const EmergencyContactSchema = mongoose.Schema({
    name: {
        firstName: { type: String, required: false },
        middleName: { type: String, required: false },
        lastName: { type: String, required: false }
    },
    presentAddress: { type: String, required: false },
    permanentAddress: { type: String, required: false },
    phoneNo: {
        countryCode: { type: String, required: false },
        number: { type: String, required: false }
    },
    aadharCardNo: { type: String, required: false },
    aadharUpload: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "File",
        required: false
    }
}, { _id: true });

const EmployeeSchema = mongoose.Schema({
    employeeCode: { type: String, required: false },
    organization: {
        type: String,
        required: false,
    },
    designation: { type: String, required: false },
    mobileNumber: {
        countryCode: {
            type: String,
            required: [false, "Country code is required."],
            match: [/^\+[1-9]\d{0,2}$/, "Please enter a valid country code."]
        },
        number: {
            type: String,
            required: [false, "Mobile Number is required."]
        },
        isValid: { type: Boolean, required: false, default: false }
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: [true, "Employee user id is required."]
    },
    userRoleId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "UserRole",
        required: [true, "Employee user role is required."]
    },
    userRoleName: {
        type: String,
        required: [true, "Employee Designation is required."]
    },
    employmentType: {
        type: String,
        enum: ["manual", "agency"],
        required: false
    },
    presentAddress: { type: String, required: false },
    permanentAddress: { type: String, required: false },
    licenseNo: { type: String, required: false },
    aadharCardNo: { type: String, required: false },
    aadharUpload: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "File",
        required: false
    },
    licenseUpload: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "File",
        required: false
    },
    profilePhoto: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "File",
        required: false
    },
    emergencyContactDetails: {
        type: [EmergencyContactSchema],
        required: false,
        default: []
    },
    agencyDetails: {
        agencyName: { type: String, required: false },
        contactNo: {
            countryCode: { type: String, required: false },
            number: { type: String, required: false }
        },
        personName: { type: String, required: false },
        gstNo: { type: String, required: false },
        address: { type: String, required: false }
    }
}, { timestamps: true });

EmployeeSchema.pre("validate", async function (next) {
    if (this.employeeCode && this.employeeCode.toString().trim()) {
        return next();
    }

    const createdAt = this.createdAt || new Date();
    const year = createdAt.getFullYear();
    const month = String(createdAt.getMonth() + 1).padStart(2, '0');
    const prefix = `${year}${month}`;

    try {
        const lastEmployee = await mongoose.model("Employee")
            .findOne({ employeeCode: { $regex: `^${prefix}` } })
            .sort({ employeeCode: -1 })
            .lean();

        let nextSequence = 1;

        if (lastEmployee?.employeeCode) {
            const lastSeq = parseInt(lastEmployee.employeeCode.slice(-3));
            nextSequence = lastSeq + 1;
        }

        this.employeeCode = `${prefix}${String(nextSequence).padStart(3, '0')}`;
        next();
    } catch (err) {
        return next(err);
    }
});

EmployeeSchema.index({ userId: 1 }, { unique: true });
EmployeeSchema.index({ "mobileNumber.number": 1 }, { unique: true });
EmployeeSchema.index({ userRoleName: 1 });
EmployeeSchema.index({ employmentType: 1 });
EmployeeSchema.index({ licenseNo: 1 }, { sparse: true });
EmployeeSchema.index({ aadharCardNo: 1 }, { sparse: true });

module.exports = mongoose.model("Employee", EmployeeSchema);