const mongoose = require("mongoose");

const TeacherSubjectSchema = mongoose.Schema({
    teacherId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Teacher',
        required: [false, "Teacher is required."]
    },
    oldTeacherSubjectId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'TeacherSubject',
        required: [false, "Teacher is required."]
    },
    subjectId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Subject',
        required: [true, "Subject is required."]
    },
    offerSubjectId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'OfferSubject',
        required: [true, "Offer Subject is required."]
    },
    academicSessionYear: {
        type: String,
        required: [true, "academic session year is required."]
    },
    termName: {
        type: String,
        required: true,
        enum: ["Term", "Full Year", "Semester", "Tri Semester"]
    },
    termNumber: {
        type: Number,
        required: true,
        enum: [1, 2, 3]
    },
    boardId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Board',
        required: [true, "Board is required."]
    },
    gradeId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Grade',
        required: [true, "Grade is required."]
    },
    classId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Class',
        required: [true, "Class is required."]
    },
    sectionId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Section',
        required: [false, "Section is required."]
    },
    teacherSubjectStatus: {
        type: String,
        required: [true, "teacher subject status is required."],
        enum: ["active", "inactive", "changed"],
        default: "active"
    },
    batchYear: {
        type: String,
        required: [true, "Batch number is required."]
    }
}, { timestamps: true });

TeacherSubjectSchema.index({ teacherId: 1 });
TeacherSubjectSchema.index({ subjectId: 1 });
TeacherSubjectSchema.index({ offerSubjectId: 1 });
TeacherSubjectSchema.index({ teacherId: 1, subjectId: 1 });
TeacherSubjectSchema.index({ teacherId: 1, offerSubjectId: 1 });
TeacherSubjectSchema.index({ teacherId: 1, teacherSubjectStatus: 1 });

module.exports = mongoose.model("TeacherSubject", TeacherSubjectSchema);