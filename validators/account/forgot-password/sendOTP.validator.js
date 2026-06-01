const isEmail = require("@/validators/main/validator/isEmail.validator");
const isEmpty = require("@/validators/main/validator/isEmpty.validator");

const SendOTPValidator = async (request, response, next) => {
    let error = [];

    if (isEmpty(request.body?.email)) {
        error.push({
            field: "email",
            message: "Please enter your email address."
        })
    }
    else if (!isEmail(request.body?.email)) {
        error.push({
            field: "email",
            message: "Please enter a valid email address e.g example@k12onlineschools.com."
        })
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

module.exports = SendOTPValidator;