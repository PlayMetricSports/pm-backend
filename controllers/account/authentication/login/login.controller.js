const AssignJWTToken = require("@/controllers/account/authentication/login/AssignToken.controller");
const { encryptPassword, encryptData } = require("@/security/rsa.keys.security");
const User = require("@/models/account/user.model");
const LogController = require("@/controllers/system/logs/log.controller");
const CompileActions = require("@/utils/helpers/account/CompileActions");

const AddUserTypeDetails = require("@/utils/helpers/account/AddUserTypeDetails");
// const StudentInformation = require("@/models/erp/student/studentInformation.model");
// const studentAcademicModel = require("@/models/erp/student/studentAcademic.model");
// const StudentSubject = require("@/models/erp/student/studentSubject.model");
// const Assignment = require("@/models/lms/assignment.model");

const employeeModel = require("@/models/employee/employee.model");
// const { QuestionPaperModel } = require("@/models/erp/examination/questionPaper.model");
// const DutyAllocation = require("@/models/erp/securityManagement/dutyAllocation/dutyAllocation.model");
const EMPLOYEEUSERTYPES = ["school-employee", "employee", "school-admin", "admin"]
const mongoose = require("mongoose")
const { createSuccessResponse, createErrorResponse } = require('@/utils/helpers/errorFormat/errorFormatter');

// const getStudentPendingAssignments = async (studentInfoId) => {
//     try {
//         const studentRecord = await studentAcademicModel
//             .findOne({
//                 studentId: studentInfoId,
//                 promotionStatus: "active"
//             })
//             .select("sectionId");

//         if (!studentRecord) return [];

//         const { sectionId } = studentRecord;

//         let subjectList;
//         try {
//             subjectList = await StudentSubject.find({
//                 studentId: studentInfoId,
//                 sectionId: sectionId,
//                 studentSubjectStatus: "active"
//             }).select("offeredSubjectId");
//         } catch (subErr) {
//             console.warn("Could not load subjects:", subErr);
//             return [];
//         }

//         if (!subjectList || subjectList.length === 0) return [];

//         const offeredIds = [];
//         for (let row of subjectList) {
//             if (row?.offeredSubjectId) offeredIds.push(row.offeredSubjectId);
//         }

//         const start = new Date();
//         start.setHours(0, 0, 0, 0);

//         const end = new Date(start);
//         end.setDate(start.getDate() + 10);
//         end.setHours(23, 59, 59, 999);

//         let assignmentRows;
//         try {
//             assignmentRows = await Assignment.find({
//                 offeredSubjectId: { $in: offeredIds },
//                 assignmentCheckingStatus: "Not Started",
//                 assignmentLastDate: { $gte: start, $lte: end }
//             })
//                 .select("assignmentTitle assignmentLastDate offeredSubjectId")
//                 .populate({
//                     path: "offeredSubjectId",
//                     select: "subjectId",
//                     populate: {
//                         path: "subjectId",
//                         select: "subjectName"
//                     }
//                 })
//                 .sort({ assignmentLastDate: 1 })
//                 .lean();
//         } catch (err) {
//             console.error("Error loading pending assignments:", err);
//             return [];
//         }

//         const formatted = [];
//         for (let a of assignmentRows) {
//             formatted.push({
//                 title: a.assignmentTitle,
//                 subjectName: a?.offeredSubjectId?.subjectId?.subjectName || "",
//                 deadline: a.assignmentLastDate
//             });
//         }

//         return formatted;

//     } catch (err) {
//         console.error("Failed to fetch pending assignments:", err);
//         return [];
//     }
// };

async function updateLastLoginTime(userId) {
    await User.findByIdAndUpdate(
        userId,
        {
            $set: {
                lastLoggedInTime: new Date()
            }
        }
    );
}

// async function getStudentProfilePhoto(studentId) {
//     const studentConversionAdmissionDocumentModel = require("@/models/crm/conversion/studentConversionAdmissionDocument.model");
//     const GetStorage = require("@/utils/connections/storage/get.storage");
//     const File = require("@/models/file/file.model");

//     const PHOTO_NAME = "Student Photo"
//     const studentConversion = await studentConversionAdmissionDocumentModel.findOne({ studentId }).select("documents")
//         .populate({
//             path: "documents.documentId",
//             select: ["url"]
//         })
//         .lean()
//     if (studentConversion) {
//         const photo = studentConversion?.documents.find(doc => doc.documentName == PHOTO_NAME) || ""
//         if (photo) {
//             const photoUrl = await File.findById(photo?.documentPath).lean()
//             if (photoUrl?._id) {
//                 if (photoUrl) {
//                     return await GetStorage(photoUrl.url)
//                 }
//             }
//         }
//     }
//     return ""
// }

