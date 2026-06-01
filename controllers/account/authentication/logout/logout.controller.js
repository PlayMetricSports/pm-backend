const LogController = require("@/controllers/system/logs/log.controller");
// const { sqliteInsert, sqliteDelete } = require("@/utils/connections/database/sqlite");
const { setInCache, deleteFromCache } = require("@/utils/connections/redis/redisClient");

const GetToken = require("@/utils/connections/jwt/getToken.jwt");


const LogoutController = async (request, response) => {
    const tenantId = request.tenantCode || '0001';

    await setInCache("last_request_logout", Date.now().toString());
    const token = GetToken(request);
    const logoutKey = `p-metrix:${process.env.NODE_ENV}:${tenantId}:logout:${token.toString()}`;

    try {
        await setInCache(logoutKey, "true", 86400);
        if (request?.user?._id) await deleteFromCache(request?.user?._id?.toString());

        await LogController(request, "api::logout", "success", "User logged out successfully.");

        return response
            .clearCookie("token")
            .status(200).json({
                code: 200,
                success: true,
                error: [],
                message: "User logged out successfully."
            });
    } catch (error) {
        await LogController(request, "api::logout", "failed", error);

        return response.status(500).json({
            code: 500,
            success: false,
            error: [
                {
                    field: "popup",
                    message: `Error: ${error}`
                }
            ],
            message: ""
        });
    }
}

module.exports = LogoutController;