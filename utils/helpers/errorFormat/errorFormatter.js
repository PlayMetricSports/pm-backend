const createErrorResponse = (code, field, message) => ({
    code,
    success: false,
    error: [{ field, message }],
    message: ""
});

const createSuccessResponse = (code, data, message) => ({
    code,
    success: true,
    data,
    error: [],
    message
});

module.exports = { createSuccessResponse, createErrorResponse }