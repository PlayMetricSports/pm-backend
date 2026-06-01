const mongoose = require("mongoose");
const SetupSchema = new mongoose.Schema({
    currentStartYear: {
        type: String,
        required: [true, "currentStartYear is required."]
    },
    currentTerm: [{
        boardId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Board",
            required: true
        },
        gradeId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Grade",
            required: true
        },
        sectionId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Section",
            required: true
        },
        sectionName: {
            type: String,
            required: true
        },
        academicYear: {
            type: String,
            required: true
        },
        termName: {
            type: String,
            required: true
        },
        termNumber: {
            type: Number,
            required: true
        }
    }],
}, { timestamps: true });

SetupSchema.index({ currentStartYear: 1 }, { unique: true });
SetupSchema.index({ "currentTerm.boardId": 1, "currentTerm.gradeId": 1, "currentTerm.sectionName": 1 }, { unique: true });

module.exports = mongoose.model("Setup", SetupSchema);