// async function getOTPinMail(req, email) {
//     const OTPService = require("@/services/otp.service")
//     const MailService = require("@/services/email.service");
//     const otp = OTPService.generateOTP()
//     await MailService.sendOTP(req, email, otp)
//     return otp
// }

// async function checkIfTeacher(id) {
//     const employee = await employeeModel.findOne({ userId: id }).select("userRoleName")
//     return (employee?.userRoleName == "Teacher" || employee?.userRoleName == "teacher")
// }

// async function getTeacherExaminationNotification(userId) {
//     try {
//         const unseenCount = await QuestionPaperModel.countDocuments({
//             paperSetterId: userId,
//             viewStatus: "unseen"
//         });

//         return {
//             unseenCount: unseenCount,
//             hasNotification: unseenCount > 0
//         };
//     } catch (error) {
//         console.error("Error fetching examination notification:", error);
//         return {
//             unseenCount: 0,
//             hasNotification: false
//         };
//     }
// }

// async function getSecurityGuardDutyInfo(userId) {
//     try {

//         const today = new Date();
//         const dateStr = today.toISOString().split('T')[0];

//         const duties = await DutyAllocation.find({
//             "guardDetails": {
//                 $elemMatch: {
//                     userId: userId,
//                     status: "onduty"
//                 }
//             },
//             date: { $gte: dateStr }
//         })
//             .select("date startTime endTime guardDetails")
//             .populate({
//                 path: "guardDetails.gateId",
//                 select: "gateNo gateDetails"
//             })
//             .lean();

//         const result = [];
//         for (const duty of duties) {
//             const guardDetail = duty.guardDetails.find(
//                 g => g.userId.toString() === userId.toString() && g.status === "onduty"
//             );
//             if (guardDetail && guardDetail.gateId) {
//                 result.push({
//                     date: duty.date,
//                     startTime: duty.startTime,
//                     endTime: duty.endTime,
//                     gateNo: guardDetail.gateId.gateNo,
//                     gateDetails: guardDetail.gateId.gateDetails
//                 });
//             }
//         }

//         return result;
//     } catch (error) {
//         console.error("Error fetching security guard duty info:", error);
//         return [];
//     }
// }

// async function checkIfSecurityGuard(userId) {
//     const employee = await employeeModel.findOne({ userId: userId }).select("userRoleName");
//     return employee?.userRoleName === "School-Security-Guard";
// }

// async function getStudentListForParents(userId) {
//     let students = []
//     const Parent = require("@/models/erp/student/parent.model");

//     const parent = await Parent.findOne({ userId }).select("studentIdList")

//     for (const item of parent.studentIdList) {
//         const stdInfoPipeline = [
//             {
//                 $match: { _id: new mongoose.Types.ObjectId(String(item)) }
//             },

//             // Populate userId
//             {
//                 $lookup: {
//                     from: "users",
//                     localField: "userId",
//                     foreignField: "_id",
//                     as: "userId"
//                 }
//             },

//             {
//                 $unwind: {
//                     path: "$userId",
//                     preserveNullAndEmptyArrays: true
//                 }
//             },

//             // Populate gradeId
//             {
//                 $lookup: {
//                     from: "grades",
//                     localField: "gradeId",
//                     foreignField: "_id",
//                     as: "gradeId"
//                 }
//             },

//             {
//                 $unwind: {
//                     path: "$gradeId",
//                     preserveNullAndEmptyArrays: true
//                 }
//             },

//             // Populate boardId inside gradeId
//             {
//                 $lookup: {
//                     from: "boards",
//                     localField: "gradeId.boardId",
//                     foreignField: "_id",
//                     as: "boardId"
//                 }
//             },

//             {
//                 $unwind: {
//                     path: "$boardId",
//                     preserveNullAndEmptyArrays: true
//                 }
//             },

//             // Attach board inside gradeId
//             {
//                 $addFields: {
//                     "gradeId.boardId": {
//                         boardShortName: "$boardId.boardShortName"
//                     }
//                 }
//             },

//             // Final select
//             {
//                 $project: {
//                     userId: {
//                         name: "$userId.name",
//                         email: "$userId.email",
//                         _id: "$userId._id",
//                         userStatus: "$userId.userStatus"
//                     },

//                     gradeId: {
//                         grade: "$gradeId.grade",
//                         boardId: "$gradeId.boardId"
//                     },

//                     admissionNumber: 1,
//                     studentGuardianMobile: 1,
//                     academicSession: 1,
//                     termNumber: 1
//                 }
//             },

