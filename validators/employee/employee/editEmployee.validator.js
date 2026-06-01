const isCountryCode = require("@/validators/main/validator/isCountryCode.validator");
const isEmpty = require("@/validators/main/validator/isEmpty.validator");
const isMobileNumber = require("@/validators/main/validator/isMobileNumber.validator");

const EditEmployeeValidator = async (request, response, next) => {
    const error = [];
    let organizations = [ "Edovu Ventures", "K12 Online Schools", "EduXLL", "American EduGlobal School"];

    if (isEmpty(request.body?.firstName)) {
        error.push({
            field: "firstName",
            message: "Please enter first name."
        })
    }

    if (isEmpty(request.body?.lastName)) {
        error.push({
            field: "lastName",
            message: "Please enter last name."
        })
    }

    if (isEmpty(request.body?.countryCode)) {
        error.push({
            field: "countryCode",
            message: "Please enter mobile number country code."
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
            message: "Please enter mobile number."
        })
    }
    else if (!isMobileNumber(request.body?.mobileNumber)) {
        error.push({
            field: "mobileNumber",
            message: "Please enter a valid mobile number."
        })
    }

    if(request.body?.organization && !organizations.includes(request.body?.organization)){
        error.push({
            field: "organization",
            message: "Please select a valid organization."
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

module.exports = EditEmployeeValidator;