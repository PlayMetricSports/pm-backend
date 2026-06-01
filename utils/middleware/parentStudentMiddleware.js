const StudentInformation = require("@/models/erp/student/studentInformation.model");

const ParentStudentMiddleware = async (request, response, next) => {
    try {
        const { studentId } = request.query;
        const { parentId } = request.body;

        const student = await StudentInformation
            .findOne({ _id: studentId, parentId: parentId })
            .select("academicSession batchYear termNumber termName boardId gradeId currentFeesPlanId");

        if (!student) {
            return response.status(200).json({
                code: 404,
                success: false,
                error: [
                    {
                        field: "popup",
                        message: "This student is not related to your account."
                    }
                ],
                message: ""
            });
        }
        else {
            request.body.student = student;
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
                    message: `Error: ${error}`
                }
            ],
            message: ""
        });
    }
}

module.exports = ParentStudentMiddleware;