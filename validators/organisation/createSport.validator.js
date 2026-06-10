const { ValidateNonEmptyElements, ValidateMongooseObjectIds } = require("@/validators/main/multivalidator");

const CreateSportValidator = (request, response, next) => {
    const { name, orgId, venueId } = request.body;

    let errors = ValidateNonEmptyElements({
        name,
        orgId,
        venueId
    });

    if (errors.length > 0) {
        return response.status(200).json({
            code: 400,
            success: false,
            error: errors[0].message,
            message: ""
        });
    }

    errors = ValidateMongooseObjectIds({ orgId, venueId });

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

module.exports = CreateSportValidator;
