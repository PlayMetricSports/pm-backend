const isEmpty = require("@/validators/main/validator/isEmpty.validator");

const UserStatusToggleValidator = async (request, response, next) => {
    let error = [];
    let userStatus = ["active", "inactive"];

    if (isEmpty(request.body?.userStatus)) {
        error.push({
            field: "userStatus",
            message: "Please select a user status."
        })
    }

    if (!userStatus.includes(request.body?.userStatus)) {
        error.push({
            field: "userStatus",
            message: "Please select a valid user status e.g (active, inactive)."
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

module.exports = UserStatusToggleValidator;