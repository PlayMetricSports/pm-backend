const { ValidateNonEmptyElements, ValidateMongooseObjectIds } = require("@/validators/main/multivalidator");

const CreateTimeslotValidator = (request, response, next) => {
    const { slotIndex, orgId, startTime, endTime } = request.body;

    let errors = ValidateNonEmptyElements({
        slotIndex,
        orgId,
        startTime,
        endTime
    });

    if (errors.length > 0) {
        return response.status(200).json({
            code: 400,
            success: false,
            error: errors,
            message: ""
        });
    }

    errors = ValidateMongooseObjectIds({ orgId });

    if (errors.length > 0) {
        return response.status(200).json({
            code: 400,
            success: false,
            error: errors,
            message: ""
        });
    }

    next();
};

module.exports = CreateTimeslotValidator;
