/* eslint-disable no-prototype-builtins */
const sanitizeHtml = require("sanitize-html");

const SanitizeRequestParam = (request, response, next) => {
    if (request.query) {
        for (let key in request.query) {
            if (request.query.hasOwnProperty(key)) {
                request.query[key] = sanitizeInput(request.query[key]);
            }
        }
    }
    next();
}

const sanitizeInput = (input) => {
    input = input.trim();
    input = sanitizeHtml(input);
    return input;
}

module.exports = SanitizeRequestParam;

