const isEmpty = require("@/validators/main/validator/isEmpty.validator");

const UserBlockToggleValidator = async (request, response, next) => {
    let error = [];
    let userBlockStatus = ["yes", "no"];

    if (isEmpty(request.body?.userBlockStatus)) {
        error.push({
            field: "userBlockStatus",
            message: "Please select a user block status."
        })
    }

    if (!userBlockStatus.includes(request.body?.userBlockStatus)) {
        error.push({
            field: "userBlockStatus",
            message: "Please select a valid user block status e.g (yes, no)."
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

module.exports = UserBlockToggleValidator;