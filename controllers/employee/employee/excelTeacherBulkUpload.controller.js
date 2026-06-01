const xlsx = require("xlsx");

const User = require("@/models/account/user.model");
const UserRole = require("@/models/account/userRole.model");
const UserDepartment = require("@/models/account/user-department.model");
const Employee = require("@/models/employee/employee.model");

const File = require("@/models/file/file.model");

const { encryptPassword } = require("@/security/rsa.keys.security");
const storage = require("@/utils/connections/storage/connect.storage");
const RollbackManager = require("@/services/rollBack.service");

const DEFAULT_TIMEZONE = "(UTC+05:30) Kolkata, Mumbai, New Delhi";
const DEFAULT_COUNTRY_CODE = "+91";
const DEFAULT_DEPARTMENT_KEY = "academic";

function trimValue(value) {
    if (value === null || value === undefined) return "";
    return value.toString().trim();
}

function trimAndLower(value) {
    return trimValue(value).toLowerCase();
}

function capitalizeWords(value) {
    if (!value) return "";
    return value
        .toString()
        .trim()
        .toLowerCase()
        .split(" ")
        .filter(Boolean)
        .map(function (word) {
            return word.charAt(0).toUpperCase() + word.slice(1);
        })
        .join(" ");
}

function escapeRegex(value) {
    return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function normalizeSectionName(value) {
    var sectionName = trimValue(value);
    if (!sectionName) return "";
    return sectionName.replace(/^section\s+/i, "").trim();
}

function normalizeKey(value) {
    return trimValue(value).replace(/[\s_-]/g, "").toLowerCase();
}

function getRowValue(row, possibleKeys) {
    if (!row) return "";

    var rowKeys = Object.keys(row);

    for (var i = 0; i < possibleKeys.length; i++) {
        var possibleKey = normalizeKey(possibleKeys[i]);

        for (var j = 0; j < rowKeys.length; j++) {
            var actualKey = rowKeys[j];

            if (normalizeKey(actualKey) === possibleKey) {
                return trimValue(row[actualKey]);
            }
        }
    }

    return "";
}

function buildNameObject(firstName, middleName, lastName) {
    return {
        firstName: capitalizeWords(firstName),
        middleName: capitalizeWords(middleName),
        lastName: capitalizeWords(lastName),
    };
}

function isValidEmail(email) {
    if (!email) return false;
    var emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    return emailRegex.test(email);
}

function parseSubjectList(subjectsRawValue) {
    if (!subjectsRawValue) return [];

    var seen = new Set();
    var parsedSubjects = [];

    var items = subjectsRawValue.toString().split(",");

    for (var i = 0; i < items.length; i++) {
        var subjectName = trimValue(items[i]);
        var normalized = trimAndLower(subjectName);

        if (!subjectName || seen.has(normalized)) continue;

        seen.add(normalized);
        parsedSubjects.push(subjectName);
    }

    return parsedSubjects;
}

function parseExcelBuffer(fileBuffer) {
    var workbook = xlsx.read(fileBuffer, { type: "buffer", cellDates: true });
    var firstSheetName = workbook.SheetNames[0];
    var worksheet = workbook.Sheets[firstSheetName];
    return xlsx.utils.sheet_to_json(worksheet, { defval: "" });
}

async function downloadFileFromStorage(fileUrl) {
    var params = {
        Bucket: process.env.R2_BUCKET,
        Key: fileUrl,
    };

    var fileObject = await storage.getObject(params).promise();
    return fileObject.Body;
}

function getTeacherRowData(row) {
    return {
        firstName: getRowValue(row, ["teacher name", "teacherName", "firstName", "firstname"]),
        middleName: getRowValue(row, ["middle name", "middleName", "middlename"]),
        lastName: getRowValue(row, ["last name", "lastName", "lastname"]),
        userRole: getRowValue(row, ["user role", "userRole", "role"]),
        organization: getRowValue(row, ["organization name", "organizationname", "organizationName", "organization"]),
        employeeCode: getRowValue(row, ["employee code", "employeecode", "employeeCode"]),
        email: trimAndLower(getRowValue(row, ["email"])),
        password: getRowValue(row, ["password"]),
        mobileNumber: getRowValue(row, ["mobile number", "mobilenumber", "mobileNumber", "phoneNumber"]),
        academicSession: getRowValue(row, ["academic session", "academicSession", "academicyear"]),
        board: getRowValue(row, ["board", "boardShortName", "boardName"]),
        grade: getRowValue(row, ["grade", "gradeName"]),
        section: getRowValue(row, ["section", "sectionName"]),
        subjectListRaw: getRowValue(row, ["subject list", "subjectlist", "subjectList", "subjects"]),
        stateStaffCode: getRowValue(row, ["state staff code", "stateStaffCode", "statestaffcode"]),
        nationalCode: getRowValue(row, ["national code", "nationalCode", "nationalcode"]),
    };
}

async function findUserRoleByInput(userRoleInput, roleCache) {
    var normalizedInput = trimAndLower(userRoleInput);
    if (!normalizedInput) return null;

    if (roleCache.has(normalizedInput)) {
        return roleCache.get(normalizedInput);
    }

    var userRole = await UserRole.findOne({
        userRoleStatus: "active",
        $or: [
            { userRoleKey: { $regex: new RegExp("^" + escapeRegex(normalizedInput) + "$", "i") } },
            { userRoleName: { $regex: new RegExp("^" + escapeRegex(normalizedInput) + "$", "i") } },
        ],
    }).select("_id userRoleName userRoleKey userType actionIds").lean();

    if (!userRole) return null;

    roleCache.set(normalizedInput, userRole);
    return userRole;
}

async function findBoardByInput(boardValue, boardCache) {
    var normalizedInput = trimAndLower(boardValue);
    if (!normalizedInput) return null;

    if (boardCache.has(normalizedInput)) {
        return boardCache.get(normalizedInput);
    }

    var board = await Board.findOne({
        boardStatus: "active",
        $or: [
            { boardShortName: { $regex: new RegExp("^" + escapeRegex(normalizedInput) + "$", "i") } },
            { boardName: { $regex: new RegExp("^" + escapeRegex(normalizedInput) + "$", "i") } },
        ],
    }).select("_id").lean();

    if (!board) return null;

    boardCache.set(normalizedInput, board._id);
    return board._id;
}

async function findGradeByInput(gradeValue, boardId, gradeCache) {
    var normalizedInput = trimAndLower(gradeValue);
    if (!normalizedInput || !boardId) return null;

    var cacheKey = normalizedInput + "_" + boardId.toString();

    if (gradeCache.has(cacheKey)) {
        return gradeCache.get(cacheKey);
    }

    var grade = await Grade.findOne({
        boardId: boardId,
        gradeStatus: "active",
        grade: { $regex: new RegExp("^" + escapeRegex(normalizedInput) + "$", "i") },
    }).select("_id").lean();

    if (!grade) return null;

    gradeCache.set(cacheKey, grade._id);
    return grade._id;
}

async function findClassByBoardAndGrade(boardId, gradeId, classCache) {
    if (!boardId || !gradeId) return null;

    var cacheKey = boardId.toString() + "_" + gradeId.toString();

    if (classCache.has(cacheKey)) {
        return classCache.get(cacheKey);
    }

    var classRecord = await Class.findOne({
        boardId: boardId,
        gradeId: gradeId,
    }).select("_id").lean();

    if (!classRecord) return null;

    classCache.set(cacheKey, classRecord._id);
    return classRecord._id;
}

async function findSectionByInput(sectionValue, classId, sectionCache) {
    var rawSectionName = trimValue(sectionValue);
    var normalizedSectionName = trimAndLower(rawSectionName);
    var shortSectionName = trimAndLower(normalizeSectionName(rawSectionName));

    if (!normalizedSectionName || !classId) return null;

    var cacheKey = normalizedSectionName + "_" + classId.toString();

    if (sectionCache.has(cacheKey)) {
        return sectionCache.get(cacheKey);
    }

    var section = await Section.findOne({
        classId: classId,
        sectionStatus: "active",
        $or: [
            { sectionName: { $regex: new RegExp("^" + escapeRegex(normalizedSectionName) + "$", "i") } },
            { sectionName: { $regex: new RegExp("^" + escapeRegex(shortSectionName) + "$", "i") } },
        ],
    }).select("_id classId sectionName academicYear termName termNumber batchYear").lean();

    if (!section) return null;

    sectionCache.set(cacheKey, section);
    return section;
}

async function findSubjectByInput(subjectName, subjectCache) {
    var normalizedInput = trimAndLower(subjectName);
    if (!normalizedInput) return null;

    if (subjectCache.has(normalizedInput)) {
        return subjectCache.get(normalizedInput);
    }

    var subject = await Subject.findOne({
        subjectCode: { $regex: new RegExp("^" + escapeRegex(normalizedInput) + "$", "i") },
    }).select("_id subjectName").lean();

    if (!subject) return null;

    subjectCache.set(normalizedInput, subject);
    return subject;
}

async function resolveSubjectList(subjectNames, subjectCache) {
    var resolvedSubjects = [];
    var missingSubjects = [];

    for (var i = 0; i < subjectNames.length; i++) {
        var subjectName = subjectNames[i];
        var subject = await findSubjectByInput(subjectName, subjectCache);

        if (!subject) {
            missingSubjects.push(subjectName);
            continue;
        }

        resolvedSubjects.push({
            subjectId: subject._id,
            subjectName: subject.subjectName || subjectName,
        });
    }

    if (missingSubjects.length > 0) {
        return {
            error: "Subjects not found: " + missingSubjects.join(", "),
        };
    }

    return {
        subjects: resolvedSubjects,
    };
}

async function validateAndResolveRow(row, roleCache, boardCache, gradeCache, classCache, sectionCache, subjectCache) {
    var rowData = getTeacherRowData(row);

    if (!rowData.firstName) {
        return { error: "Teacher first name is required." };
    }

    if (!rowData.email) {
        return { error: "Email is required." };
    }

    if (!isValidEmail(rowData.email)) {
        return { error: "Invalid email address." };
    }

    // if (!rowData.mobileNumber) {
    //     return { error: "Mobile number is required." };
    // }

    if (!rowData.userRole) {
        return { error: "User role is required." };
    }

    if (!rowData.board) {
        return { error: "Board is required." };
    }

    if (!rowData.grade) {
        return { error: "Grade is required." };
    }

    if (!rowData.section) {
        return { error: "Section is required." };
    }

    var subjectNames = parseSubjectList(rowData.subjectListRaw);

    // if (subjectNames.length === 0) {
    //     return { error: "At least one subject is required." };
    // }

    var userRole = await findUserRoleByInput(rowData.userRole, roleCache);
    if (!userRole) {
        return { error: "User role '" + rowData.userRole + "' not found." };
    }

    var boardId = await findBoardByInput(rowData.board, boardCache);
    if (!boardId) {
        return { error: "Board '" + rowData.board + "' not found." };
    }

    var gradeId = await findGradeByInput(rowData.grade, boardId, gradeCache);
    if (!gradeId) {
        return { error: "Grade '" + rowData.grade + "' not found for the given board." };
    }

    var classId = await findClassByBoardAndGrade(boardId, gradeId, classCache);
    if (!classId) {
        return { error: "Class not found for the given board and grade." };
    }

    var section = await findSectionByInput(rowData.section, classId, sectionCache);
    if (!section) {
        return { error: "Active section '" + rowData.section + "' not found." };
    }

    if (rowData.academicSession && rowData.academicSession !== section.academicYear) {
        return {
            error: "Academic session '" + rowData.academicSession + "' does not match section academic year '" + section.academicYear + "'.",
        };
    }

    var resolvedSubjects = { subjects: [] };

    if (subjectNames.length > 0) {
        var subjectResult = await resolveSubjectList(subjectNames, subjectCache);
        if (subjectResult.error) {
            return { error: subjectResult.error };
        }
        resolvedSubjects = subjectResult;
    }

    return {
        rowData: rowData,
        userRole: userRole,
        boardId: boardId,
        gradeId: gradeId,
        classId: classId,
        section: section,
        subjects: resolvedSubjects.subjects,
    };
}

async function findExistingNonParentUserByEmail(email) {
    return User.findOne({
        userType: { $ne: "parent" },
        $or: [
            { "loginEmail.address": email },
            { "email.address": email },
        ],
    }).select("_id userRoleId").lean();
}

function buildUserPayload(rowData, userRole, departmentId) {
    var rawPassword = rowData.password || process.env.USER_PASSWORD || "Edovu@123#";

    return {
        name: buildNameObject(rowData.firstName, rowData.middleName, rowData.lastName),
        email: { address: rowData.email },
        loginEmail: { address: rowData.email },
        password: encryptPassword(rawPassword),
        userType: userRole.userType,
        timezone: DEFAULT_TIMEZONE,
        userRoleId: userRole._id,
        userDepartmentId: departmentId,
        actionIds: userRole.actionIds || [],
    };
}

function buildEmployeePayload(userId, rowData, userRole) {
    var payload = {
        organization: rowData.organization || undefined,
        mobileNumber: {
            countryCode: DEFAULT_COUNTRY_CODE,
            number: rowData.mobileNumber,
        },
        userId: userId,
        userRoleId: userRole._id,
        userRoleName: userRole.userRoleName,
        timezone: DEFAULT_TIMEZONE,
    };

    if (rowData.mobileNumber) {
        payload.mobileNumber = {
            countryCode: DEFAULT_COUNTRY_CODE,
            number: rowData.mobileNumber,
        };
    }

    if (rowData.employeeCode) {
        payload.employeeCode = rowData.employeeCode;
    }

    return payload;
}

async function findOrCreateTeacherHierarchy(resolvedRow, departmentId, rollback) {
    var rowData = resolvedRow.rowData;
    var userRole = resolvedRow.userRole;

    var existingUser = await findExistingNonParentUserByEmail(rowData.email);

    var userId = null;
    var employeeId = null;
    var teacherId = null;
    var employeeCode = rowData.employeeCode || "";

    if (existingUser) {
        if (existingUser.userRoleId && existingUser.userRoleId.toString() !== userRole._id.toString()) {
            return {
                error: "Email " + rowData.email + " already belongs to another user role.",
            };
        }

        userId = existingUser._id;
    } else {
        var createdUser = await User.create(buildUserPayload(rowData, userRole, departmentId));
        rollback.add(async function () {
            await User.deleteOne({ _id: createdUser._id });
        });
        userId = createdUser._id;
    }

    var existingEmployee = await Employee.findOne({ userId: userId }).select("_id employeeCode userRoleId").lean();

    if (existingEmployee) {
        if (existingEmployee.userRoleId && existingEmployee.userRoleId.toString() !== userRole._id.toString()) {
            return {
                error: "Employee role does not match the excel user role for email " + rowData.email + ".",
            };
        }

        employeeId = existingEmployee._id;
        employeeCode = existingEmployee.employeeCode || employeeCode;
    } else {
        var createdEmployee = await Employee.create(buildEmployeePayload(userId, rowData, userRole));
        rollback.add(async function () {
            await Employee.deleteOne({ _id: createdEmployee._id });
        });
        employeeId = createdEmployee._id;
        employeeCode = createdEmployee.employeeCode || employeeCode;
    }

    var existingTeacher = await Teacher.findOne({
        $or: [
            { userId: userId },
            { employeeId: employeeId },
        ],
    }).select("_id").lean();

    if (existingTeacher) {
        teacherId = existingTeacher._id;

        var teacherUpdatePayload = {};

        if (rowData.stateStaffCode) {
            teacherUpdatePayload.stateStaffCode = rowData.stateStaffCode;
        }

        if (rowData.nationalCode) {
            teacherUpdatePayload.nationalCode = rowData.nationalCode;
        }

        if (Object.keys(teacherUpdatePayload).length > 0) {
            await Teacher.updateOne({ _id: teacherId }, { $set: teacherUpdatePayload });
        }

    } else {
        if (trimAndLower(userRole.userRoleName) !== "teacher") {
            return {
                error: "Teacher profile not found for role '" + userRole.userRoleName + "'.",
            };
        }

        var teacherPayload = {
            userId: userId,
            employeeId: employeeId,
        };

        if (rowData.stateStaffCode) {
            teacherPayload.stateStaffCode = rowData.stateStaffCode;
        }

        if (rowData.nationalCode) {
            teacherPayload.nationalCode = rowData.nationalCode;
        }

        var createdTeacher = await Teacher.create(teacherPayload);

        rollback.add(async function () {
            await Teacher.deleteOne({ _id: createdTeacher._id });
        });

        teacherId = createdTeacher._id;
    }

    return {
        userId: userId,
        employeeId: employeeId,
        teacherId: teacherId,
        employeeCode: employeeCode,
    };
}

async function findOrCreateOfferedSubject(subjectId, classId, section, rollback) {
    var existingOfferedSubject = await OfferSubject.findOne({
        subjectId: subjectId,
        sectionId: section._id,
        academicYear: section.academicYear,
        termName: section.termName,
        termNumber: Number(section.termNumber),
    }).select("_id").lean();

    if (existingOfferedSubject) {
        return existingOfferedSubject._id;
    }

    var createdOfferedSubject = await OfferSubject.create({
        subjectId: subjectId,
        classId: classId,
        sectionId: section._id,
        academicYear: section.academicYear,
        termName: section.termName,
        termNumber: Number(section.termNumber),
        offerSubjectStatus: "active",
        chapters: [],
    });

    rollback.add(async function () {
        await OfferSubject.deleteOne({ _id: createdOfferedSubject._id });
    });

    return createdOfferedSubject._id;
}

async function assignTeacherSubjects(teacherId, resolvedRow, rollback) {
    var section = resolvedRow.section;
    var boardId = resolvedRow.boardId;
    var gradeId = resolvedRow.gradeId;
    var classId = resolvedRow.classId;
    var subjects = resolvedRow.subjects;

    var assignedSubjects = [];
    var skippedSubjects = [];

    if (!subjects || subjects.length === 0) {
        return {
            assignedSubjects: assignedSubjects,
            skippedSubjects: skippedSubjects,
        };
    }

    for (var i = 0; i < subjects.length; i++) {
        var subject = subjects[i];

        var offerSubjectId = await findOrCreateOfferedSubject(subject.subjectId, classId, section, rollback);

        var activeTeacherSubjects = await TeacherSubject.find({
            offerSubjectId: offerSubjectId,
            teacherSubjectStatus: "active",
        }).select("_id teacherId").lean();

        var alreadyAssignedToSameTeacher = activeTeacherSubjects.some(function (item) {
            return item.teacherId && item.teacherId.toString() === teacherId.toString();
        });

        if (alreadyAssignedToSameTeacher) {
            skippedSubjects.push(subject.subjectName);
            continue;
        }

        if (activeTeacherSubjects.length > 0) {
            var oldTeacherSubjectIds = activeTeacherSubjects.map(function (item) {
                return item._id;
            });

            await TeacherSubject.updateMany(
                { _id: { $in: oldTeacherSubjectIds } },
                { $set: { teacherSubjectStatus: "changed" } }
            );

            rollback.add(async function () {
                await TeacherSubject.updateMany(
                    { _id: { $in: oldTeacherSubjectIds } },
                    { $set: { teacherSubjectStatus: "active" } }
                );
            });
        }

        var createdTeacherSubject = await TeacherSubject.create({
            teacherId: teacherId,
            subjectId: subject.subjectId,
            offerSubjectId: offerSubjectId,
            academicSessionYear: section.academicYear,
            termName: section.termName,
            termNumber: Number(section.termNumber),
            boardId: boardId,
            gradeId: gradeId,
            classId: classId,
            sectionId: section._id,
            batchYear: section.batchYear,
            teacherSubjectStatus: "active",
        });

        rollback.add(async function () {
            await TeacherSubject.deleteOne({ _id: createdTeacherSubject._id });
        });

        assignedSubjects.push(subject.subjectName);
    }

    return {
        assignedSubjects: assignedSubjects,
        skippedSubjects: skippedSubjects,
    };
}

async function processSingleTeacherRow(row, rowNumber, departmentId, roleCache, boardCache, gradeCache, classCache, sectionCache, subjectCache) {
    var rollback = new RollbackManager();

    try {
        var resolvedRow = await validateAndResolveRow(
            row,
            roleCache,
            boardCache,
            gradeCache,
            classCache,
            sectionCache,
            subjectCache
        );

        if (resolvedRow.error) {
            return {
                success: false,
                row: rowNumber,
                error: "Row " + rowNumber + ": " + resolvedRow.error,
            };
        }

        var hierarchy = await findOrCreateTeacherHierarchy(resolvedRow, departmentId, rollback);

        if (hierarchy.error) {
            await rollback.rollback();
            return {
                success: false,
                row: rowNumber,
                error: "Row " + rowNumber + ": " + hierarchy.error,
            };
        }

        var assignmentResult = await assignTeacherSubjects(hierarchy.teacherId, resolvedRow, rollback);

        rollback.clear();

        var result = {
            success: true,
            row: rowNumber,
            email: resolvedRow.rowData.email,
            employeeCode: hierarchy.employeeCode || "",
            userId: hierarchy.userId,
            employeeId: hierarchy.employeeId,
            teacherId: hierarchy.teacherId,
            assignedSubjects: assignmentResult.assignedSubjects,
        };

        if (assignmentResult.skippedSubjects.length > 0) {
            result.skippedSubjects = assignmentResult.skippedSubjects;
        }

        return result;
    } catch (error) {
        await rollback.rollback();

        return {
            success: false,
            row: rowNumber,
            error: "Row " + rowNumber + ": " + error.message,
        };
    }
}

var BulkTeacherUploadController = async function (request, response) {
    try {
        // if (!request.user || !request.user._id) {
        //     return response.status(200).json({
        //         code: 401,
        //         success: false,
        //         error: [{ field: "popup", message: "Unauthorized. Please login and try again." }],
        //         message: "",
        //     });
        // }

        var fileId = request.body.file;

        if (!fileId) {
            return response.status(200).json({
                code: 400,
                success: false,
                error: [{ field: "file", message: "File is required." }],
                message: "",
            });
        }

        var fileRecord = await File.findById(fileId).select("url extension").lean();

        if (!fileRecord) {
            return response.status(200).json({
                code: 404,
                success: false,
                error: [{ field: "file", message: "Uploaded file not found." }],
                message: "",
            });
        }

        var allowedExtensions = ["xlsx", "csv"];

        if (!allowedExtensions.includes(fileRecord.extension)) {
            return response.status(200).json({
                code: 400,
                success: false,
                error: [{ field: "file", message: "Only xlsx and csv files are allowed." }],
                message: "",
            });
        }

        var department = await UserDepartment.findOne({
            departmentKey: DEFAULT_DEPARTMENT_KEY,
            departmentStatus: "active",
        }).select("_id").lean();

        if (!department) {
            return response.status(200).json({
                code: 400,
                success: false,
                error: [{ field: "popup", message: "Academic department not found." }],
                message: "",
            });
        }

        var fileBuffer = await downloadFileFromStorage(fileRecord.url);
        var rows = parseExcelBuffer(fileBuffer);

        if (!rows || rows.length === 0) {
            return response.status(200).json({
                code: 400,
                success: false,
                error: [{ field: "file", message: "File is empty or has no valid rows." }],
                message: "",
            });
        }

        var roleCache = new Map();
        var boardCache = new Map();
        var gradeCache = new Map();
        var classCache = new Map();
        var sectionCache = new Map();
        var subjectCache = new Map();

        var successList = [];
        var failedList = [];

        for (var rowIndex = 0; rowIndex < rows.length; rowIndex++) {
            var currentRow = rows[rowIndex];
            var currentRowNumber = rowIndex + 2;

            var result = await processSingleTeacherRow(
                currentRow,
                currentRowNumber,
                department._id,
                roleCache,
                boardCache,
                gradeCache,
                classCache,
                sectionCache,
                subjectCache
            );

            if (result.success) {
                successList.push(result);
            } else {
                failedList.push(result);
            }
        }

        return response.status(200).json({
            code: 200,
            success: true,
            data: {
                totalRows: rows.length,
                successCount: successList.length,
                failedCount: failedList.length,
                successList: successList,
                failedList: failedList,
            },
            error: [],
            message: "Bulk upload completed. " + successList.length + " succeeded, " + failedList.length + " failed.",
        });
    } catch (error) {
        return response.status(500).json({
            code: 500,
            success: false,
            error: [{ field: "popup", message: "Error: " + error.message }],
            message: "",
        });
    }
};

module.exports = BulkTeacherUploadController;