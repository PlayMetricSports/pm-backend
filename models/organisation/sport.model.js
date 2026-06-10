const mongoose = require("mongoose");

const SportSchema = mongoose.Schema({
    name: {
        type: String,
        required: [true, "Sport name is required."]
    },
    orgId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Org",
        required: [true, "Organisation ID is required."]
    },
    venueId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Venue",
        required: [true, "Venue ID is required."]
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

SportSchema.index({ orgId: 1 });
SportSchema.index({ name: 1 });

module.exports = mongoose.model("Sport", SportSchema);
