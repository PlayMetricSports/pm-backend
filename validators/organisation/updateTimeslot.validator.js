const { validateEnumFields } = require("@/validators/main/multivalidator");

const UpdateTimeslotValidator = (request, response, next) => {
    const { timeSlotStatus } = request.body;

    if (timeSlotStatus) {
        const errors = validateEnumFields(
            { timeSlotStatus },
            {},
            { timeSlotStatus: ["active", "inactive"] }
        );

        if (errors.length > 0) {
            return response.status(200).json({
                code: 400,
                success: false,
                error: errors[0].message,
                message: ""
            });
        }
    }

    next();
};

module.exports = UpdateTimeslotValidator;
