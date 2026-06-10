const mongoose = require("mongoose");

const OrgSchema = mongoose.Schema({
    name: {
        type: String,
        required: [true, "Organisation name is required."]
    },
    domainUrl: {
        type: String,
        required: [true, "Domain URL is required."]
    },
    organisationNumber: {
        type: String,
        required: [true, "Organisation number is required."],
        unique: true
    },
    mainOffice: {
        type: String,
        required: [true, "Main office address is required."]
    },
    orgSubDomain: {
        type: String,
        required: [true, "Organisation subdomain is required."],
        unique: true
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
    status: {
        type: String,
        enum: ["active", "inactive"],
        default: "active"
    }
}, { timestamps: true });

OrgSchema.index({ organisationNumber: 1 });
OrgSchema.index({ orgSubDomain: 1 });
OrgSchema.index({ domainUrl: 1 });

module.exports = mongoose.model("Org", OrgSchema);
