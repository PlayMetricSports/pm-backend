const { ValidateNonEmptyElements, ValidateMongooseObjectIds } = require("@/validators/main/multivalidator");

const CreateCourtValidator = (request, response, next) => {
    const { orgId, venueId, sportId, isMultipurpose } = request.body;

    let errors = ValidateNonEmptyElements({
        orgId,
        venueId,
        sportId,
        isMultipurpose
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

    if (!Array.isArray(sportId)) {
        return response.status(200).json({
            code: 400,
            success: false,
            error: "Sport ID must be an array.",
            message: ""
        });
    }

    const sportIdErrors = ValidateMongooseObjectIds(sportId);
    if (sportIdErrors.length > 0) {
        return response.status(200).json({
            code: 400,
            success: false,
            error: "One or more Sport IDs are invalid.",
            message: ""
        });
    }

    if (typeof isMultipurpose !== "boolean") {
        return response.status(200).json({
            code: 400,
            success: false,
            error: "Multi Purpose Flag must be a boolean.",
            message: ""
        });
    }

    next();
};

module.exports = CreateCourtValidator;
