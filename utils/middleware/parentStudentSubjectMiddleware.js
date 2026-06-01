const StudentSubject = require("@/models/erp/student/studentSubject.model");

const ParentStudentSubjectMiddleware = async (request, response, next) => {
    try {
        const { offerSubjectId, studentId } = request.query;

        const studentSubject = await StudentSubject
            .countDocuments({ offeredSubjectId: offerSubjectId, studentId: studentId });

        if (studentSubject == 0) {
            return response.status(200).json({
                code: 404,
                success: false,
                error: [
                    {
                        field: "popup",
                        message: "This subject not assigned to this student."
                    }
                ],
                message: ""
            });
        }
        else {
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

module.exports = ParentStudentSubjectMiddleware;