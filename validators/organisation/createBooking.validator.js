const { ValidateNonEmptyElements, ValidateMongooseObjectIds, ValidateDateFields } = require("@/validators/main/multivalidator");

const CreateBookingValidator = (request, response, next) => {
    const { orgId, venueId, sportId, courtId, startTime, endTime, bookingDate } = request.body;

    let errors = ValidateNonEmptyElements({
        orgId,
        venueId,
        sportId,
        startTime,
        endTime,
        bookingDate,
        courtId
    });

    if (errors.length > 0) {
        return response.status(200).json({
            code: 400,
            success: false,
            error: errors[0].message,
            message: ""
        });
    }

    errors = ValidateMongooseObjectIds({
        orgId,
        venueId,
        sportId,
        courtId
    });

    if (errors.length > 0) {
        return response.status(200).json({
            code: 400,
            success: false,
            error: errors[0].message,
            message: ""
        });
    }

    next();
};

module.exports = CreateBookingValidator;
