const UserRole = require("@/models/account/userRole.model");
const UserDepartment = require("@/models/account/user-department.model");
const Org = require("@/models/organisation/org.model");

const { encryptKeys } = require("@/security/rsa.keys.security");

const GetUserTypeRoles = async (request, response) => {
    try {
        const roles = await UserRole
            .find({ userRoleStatus: "active" })
            .select("userType userRoleStatus userRoleKey");

        // Group roles by userType
        const list = roles?.reduce((acc, role) => {
            const { userType, userRoleKey } = role;
            if (!acc[userType]) {
                acc[userType] = [];
            }
            acc[userType].push(userRoleKey);
            return acc;
        }, {});
        const userDeptList = await UserDepartment.find({ departmentStatus: "active" }).select("-_id departmentKey").lean()
        let organisations = []
        if (request.user.userType == "admin") {
            organisations = await Org.find({}).select("name").lean()
        }
        else if (request.user?.orgId) {
            organisations = [{
                _id: request.user.orgId?._id,
                name: request.user.orgId?.name
            }]
        }
        const data = encryptKeys({ userTypeList: list, userDeptList, organisations });
        return response.status(200).json({
            code: 200,
            success: true,
            data: data,
            error: [],
            message: "User Type and Roles list fetched successfully."
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

module.exports = GetUserTypeRoles;