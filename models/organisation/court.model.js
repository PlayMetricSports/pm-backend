
function capitalizeWords(str) {
    if (!str) return str;
    return str
        .trim()
        .toLowerCase()
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
}
const CourtSchema = mongoose.Schema({
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
    sportId: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Sport",
        required: [true, "Sport ID is required."]
    }],
    courtNumber: {
        type: Number,
    },
    courtName: {
        type: String,
        set: capitalizeWords,
        trim: true
    },
    isMultipurpose: {
        type: Boolean,
        required: [true, "Multi Purpose Flag is required."],
        default: false
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

CourtSchema.index({ orgId: 1, venueId: 1, sportId: 1 });
CourtSchema.index({ orgId: 1, venueId: 1, courtNumber: 1, courtName: 1, status: 1 });
CourtSchema.index({ date: 1 });
CourtSchema.index({ status: 1 });
CourtSchema.index({ timeslotId: 1 });

module.exports = mongoose.model("Court", CourtSchema);
