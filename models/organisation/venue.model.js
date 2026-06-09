const mongoose = require("mongoose");

const VenueSchema = mongoose.Schema({
    name: {
        type: String,
        required: [true, "Venue name is required."]
    },
    orgId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Org",
        required: [true, "Organisation ID is required."]
    },
    address: {
        type: String,
        required: [true, "Venue address is required."]
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
    }
}, { timestamps: true });

VenueSchema.index({ orgId: 1 });
VenueSchema.index({ name: 1 });

module.exports = mongoose.model("Venue", VenueSchema);