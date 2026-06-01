const isEmail = require("@/validators/main/validator/isEmail.validator");
const isEmpty = require("@/validators/main/validator/isEmpty.validator");
const isOTP = require("@/validators/main/validator/isOTP.validator");
const isPassword = require("@/validators/main/validator/isPassword.validator");

const ForgotPasswordValidator = async (request, response, next) => {
    let error = [];

    if (isEmpty(request.body?.code)) {
        error.push({
            field: "code",
            message: "Please enter a otp."
        })
    }
    else if (!isOTP(request.body?.code)) {
        error.push({
            field: "code",
            message: "Please enter a valid otp code."
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

    if (isEmpty(request.body?.password)) {
        error.push({
            field: "password",
            message: "Please enter a new password."
        })
    }
    else if (request.body?.password.length < 8) {
        error.push({
            field: "password",
            message: `Password Length must be 8 or greater.`
        })
    }
    else if (!isPassword(request.body?.password)) {
        error.push({
            field: "password",
            message: `
                <div>
                    <span>Password should contain</span>
                        <ul>
                            <li>lowercase (a-z)</li>
                            <li>and uppercase (A-Z) characters</li>
                            <li>also add numbers (0-9)</li>
                            <li>& special characters (@$!%*?&).</li>
                        </ul>
                </div>
            `
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

module.exports = ForgotPasswordValidator;