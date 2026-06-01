const isEmpty = require("@/validators/main/validator/isEmpty.validator");
const { ValidateNonEmptyElements } = require("@/validators/main/validator/multivalidator");

const CreateSubsystemValidator = async (request, response, next) => {
    let error = [];

    const { subSystemName, subSystemKey, subSystemIcon } = request.body;


    const validateError = ValidateNonEmptyElements({ subSystemName, subSystemKey, subSystemIcon })
    error.push(...validateError)

    if (isEmpty(subSystemKey)) {
        const subSystemKey = subSystemName.replaceAll(" ", "-").toLowerCase();
        request.body.subSystemKey = subSystemKey;
    }

    if (error.length > 0) {
        return response.status(200).json({
            code: 200,
            success: false,
            error: error,
            message: ""
        });
    }
    else {
        next();
    }
}

module.exports = CreateSubsystemValidator;