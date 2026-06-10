const { ValidateNonEmptyElements, ValidateMongooseObjectIds } = require("@/validators/main/multivalidator");

const CreateVenueValidator = (request, response, next) => {
    const { name, orgId, address } = request.body;

    let errors = ValidateNonEmptyElements({
        name,
        orgId,
        address
    });

    if (errors.length > 0) {
        return response.status(200).json({
            code: 400,
            success: false,
            error: errors[0].message,
            message: ""
        });
    }

    errors = ValidateMongooseObjectIds({ orgId });

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

module.exports = CreateVenueValidator;
