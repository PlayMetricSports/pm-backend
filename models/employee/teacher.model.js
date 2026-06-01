const mongoose = require("mongoose");

const hrtSchema = new mongoose.Schema(
  {
    boardId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Board",
    },
    gradeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Grade",
    },
    sectionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Section",
    },
  },
  { _id: false, timestamps: false, versionKey: false }
);

const teacherSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User is required."],
    },
    employeeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Employee",
      required: [true, "Employee is required."],
    },
    teacherDOB: {
      type: Date,
      required: false,
    },
    teacherMaritalStatus: {
      type: String,
      required: true,
      enum: ["unmarried", "married"],
      default: "unmarried",
    },
    teacherFathersName: {
      type: String,
      required: false,
    },
    teacherMothersName: {
      type: String,
      required: false,
    },
    teacherSpouseName: {
      type: String,
      required: false,
    },
    teacherCurrentAddress: {
      type: String,
      required: false,
    },
    teacherPermanentAddress: {
      type: String,
      required: false,
    },
    teacherDepartment: {
      type: String,
      required: false,
    },
    teacherDesignationAcademic: {
      type: String,
      required: false,
    },
    teacherResponsibilityAcademic: [
      {
        type: String,
        required: false,
      },
    ],
    teacherDesignationAdmin: {
      type: String,
      required: false,
    },
    teacherResponsibilityAdmin: [
      {
        type: String,
        required: false,
      },
    ],

    teacherProfile: {
      type: String,
      required: false,
    },
    teacherQualification: {
      type: String,
      required: false,
    },
    teacherWorkExperience: {
      type: String,
      required: false,
    },
    teacherDegination: {
      type: String,
      required: false,
    },
    profile: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "File",
      required: false,
    },
    hrtLevel: {
      type: [hrtSchema],
    },
    stateStaffCode: {
      type: String,
      required: false
    },
    nationalCode: {
      type: String,
      required: false
    }
  },
  { timestamps: true }
);

teacherSchema.index({ userId: 1 }, { unique: true });
teacherSchema.index({ employeeId: 1 }, { unique: true });

module.exports = mongoose.model("Teacher", teacherSchema);