//             {
//                 $limit: 1
//             }
//         ]
//         let finalStudent = await StudentInformation.aggregate(stdInfoPipeline)
//         let student = finalStudent[0]
//         // let student = await StudentInformation
//         //     .findOne({ _id: item })
//         //     .select("userId admissionNumber studentGuardianMobile academicSession termNumber")
//         //     .populate({
//         //         path: "userId",
//         //         select: ["name", "email", "_id", "userStatus"]
//         //     })
//         //     .populate({
//         //         path: "gradeId",
//         //         select: ["grade"],
//         //         populate: ({
//         //             path: "boardId",
//         //             select: ["boardShortName"]
//         //         })
//         //     })
//         //     .lean();

//         if (student?.userId?.userStatus == "active") {
//             // let section = await studentAcademicModel.findOne({ studentId: item })
//             //     .select("_id")
//             //     .populate({
//             //         path: "sectionId",
//             //         select: ["sectionName"]
//             //     })
//             //     .lean()
//             const stdAcademicPipeline = [
//                 {
//                     $match: {
//                         studentId: new mongoose.Types.ObjectId(String(item))
//                     }
//                 },

//                 {
//                     $lookup: {
//                         from: "sections",
//                         localField: "sectionId",
//                         foreignField: "_id",
//                         as: "sectionId"
//                     }
//                 },

//                 {
//                     $unwind: {
//                         path: "$sectionId",
//                         preserveNullAndEmptyArrays: true
//                     }
//                 },

//                 {
//                     $project: {
//                         _id: 1,

//                         sectionId: {
//                             sectionName: "$sectionId.sectionName"
//                         }
//                     }
//                 },

//                 {
//                     $limit: 1
//                 }
//             ]
//             let finalSection = await studentAcademicModel.aggregate(stdAcademicPipeline)
//             let section = finalSection[0]
//             if (section) {
//                 student.section = section;
//             }

//             if (student) {
//                 students.push(student);
//             }
//         }
//     }
//     return students
// }


