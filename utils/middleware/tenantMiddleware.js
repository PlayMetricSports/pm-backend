module.exports = function tenantMiddleware(req, res, next) {
    const tenantCode = req.headers["x-school-code"];

    if (!tenantCode) {
        return res.status(400).json({
            success: false,
            message: "Missing x-school-code header",
        });
    }

    req.tenantCode = tenantCode.toUpperCase(); // normalize
    next();
};