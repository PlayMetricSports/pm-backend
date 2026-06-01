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

const OrganizationSchema = mongoose.Schema({
    organizationName: { type: String, required: false },
    contactNo: { countryCode: { type: String, required: false }, number: { type: String, required: false } },
    gstNo: { type: String, required: false },
    address: { type: String, required: false },
    organisationUrl: { type: String, required: false }
}, { timestamps: true });


module.exports = mongoose.model("Organization", OrganizationSchema);