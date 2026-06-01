
const User = require("@/models/account/user.model");
const StudentInformation = require("@/models/erp/student/studentInformation.model");

const checkStudent = async (request, response, next) => {
    try {
        const user = await User.findOne({ _id: request?.user?._id });

        if (!user) {
            return response.status(404).json({
                code: 404,
                success: false,
                error: [{ field: "popup", message: "user details not found." }],
                message: ""
            });
        }

        if (user.userType !== "student") {
            return response.status(404).json({
                code: 404,
                success: false,
                error: [{ field: "popup", message: "User type is not valid." }],
                message: ""
            });
        }

        const student = await StudentInformation.findOne({ userId: user?._id }).select("_id academicSession termName termNumber gradeId");

        if (!student) {
            return response.status(404).json({
                code: 404,
                success: false,
                error: [{ field: "popup", message: "Student details not found." }],
                message: ""
            });
        } else {
            request.student = student;
            next();
        }
    } catch (error) {
        return response.status(500).json({
            code: 500,
            success: false,
            error: [
                {
                    field: "popup",
                    message: `Error: ${error}`
                }
            ],
            message: ""
        });
    }
};

module.exports = checkStudent;
