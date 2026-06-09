const isCountryCode = require("@/validators/main/validator/isCountryCode.validator");
const isEmpty = require("@/validators/main/validator/isEmpty.validator");
const isMobileNumber = require("@/validators/main/validator/isMobileNumber.validator");
const STATUS_CODES = require('@/utils/helpers/statusCodes.helper')

const UserUpdateProfileValidator = async (request, response, next) => {
    const error = [];
    console.log("coming here")
    if (isEmpty(request.body?.firstName)) {
        error.push({
            field: "firstName",
            message: "Please enter your first name."
        })
    }

    if (isEmpty(request.body?.lastName)) {
        error.push({
            field: "lastName",
            message: "Please enter your last name."
        })
    }

    if (isEmpty(request.body?.countryCode)) {
        error.push({
            field: "countryCode",
            message: "Please enter your mobile number country code."
        })
    }
    else if (!isCountryCode(request.body?.countryCode)) {
        error.push({
            field: "countryCode",
            message: "Please enter a valid mobile number country code."
        })
    }

    if (isEmpty(request.body?.mobileNumber)) {
        error.push({
            field: "mobileNumber",
            message: "Please enter your mobile number."
        })
    }
    else if (!isMobileNumber(request.body?.mobileNumber)) {
        error.push({
            field: "mobileNumber",
            message: "Please enter a valid mobile number."
        })
    }

    if (error.length > 0) {
        return response.status(STATUS_CODES.BAD_REQUEST).json({
            code: STATUS_CODES.BAD_REQUEST,
            success: false,
            error: error,
            message: ""
        });
    }
    else {
        next();
    }
}

module.exports = UserUpdateProfileValidator;