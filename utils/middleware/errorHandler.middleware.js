const { createErrorResponse } = require('@/utils/helpers/errorFormat/errorFormatter')
const STATUS_CODES = require('@/utils/helpers/statusCodes.helper')

const errorHandler = (err, res, req, next) => {
    // console.log({ err, res, req, next })
    console.log(res.req)
    // console.log(err)
    console.error("Error:", {
        message: err.message,
        stack: err.stack,
        path: res.req.originalUrl,
        method: res.req.method,
    });

    // -----------------------------
    // ✅ Mongoose Validation Error
    // -----------------------------
    if (err.name === "ValidationError") {
        const errors = Object.values(err.errors).map(e => e.message);
        return res.status(STATUS_CODES.BAD_REQUEST).json(createErrorResponse(STATUS_CODES.BAD_REQUEST, "popup", `VALIDATION_ERROR - ${errors}`))

    }

    // -----------------------------
    // ✅ Duplicate Key Error (E11000)
    // -----------------------------
    if (err.code === 11000) {
        const field = Object.keys(err.keyValue)[0];
        const value = err.keyValue[field];
        return res.status(STATUS_CODES.CONFLICT).json(createErrorResponse(STATUS_CODES.CONFLICT, "popup", `DUPLICATE_ENTRY - ${field} '${value}' already exists`))


    }

    // -----------------------------
    // ✅ Cast Error (Invalid ObjectId)
    // -----------------------------
    if (err.name === "CastError") {
        return res.status(STATUS_CODES.BAD_REQUEST).json(createErrorResponse(STATUS_CODES.BAD_REQUEST, "popup", `INVALID_ID - Invalid ${err.path}: ${err.value}`))
    }
    // -----------------------------
    // ✅ Document Not Found
    // -----------------------------
    if (err.name === "DocumentNotFoundError") {
        return res.status(STATUS_CODES.BAD_REQUEST).json(createErrorResponse(
            STATUS_CODES.BAD_REQUEST,
            "popup",
            "NOT_FOUND - Requested document not found"
        ));
    }

    // -----------------------------
    // ✅ MongoDB Network Error
    // -----------------------------
    if (err.name === "MongoNetworkError") {
        return res.status(STATUS_CODES.SERVICE_UNAVAILABLE).json(createErrorResponse(
            STATUS_CODES.SERVICE_UNAVAILABLE,
            "popup",
            "DB_NETWORK_ERROR - Database connection issue"
        ));
    }

    // -----------------------------
    // ✅ MongoDB Timeout Error
    // -----------------------------
    if (err.name === "MongoServerSelectionError") {
        return res.status(STATUS_CODES.SERVICE_UNAVAILABLE).json(createErrorResponse(
            STATUS_CODES.SERVICE_UNAVAILABLE,
            "popup",
            "DB_TIMEOUT - Database server not reachable"
        ));
    }

    // -----------------------------
    // ✅ BSON / Object parsing error
    // -----------------------------
    if (err.name === "BSONTypeError") {
        return res.status(STATUS_CODES.BAD_REQUEST).json(createErrorResponse(
            STATUS_CODES.BAD_REQUEST,
            "popup",
            `INVALID_OBJECT_FORMAT - ${err.message}`
        ));
    }

    // -----------------------------
    // ✅ JWT Errors
    // -----------------------------
    if (err.name === "JsonWebTokenError") {
        return res.status(STATUS_CODES.UNAUTHORIZED).json(createErrorResponse(
            STATUS_CODES.UNAUTHORIZED,
            "popup",
            "INVALID_TOKEN - Invalid authentication token"
        ));
    }

    if (err.name === "TokenExpiredError") {
        return res.status(STATUS_CODES.UNAUTHORIZED).json(createErrorResponse(
            STATUS_CODES.UNAUTHORIZED,
            "popup",
            "TOKEN_EXPIRED - Authentication token expired"
        ));
    }

    // -----------------------------
    // ✅ Fallback
    // -----------------------------
    return res.status(400).json(createErrorResponse(
        err.statusCode || 500,
        "popup",
        err.message || "INTERNAL_SERVER_ERROR"
    ));

};
module.exports = errorHandler;
