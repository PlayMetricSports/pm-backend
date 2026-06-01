
const User = require("@/models/account/user.model");
const Teacher = require("@/models/erp/employee/teacher.model");

const checkTeacher = async (request, response, next) => {
    try {
        const user = await User.findOne({ _id: request?.user?._id }).select("userType");

        if (!user) {
            return response.status(404).json({
                code: 404,
                success: false,
                error: [{ field: "popup", message: "User details not found." }],
                message: ""
            });
        }

        if (user.userType !== "school-employee") {
            return response.status(404).json({
                code: 404,
                success: false,
                error: [{ field: "popup", message: "User type is not valid." }],
                message: ""
            });
        }

        const teacher = await Teacher.findOne({ userId: user?._id }).select("_id hrtLevel");

        if (!teacher) {
            return response.status(404).json({
                code: 404,
                success: false,
                error: [{ field: "popup", message: "Teacher details not found." }],
                message: ""
            });
        } else {
            request.teacher = teacher;

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

module.exports = checkTeacher;
