const Teacher = require("@/models/erp/employee/teacher.model");
const studentInformation = require("@/models/erp/student/studentInformation.model");

const checkTeacherStudent = async (request, response, next) => {
    try {
        const student = await studentInformation.findOne({ userId: request?.user?._id }).select("_id");

        const teacher = await Teacher.findOne({ userId: request?.user?._id }).select("_id");

        if (student || teacher) {
            if (student) request.student = student;
            if (teacher) request.teacher = teacher;

            next();
        }
        else {
            return response.status(200).json({
                code: 401,
                success: false,
                error: [
                    {
                        field: "popup",
                        message: "User role not allowed.",
                    },
                ],
                message: "",
            });
        }

    } catch (error) {
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

module.exports = checkTeacherStudent;
