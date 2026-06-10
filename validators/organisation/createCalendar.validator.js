const { ValidateNonEmptyElements, ValidateMongooseObjectIds, ValidateDateFields } = require("@/validators/main/multivalidator");

const CreateCalendarValidator = (request, response, next) => {
    const { orgId, venueId, sportId, timeslotId, date } = request.body;

    let errors = ValidateNonEmptyElements({
        orgId,
        venueId,
        sportId,
        timeslotId,
        date
    });

    if (errors.length > 0) {
        return response.status(200).json({
            code: 400,
            success: false,
            error: errors,
            message: ""
        });
    }

    errors = ValidateMongooseObjectIds({
        orgId,
        venueId,
        sportId,
        timeslotId
    });

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

module.exports = CreateCalendarValidator;
