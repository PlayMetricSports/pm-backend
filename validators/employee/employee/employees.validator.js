// const isNotZero = require("@/validators/main/validator/isNotZero.validator");

// const EmployeesValidator = (request, response, next) => {
//     if(isNotZero(request.query.page)) {
//         return response.status(200).json({
//             code: 200,
//             success: false,
//             error: [
//                 {
//                     field: "popup",
//                     message: "Please enter a page number greater then 0."
//                 }
//             ],
//             message: ""
//         });
//     }
    
//     next();
// }

// module.exports = EmployeesValidator;

const isNotZero = require("@/validators/main/validator/isNotZero.validator");
const isEmail = require("@/validators/main/validator/isEmail.validator");
const isMobileNumber = require("@/validators/main/validator/isMobileNumber.validator");
const isText = require("@/validators/main/validator/isText.validator");

const EmployeesValidator = (request, response, next) => {
    const { page, firstName, lastName, email, number } = request.query;
    const error = [];

    if (isNotZero(page)) {
        error.push({
            field: "page",
            message: "Please enter a page number greater than 0."
        });
    }

    if (firstName && !isText(firstName)) {
        error.push({
            field: "firstName",
            message: "Please enter a valid first name."
        });
    }

    if (lastName && !isText(lastName)) {
        error.push({
            field: "lastName",
            message: "Please enter a valid last name."
        });
    }

    if (email && !isEmail(email)) {
        error.push({
            field: "email",
            message: "Please enter a valid email address."
        });
    }

    if (number && !isMobileNumber(number)) {
        error.push({
            field: "number",
            message: "Please enter a valid mobile number."
        });
    }
    
    if (error.length > 0) {
        return response.status(200).json({
            code: 200,
            success: false,
            error: error,
            message: ""
        });
    }

    next();
}

module.exports = EmployeesValidator;
