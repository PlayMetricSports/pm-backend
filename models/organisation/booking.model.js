const mongoose = require("mongoose");
const TPATypeEnum = ["PlayO", "District", "Own"]
const StatusEnum = ["scheduled", "District", "Own"]
function capitalizeWords(str) {
    if (!str) return str;
    return str
        .trim()
        .toLowerCase()
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
}
const BookingSchema = mongoose.Schema({
    customerName: {
        firstName: {
            type: String,
            required: [true, "First name is required."],
            set: capitalizeWords,
            trim: true
        },
        middleName: {
            type: String,
            required: false,
            set: capitalizeWords,
            trim: true
        },
        lastName: {
            type: String,
            required: [true, "Last name is required."],
            set: capitalizeWords,
            trim: true
        }
    },
    customerPhone: {
        countryCode: {
            type: String,
            required: false,
            match: [/^\+[1-9]\d{0,2}$/, "Please enter a valid country code."],
        },
        number: {
            type: String,
            required: false,
            match: [
                /^[6-9]\d{9}$/,
                "Please enter a valid 10-digit Mobile number."
            ]
        },
    },
    customerEmail:
    {
        type: String,
        match: [
            /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
            "Please enter a valid email address.",
        ],
        required: false,
    },
    bookingDateTime: {
        type: String,
    },
    bookingCode: {
        type: String,
        required: [true, "Booking Code is required."]
    },
    TPA: {
        type: String,
        enum: TPATypeEnum,
        required: [true, "TPA Type is required."]
    },
    status: {
        type: String,
        enum: StatusEnum,
        required: [true, "Status is required."]
    },
    finDetails: {
        ticketAmount: { type: Number, required: [true, "Ticket Amount is required."] },
        convenienceFees: { type: Number, required: [true, "Convenience Fees is required."] },
        discount: { type: Number, required: [true, "Discount Amount is required."] },
        gstPercentage: { type: Number, },
        gstAmount: { type: Number, },
        totalAmount: { type: Number, required: [true, "Total Amount is required."] },
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
    sportId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Sport",
        required: [true, "Sport ID is required."]
    },
    timeslotId: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Timeslot",
        required: [true, "Timeslot ID is required."]
    }],
    date: {
        type: Date,
        default: () => new Date(),
        required: [true, "Date is required."]
    },
    bookingDate: {
        type: Date,
        default: () => new Date(),
        required: [true, "Date is required."]
    },
    courtId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Court",
        required: [true, "Court is required."]
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

BookingSchema.index({ orgId: 1, venueId: 1, sportId: 1 });
BookingSchema.index({ date: 1 });
BookingSchema.index({ status: 1 });
BookingSchema.index({ timeslotId: 1 });

module.exports = mongoose.model("Booking", BookingSchema);
