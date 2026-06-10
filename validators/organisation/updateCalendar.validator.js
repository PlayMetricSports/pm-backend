const { validateEnumFields } = require("@/validators/main/multivalidator");

const UpdateCalendarValidator = (request, response, next) => {
    const { status } = request.body;

    if (status) {
        const errors = validateEnumFields(
            { status },
            {},
            { status: ["scheduled", "current", "cancelled", "finished"] }
        );

        if (errors.length > 0) {
            return response.status(200).json({
                code: 400,
                success: false,
                error: errors,
                message: ""
            });
        }
    }

    next();
};

module.exports = UpdateCalendarValidator;
