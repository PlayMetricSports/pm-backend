const isEmpty = require("@/validators/main/validator/isEmpty.validator");

const LoginValidator = (request, response, next) => {
    if (isEmpty(request.body?.email)) {
        return response.status(200).json({
            code: 200,
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

    // if (!isEmail(request.body?.email)) {
    //     return response.status(200).json({
    //         code: 200,
    //         success: false,
    //         error: [
    //             {
    //                 field: "email",
    //                 message: "Please enter a valid email your email address."
    //             }
    //         ],
    //         message: ""
    //     });
    // }

    if (isEmpty(request.body?.password)) {
        return response.status(200).json({
            code: 200,
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