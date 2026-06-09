const mongoose = require("mongoose");

const TimeslotSchema = mongoose.Schema({
    slotIndex: {
        type: Number,
        required: [true, "Slot index is required."]
    },
    orgId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Org",
        required: [true, "Organisation ID is required."]
    },
    startTime: {
        type: String,
        required: [true, "Start time is required."]
    },
    endTime: {
        type: String,
        required: [true, "End time is required."]
    },
    timeSlotStatus: {
        type: String,
        enum: ["active", "inactive"],
        default: "active",
        required: [true, "Time slot status is required."]
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

TimeslotSchema.index({ orgId: 1 });
TimeslotSchema.index({ slotIndex: 1 });
TimeslotSchema.index({ timeSlotStatus: 1 });

module.exports = mongoose.model("Timeslot", TimeslotSchema);
