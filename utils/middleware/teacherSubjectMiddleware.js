const Teacher = require("@/models/erp/employee/teacher.model");
const TeacherSubject = require("@/models/erp/employee/teacherSubjectAllotment.model");

const TeacherSubjectMiddleware = async (request, response, next, terms = "") => {
    try {
        if (request.user.userType !== "school-employee") {
            return response.status(404).json({
                code: 404,
                success: false,
                error: [{ field: "popup", message: "User type is not valid." }],
                message: "",
            });
        }

        const teacher = await Teacher
            .findOne({
                userId: request?.user?._id,
            })
            .select("_id");

        if (!teacher) {
            return response.status(404).json({
                code: 404,
                success: false,
                error: [
                    {
                        field: "popup",
                        message: "Teacher details not found."
                    }
                ],
                message: "",
            });
        }
        else {
            let offerSubjectId = request.params?.offerSubjectId || request.query?.offerSubjectId || request.body?.offerSubjectId;

            const query = {};

            if (terms == "terms") {
                query.teacherId = teacher?._id;
                query.offerSubjectId = offerSubjectId;
            }
            else {
                query.teacherId = teacher?._id;
                query.offerSubjectId = offerSubjectId;
                query.teacherSubjectStatus = "active";
            }
            const teacherSubject = await TeacherSubject
                .findOne({ ...query })
                .select("_id offerSubjectId subjectId");

            if (!teacherSubject) {
                return response.status(200).json({
                    code: 404,
                    success: false,
                    error: [
                        {
                            field: "popup",
                            message: "Teacher do not have a valid subject"
                        },
                    ],
                    message: "",
                });
            }

            request.teacher = teacher;
            request.teacherSubject = teacherSubject;

            next();
        }
    }
    catch (error) {
        return response.status(500).json({
            code: 500,
            success: false,
            error: [
                {
                    field: "popup",
                    message: `Error: ${error}`,
                },
            ],
            message: "",
        });
    }
};

module.exports = TeacherSubjectMiddleware;
