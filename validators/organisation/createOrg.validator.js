const { ValidateNonEmptyElements } = require("@/validators/main/multivalidator");

const CreateOrgValidator = (request, response, next) => {
    const { name, domainUrl, organisationNumber, mainOffice, orgSubDomain } = request.body;

    const errors = ValidateNonEmptyElements({
        name,
        domainUrl,
        organisationNumber,
        mainOffice,
        orgSubDomain
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

module.exports = CreateOrgValidator;
