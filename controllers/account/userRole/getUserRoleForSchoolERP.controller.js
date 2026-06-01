const UserRole = require("@/models/account/userRole.model");
const { encryptKeys } = require("@/security/rsa.keys.security");

const GetUserRoleController = async (request, response) => {
    const { page } = request.query;

    try {
        let systemPage = page || 1;
        let SystemPageCount = 0;
        let SystemTotal = 0;
        let pageSize = 10;

        const filter = {
            $or: [
                { userType: { $in: ["parent", "student"] } },
                { userType: { $regex: /^school-/ } }
            ]
        };

        const totalUserRole = await UserRole.countDocuments(filter);
        const totalPages = Math.ceil(totalUserRole / pageSize);

        const userRole = await UserRole
            .find(filter)
            .sort({ createdAt: -1 })
            .select("userRoleName userRoleKey userRoleStatus userType isAdmin")
            .skip((systemPage - 1) * pageSize)
            .limit(pageSize)

        SystemTotal = totalUserRole;
        SystemPageCount = totalPages;

        if (userRole.length === 0) {
            return response.status(200).json({
                code: 200,
                success: false,
                error: [
                    {
                        field: "popup",
                        message: "No User role found."
                    }
                ],
                message: ""
            });
        }

        const data = encryptKeys({
            userRole: userRole,
            pagination: {
                page: systemPage,
                pageCount: SystemPageCount,
                total: SystemTotal
            }
        });

        return response.status(200).json({
            code: 200,
            success: true,
            data: data,
            error: [],
            message: "User role fetched successfully."
        });
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
module.exports = GetUserRoleController