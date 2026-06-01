const { createErrorResponse } = require('@/utils/helpers/errorFormat/errorFormatter')

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
        return res.status(400).json(createErrorResponse(400, "popup", `VALIDATION_ERROR - ${errors}`))

    }

    // -----------------------------
    // ✅ Duplicate Key Error (E11000)
    // -----------------------------
    if (err.code === 11000) {
        const field = Object.keys(err.keyValue)[0];
        const value = err.keyValue[field];
        return res.status(400).json(createErrorResponse(409, "popup", `DUPLICATE_ENTRY - ${field} '${value}' already exists`))


    }

    // -----------------------------
    // ✅ Cast Error (Invalid ObjectId)
    // -----------------------------
    if (err.name === "CastError") {
        return res.status(400).json(createErrorResponse(400, "popup", `INVALID_ID - Invalid ${err.path}: ${err.value}`))
    }
    // -----------------------------
    // ✅ Document Not Found
    // -----------------------------
    if (err.name === "DocumentNotFoundError") {
        return res.status(400).json(createErrorResponse(
            404,
            "popup",
            "NOT_FOUND - Requested document not found"
        ));
    }

    // -----------------------------
    // ✅ MongoDB Network Error
    // -----------------------------
    if (err.name === "MongoNetworkError") {
        return res.status(400).json(createErrorResponse(
            503,
            "popup",
            "DB_NETWORK_ERROR - Database connection issue"
        ));
    }

    // -----------------------------
    // ✅ MongoDB Timeout Error
    // -----------------------------
    if (err.name === "MongoServerSelectionError") {
        return res.status(400).json(createErrorResponse(
            503,
            "popup",
            "DB_TIMEOUT - Database server not reachable"
        ));
    }

    // -----------------------------
    // ✅ BSON / Object parsing error
    // -----------------------------
    if (err.name === "BSONTypeError") {
        return res.status(400).json(createErrorResponse(
            400,
            "popup",
            `INVALID_OBJECT_FORMAT - ${err.message}`
        ));
    }

    // -----------------------------
    // ✅ JWT Errors
    // -----------------------------
    if (err.name === "JsonWebTokenError") {
        return res.status(400).json(createErrorResponse(
            401,
            "popup",
            "INVALID_TOKEN - Invalid authentication token"
        ));
    }

    if (err.name === "TokenExpiredError") {
        return res.status(400).json(createErrorResponse(
            401,
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
