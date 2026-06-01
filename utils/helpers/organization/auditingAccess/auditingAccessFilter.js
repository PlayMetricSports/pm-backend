const AuditingAccess = require("@/models/organization/student-monitoring/auditing-access.model");
const StudentInformation = require("@/models/erp/student/studentInformation.model");
const Class = require("@/models/erp/class-and-section/class.model");
const mongoose = require("mongoose");

const getAuditingAccessFilter = async (userId) => {

    const userObjectId = typeof userId === 'string'
        ? new mongoose.Types.ObjectId(userId)
        : userId;

    const auditingAccess = await AuditingAccess.findOne({
        userId: userObjectId,
        accessStatus: "active"
    }).select("studentIdList").lean();

    if (!auditingAccess || !auditingAccess.studentIdList || auditingAccess.studentIdList.length === 0) {
        return {
            hasRestriction: false,
            boardIds: new Set(),
            gradeIds: new Set(),
            classIds: new Set(),
            sectionIds: new Set(),
            academicYears: new Set(),
            studentIds: []
        };
    }

    const students = await StudentInformation.find({
        _id: { $in: auditingAccess.studentIdList }
    }).select("boardId gradeId academicSession promotion_record").lean();

    const boardIds = new Set();
    const gradeIds = new Set();
    const academicYears = new Set();
    const sectionIds = new Set();
    const boardGradePairs = [];

    students.forEach(student => {
        if (student.boardId) {
            boardIds.add(student.boardId.toString());
        }
        if (student.gradeId) {
            gradeIds.add(student.gradeId.toString());
        }
        if (student.academicSession) {
            academicYears.add(student.academicSession);
        }

        if (student.boardId && student.gradeId) {
            boardGradePairs.push({
                boardId: student.boardId,
                gradeId: student.gradeId
            });
        }

        if (student.promotion_record && student.promotion_record.length > 0) {
            student.promotion_record.forEach(record => {
                if (record.gradeId) {
                    gradeIds.add(record.gradeId.toString());
                }
                if (record.sectionId) {
                    sectionIds.add(record.sectionId.toString());
                }
                if (record.academicYear) {
                    academicYears.add(record.academicYear);
                }
            });
        }
    });

    let classIds = new Set();

    if (boardGradePairs.length > 0) {
        const classes = await Class.find({
            $or: boardGradePairs
        }).select("_id").lean();

        classIds = new Set(classes.map(c => c._id.toString()));
    }

    return {
        hasRestriction: true,
        boardIds,
        gradeIds,
        classIds,
        sectionIds,
        academicYears,
        studentIds: auditingAccess.studentIdList.map(id => id.toString())
    };

};

const filterSectionsByAuditingAccess = (sections, filterData) => {
    if (!filterData.hasRestriction) {
        return sections;
    }

    return sections.filter(section => {
        const sectionId = section._id.toString();

        if (filterData.sectionIds.has(sectionId)) {
            return true;
        }

        const classId = section.classId?._id?.toString() || section.classId?.toString();
        if (filterData.classIds.has(classId)) {
            return true;
        }

        return false;
    });
};

const filterGradesByAuditingAccess = (grades, filterData) => {
    if (!filterData.hasRestriction) {
        return grades;
    }

    return grades.filter(grade => {
        const gradeId = grade._id.toString();
        const boardId = grade.boardId?._id?.toString() || grade.boardId?.toString();

        return filterData.gradeIds.has(gradeId) && filterData.boardIds.has(boardId);
    });
};

const filterSectionsWithActiveStatus = (sections, filterData) => {
    const activeSections = sections.filter(section => {
        const cls = section.classId;
        return cls?.boardId &&
            cls?.boardId?.boardStatus === "active" &&
            cls?.gradeId &&
            cls?.gradeId?.gradeStatus === "active";
    });

    return filterSectionsByAuditingAccess(activeSections, filterData);
};

const filterGradesWithActiveStatus = (grades, filterData) => {
    const activeGrades = grades.filter(grade => grade?.boardId?.boardStatus === "active");

    return filterGradesByAuditingAccess(activeGrades, filterData);
};

const filterStudentsByAuditingAccess = (students, filterData) => {
    if (!filterData.hasRestriction) {
        return students;
    }

    return students.filter(student => {
        const studentId = student._id ? student._id.toString() : student.userId?._id?.toString();
        return filterData.studentIds.includes(studentId);
    });
};

const getStudentQueryFilter = (filterData, additionalQuery = {}) => {
    if (!filterData.hasRestriction) {
        return additionalQuery;
    }

    return {
        ...additionalQuery,
        _id: { $in: filterData.studentIds.map(id => new mongoose.Types.ObjectId(id)) }
    };
};

const getSectionQueryFilter = (filterData, additionalQuery = {}) => {
    if (!filterData.hasRestriction) {
        return additionalQuery;
    }

    const sectionIdArray = Array.from(filterData.sectionIds).map(id => new mongoose.Types.ObjectId(id));

    if (sectionIdArray.length === 0) {
        return {
            ...additionalQuery,
            _id: { $in: [] }
        };
    }

    if (additionalQuery._id && additionalQuery._id.$in) {
        const hrtSectionIds = additionalQuery._id.$in.map(id => id.toString());
        const auditingSectionIds = sectionIdArray.map(id => id.toString());

        const intersectionIds = hrtSectionIds.filter(id => auditingSectionIds.includes(id));

        return {
            ...additionalQuery,
            _id: { $in: intersectionIds.map(id => new mongoose.Types.ObjectId(id)) }
        };
    }

    return {
        ...additionalQuery,
        _id: { $in: sectionIdArray }
    };
};

const getGradeQueryFilter = (filterData, additionalQuery = {}) => {
    if (!filterData.hasRestriction) {
        return additionalQuery;
    }

    const gradeIdArray = Array.from(filterData.gradeIds).map(id => new mongoose.Types.ObjectId(id));

    return {
        ...additionalQuery,
        _id: { $in: gradeIdArray }
    };
};

module.exports = {
    getAuditingAccessFilter,
    filterSectionsByAuditingAccess,
    filterGradesByAuditingAccess,
    filterSectionsWithActiveStatus,
    filterGradesWithActiveStatus,
    filterStudentsByAuditingAccess,
    getStudentQueryFilter,
    getSectionQueryFilter,
    getGradeQueryFilter
};