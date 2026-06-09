const mongoose = require("mongoose");

const CalendarSchema = mongoose.Schema({
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
    sportId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Sport",
        required: [true, "Sport ID is required."]
    },
    timeslotId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Timeslot",
        required: [true, "Timeslot ID is required."]
    },
    bookingId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Booking",
        required: false
    },
    date: {
        type: Date,
        default: () => new Date(),
        required: [true, "Date is required."]
    },
    status: {
        type: String,
        enum: ["scheduled", "current", "cancelled", "finished"],
        default: "scheduled",
        required: [true, "Calendar status is required."]
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

CalendarSchema.index({ orgId: 1, venueId: 1, sportId: 1 });
CalendarSchema.index({ date: 1 });
CalendarSchema.index({ status: 1 });
CalendarSchema.index({ timeslotId: 1 });
CalendarSchema.index({ bookingId: 1 });

module.exports = mongoose.model("Calendar", CalendarSchema);
