require("dotenv").config();

const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");

const GetToken = require("@/utils/connections/jwt/getToken.jwt");
const { getFromCache, setInCache } = require("@/utils/connections/redis/redisClient");

const User = require("@/models/account/user.model");
const Employee = require("@/models/employee/employee.model");

const EMPLOYEEUSERTYPES = new Set(["employee", "admin"]);
const STATUS_CODES = require('@/utils/helpers/statusCodes.helper')


const Middleware = async (request, response, next) => {
    const tenantId = request.tenantCode || '0001';
    const token = GetToken(request);
    try {
        if (!token) {
            return response.status(STATUS_CODES.UNAUTHORIZED).json({
                code: STATUS_CODES.UNAUTHORIZED,
                success: false,
                error: [
                    {
                        field: "popup",
                        message: "Unauthorized user, token not available."
                    }
                ],
                message: ""
            });
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const _id = new mongoose.Types.ObjectId(String(decoded?._id));

        const userCacheKey = `pm:${process.env.NODE_ENV}:user:${_id.toString()}`;
        const logoutKey = `p-metrix:${process.env.NODE_ENV}:${tenantId}:logout:${token.toString()}`;

        const [userLoggedOut, cachedUser] = await Promise.all([
            getFromCache(logoutKey),
            getFromCache(userCacheKey)
        ]);

        if (userLoggedOut && userLoggedOut != null && userLoggedOut != undefined) {
            return response.status(STATUS_CODES.BAD_REQUEST).json({
                code: STATUS_CODES.BAD_REQUEST,
                success: false,
                expired: true,
                error: [
                    {
                        field: "popup",
                        message: "This token has expired, Please login again."
                    }
                ],
                message: ""
            });
        }

        if (cachedUser) {
            request.user = JSON.parse(cachedUser);

            return next();
        }
        const user = await User
            .findById(_id)
            .select("email loginEmail.address isSuperAdmin timezone name userStatus userType userBlockStatus tenantCode orgId")
            .populate("actionIds", "actionKey")
            .populate("orgId", "name")
            .lean();

        if (!user) {
            return response.status(STATUS_CODES.UNAUTHORIZED).json({
                code: STATUS_CODES.UNAUTHORIZED,
                success: false,
                error: [
                    {
                        field: "popup",
                        message: "No account found with these associated credentials."
                    }
                ],
                message: ""
            });
        }

        if (EMPLOYEEUSERTYPES.has(user?.userType)) {
            const employee = await Employee.findOne({ userId: user?._id }).select("userRoleName");
            user.userRoleName = employee?.userRoleName;
        }


        if (user?.userBlockStatus == "yes") {
            return response.status(STATUS_CODES.UNAUTHORIZED).json({
                code: STATUS_CODES.UNAUTHORIZED,
                success: false,
                blocked: true,
                error: [
                    {
                        field: "popup",
                        message: "Your account is blocked by admin, Please contect support@k12onlineschools.com."
                    }
                ],
                message: ""
            });
        }

        request.user = user;
        setInCache(userCacheKey, JSON.stringify(user), 3600).catch(console.error);
        return next();

    } catch (error) {
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

module.exports = Middleware;