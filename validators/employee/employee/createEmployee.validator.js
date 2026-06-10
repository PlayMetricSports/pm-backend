const isCountryCode = require("@/validators/main/validator/isCountryCode.validator");
const isEmail = require("@/validators/main/validator/isEmail.validator");
const isEmpty = require("@/validators/main/validator/isEmpty.validator");
const isMobileNumber = require("@/validators/main/validator/isMobileNumber.validator");
const isNumber = require("@/validators/main/validator/isNumber.validator");

const CreateEmployeeValidator = (request, response, next) => {
    let error = [];
    // let userType = ["employee", "admin", "school-admin"];
    // let organizations = ["Edovu Ventures", "K12 Online Schools", "EduXLL", "American EduGlobal School", "EDUGLOBAL"];

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
    if (isEmpty(request.body?.orgId)) {
        error.push({
            field: "orgId",
            message: "Please enter the organisation."
        })
    }
    if (!isNumber(request.body?.mobileNumber)) {
        error.push({
            field: "mobileNumber",
            message: "Mobile Number should be a number."
        })
    }
    if (!isMobileNumber(String(request.body?.mobileNumber))) {
        error.push({
            field: "mobileNumber",
            message: "Please enter a valid mobile number."
        })
    }
    // else if (!isMobileNumber(request.body?.mobileNumber)) {
    //     error.push({
    //         field: "mobileNumber",
    //         message: "Please enter a valid mobile number."
    //     })
    // }

    if (isEmpty(request.body?.userType)) {
        error.push({
            field: "userType",
            message: "Please select a user type."
        })
    }
    // else if (!userType.includes(request.body?.userType)) {
    //     error.push({
    //         field: "userType",
    //         message: "User type is not valid."
    //     })
    // }

    // if (isEmpty(request.body?.userRole)) {
    //     error.push({
    //         field: "userRole",
    //         message: "Please select a user role."
    //     })
    // }
    // else if (request.body?.userType == "admin" && request.body?.userRole != "admin") {
    //     error.push({
    //         field: "userRole",
    //         message: "Please select a valid user role e.g (admin)."
    //     })
    // }


    // if (request.body?.organization && !organizations.includes(request.body?.organization)) {
    //     error.push({
    //         field: "organization",
    //         message: "Please select a valid organization."
    //     })
    // }

    // if (isEmpty(request.body?.timezone)) {
    //     error.push({
    //         field: "timezone",
    //         message: "Please select a timezone."
    //     })
    // }

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

module.exports = CreateEmployeeValidator;