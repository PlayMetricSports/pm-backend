const isEmpty = require("@/validators/main/validator/isEmpty.validator");
const isPassword = require("@/validators/main/validator/isPassword.validator");

const UserChangePasswordValidator = async (request, response, next) => {
    const error = [];

    if (isEmpty(request.body?.oldPassword)) {
        error.push({
            field: "oldPassword",
            message: "Please enter your old password."
        })
    }

    if (isEmpty(request.body?.newPassword)) {
        error.push({
            field: "newPassword",
            message: "Please enter a new password."
        })
    }
    else if (request.body?.newPassword.length < 8) {
        error.push({
            field: "newPassword",
            message: `New Password Length must be 8 or greater.`
        })
    }
    else if (!isPassword(request.body?.newPassword)) {
        error.push({
            field: "newPassword",
            message: `
                <div>
                    <span>Password should contain atleast</span>
                        <ul>
                            <li>One lowercase letter (a-z)</li>
                            <li>One uppercase (A-Z) characters</li>
                            <li>also add a numbers (0-9)</li>
                            <li>& a special characters e.g (@$!%*?&).</li>
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

module.exports = UserChangePasswordValidator;