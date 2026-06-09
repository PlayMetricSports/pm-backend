const isEmpty = require("@/validators/main/validator/isEmpty.validator");
const isEmail = require("@/validators/main/validator/isEmail.validator");
const STATUS_CODES = require('@/utils/helpers/statusCodes.helper')

const LoginValidator = (request, response, next) => {
    if (isEmpty(request.body?.email)) {
        return response.status(STATUS_CODES.BAD_REQUEST).json({
            code: STATUS_CODES.BAD_REQUEST,
            success: false,
            error: [
                {
                    field: "email",
                    message: "Please enter your email address ."
                }
            ],
            message: ""
        });
    }

    if (!isEmail(request.body?.email)) {
        return response.status(STATUS_CODES.BAD_REQUEST).json({
            code: STATUS_CODES.BAD_REQUEST,
            success: false,
            error: [
                {
                    field: "email",
                    message: "Please enter a valid email your email address."
                }
            ],
            message: ""
        });
    }

    if (isEmpty(request.body?.password)) {
        return response.status(STATUS_CODES.BAD_REQUEST).json({
            code: STATUS_CODES.BAD_REQUEST,
            success: false,
            error: [
                {
                    field: "password",
                    message: "Please enter your password."
                }
            ],
            message: ""
        });
    }

    next();
}

module.exports = LoginValidator;