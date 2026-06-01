/* eslint-disable no-prototype-builtins */
const sanitizeHtml = require("sanitize-html");

const SanitizeRequestBody = (request, response, next) => {
    if (request.body) {
        for (let key in request.body) {
            if (request.body.hasOwnProperty(key)) {
                request.body[key] = sanitizeInput(request.body[key]);
            }
        }
    }
    next();
}

const sanitizeInput = (input) => {
    if (typeof input == "string") {
        input = input.trim();
        input = sanitizeHtml(input);
    }

    return input;
}

module.exports = SanitizeRequestBody;