const LoginController = async (request, response) => {
    try {
        console.log(request.body)
        const { email, password } = request.body;
        const encryptedPassword = encryptPassword(password.trim());
        // let otp = ''
        let employeeDetails = {}
        // const studentInformation = await StudentInformation.findOne({ admissionNumber: email }).select("userId")

        const pipeline = [
            {
                $match: {
                    password: encryptedPassword,
                    "loginEmail.address": {
                        $regex: new RegExp(`^${email.trim()}$`, "i")
                    }
                }
            },

            {
                $lookup: {
                    from: "actions",
                    localField: "actionIds",
                    foreignField: "_id",
                    as: "actionIds"
                }
            },

            {
                $lookup: {
                    from: "submodules",
                    localField: "actionIds.subModuleId",
                    foreignField: "_id",
                    as: "subModules"
                }
            },

            {
                $lookup: {
                    from: "modules",
                    localField: "actionIds.moduleId",
                    foreignField: "_id",
                    as: "modules"
                }
            },

            {
                $lookup: {
                    from: "subsystems",
                    localField: "actionIds.subSystemId",
                    foreignField: "_id",
                    as: "subSystems"
                }
            },

            {
                $addFields: {
                    actionIds: {
                        $map: {
                            input: "$actionIds",
                            as: "action",
                            in: {
                                actionKey: "$$action.actionKey",

                                subModuleId: {
                                    $arrayElemAt: [
                                        {
                                            $filter: {
                                                input: "$subModules",
                                                as: "subModule",
                                                cond: {
                                                    $eq: [
                                                        "$$subModule._id",
                                                        "$$action.subModuleId"
                                                    ]
                                                }
                                            }
                                        },
                                        0
                                    ]
                                },

                                moduleId: {
                                    $arrayElemAt: [
                                        {
                                            $filter: {
                                                input: "$modules",
                                                as: "module",
                                                cond: {
                                                    $eq: [
                                                        "$$module._id",
                                                        "$$action.moduleId"
                                                    ]
                                                }
                                            }
                                        },
                                        0
                                    ]
                                },

                                subSystemId: {
                                    $arrayElemAt: [
                                        {
                                            $filter: {
                                                input: "$subSystems",
                                                as: "subSystem",
                                                cond: {
                                                    $eq: [
                                                        "$$subSystem._id",
                                                        "$$action.subSystemId"
                                                    ]
                                                }
                                            }
                                        },
                                        0
                                    ]
                                }
                            }
                        }
                    }
                }
            },

            // Final select
            {
                $project: {
                    name: 1,
                    email: 1,
                    userStatus: 1,
                    userType: 1,
                    userBlockStatus: 1,

                    "actionIds.actionKey": 1,

                    "actionIds.subModuleId.subModuleName": 1,
                    "actionIds.subModuleId.subModuleKey": 1,
                    "actionIds.subModuleId.subModuleIcon": 1,
                    "actionIds.subModuleId.indexing": 1,

                    "actionIds.moduleId.moduleName": 1,
                    "actionIds.moduleId.moduleKey": 1,
                    "actionIds.moduleId.moduleIcon": 1,
                    "actionIds.moduleId.indexing": 1,

                    "actionIds.subSystemId.subSystemName": 1,
                    "actionIds.subSystemId.subSystemKey": 1,
                    "actionIds.subSystemId.subSystemIcon": 1,
                    "actionIds.subSystemId.indexing": 1
                }
            },

            {
                $limit: 1
            }
        ]
        const finalUser = await User.aggregate(pipeline)
        const user = finalUser[0]

        if (!user?._id) {
            await LogController(request, "api::login", "failed", "Their is no account associate with this email.");

            return response.status(200).json(
                createErrorResponse(401, "email", "The email or password that you've entered is incorrect.")
            );
        }

        if (user?.userStatus == "inactive") {
            await LogController(request, "api::login", "failed", "The email or password that you've entered is incorrect.");

            return response.status(200).json(
                createErrorResponse(401, "popup", "Your account is In-active Please contact your admin.")
            );
        }

        if (user?.userBlockStatus == "yes") {
            await LogController(request, "api::login", "failed", "Your account is blocked by admin, Please contect support@k12onlineschools.com.");

            return response.status(200).json(
                createErrorResponse(401, "popup", "Your account is blocked by admin, Please contect support@k12onlineschools.com.")
            );
        }

        const assigned = await AssignJWTToken({ _id: user._id });

        const { actionMenu, permissions } = await CompileActions(user.actionIds);
        const userTypeDetails = await AddUserTypeDetails(user.userType, user._id);

        // //find childrens of parents........
        // let students = [];
        // if (user?.userType == "parent" || user?.userType == "Parent") {
        //     students = await getStudentListForParents(user._id)
        // }

        // let pendingAssignments = [];
        // let studentProfilePhoto;
        // if (user?.userType == "student" || user?.userType == "Student") {
        //     const studentInfo = await StudentInformation.findOne({ userId: user._id }).select("_id");
        //     if (studentInfo) {
        //         studentProfilePhoto = await getStudentProfilePhoto(studentInfo._id)
        //         pendingAssignments = await getStudentPendingAssignments(studentInfo._id);
        //     }
        // }

        let examinationNotification = null;
        // const isTeacher = await checkIfTeacher(user._id);

        if (EMPLOYEEUSERTYPES.includes(user.userType)) {

            const empDetails = await employeeModel.findOne({ userId: user?._id }).select("mobileNumber designation organization employeeCode userRoleName").lean()
            // if (isTeacher) {
            //     // otp = await getOTPinMail(request, user.email);
            //     examinationNotification = await getTeacherExaminationNotification(user._id);
            // }
            employeeDetails = {
                mobileNumber: empDetails?.mobileNumber,
                designation: empDetails?.designation,
                organization: empDetails?.organization,
                employeeCode: empDetails?.employeeCode,
                userRoleName: empDetails?.userRoleName
            }
        }

        // let securityGuardDutyInfo = null;
        // const isSecurityGuard = await checkIfSecurityGuard(user._id);

        // if (isSecurityGuard) {
        //     securityGuardDutyInfo = await getSecurityGuardDutyInfo(user._id);
        // }

        const data =
            // encryptData
            ({
                token: assigned?.data?.token,
                actionMenu: actionMenu,
                permissions: permissions,
                employeeDetails,
                userId: user._id,
                name: user.name,
                email: user?.email?.address,
                emailIsValid: user?.email?.isValid,
                userType: user.userType,
                userTypeDetails: userTypeDetails,
                // students: students,
                // otp: isTeacher ? otp : null,
                // pendingAssignments: pendingAssignments,
                // studentProfilePhoto: user?.userType == "student" ? studentProfilePhoto : null,
                // examinationNotification: isTeacher ? examinationNotification : null,
                // securityGuardDutyInfo: isSecurityGuard ? securityGuardDutyInfo : null,
                isSuperAdmin: user?.isSuperAdmin
            });

        if (assigned?.success) {
            await updateLastLoginTime(user._id);
            await LogController(request, "api::login", "success", "User login successful.", request.clientInfo);
        }
        else {
            await LogController(request, "api::login", "failed", assigned?.error);
        }
        const createFinalResponse = assigned?.success ? createSuccessResponse(assigned?.code, data, assigned?.message) :
            createErrorResponse(assigned?.code, assigned?.error[0].popup, assigned?.error[0].message)

        return response.status(200).json(createFinalResponse);

    } catch (error) {
        await LogController(request, "api::login", "failed", error);

        return response.status(500).json(
            createErrorResponse(500, "popup", `Error: ${error}`)
        );
    }
}

module.exports = LoginController;
