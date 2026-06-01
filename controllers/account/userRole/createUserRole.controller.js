
const UserRole = require("@/models/account/userRole.model");
const { encryptKeys } = require("@/security/rsa.keys.security");

const CreateUserRoleController = async (request, response) => {

    const { userRoleName, userRoleKey, userType } = request.body;

    try {
        const userRole = await UserRole.create({
            userRoleName: userRoleName,
            userRoleKey: userRoleKey,
            userType: userType
        })
        if (userRole?._id) {
            const data = encryptKeys({
                userRoleId: userRole?._id
            });
            return response.status(200).json({
                code: 201,
                success: true,
                data: data,
                error: [],
                message: "User Role successfully created."
            });
        } else {
            return response.status(200).json({
                code: 200,
                success: false,
                error: [
                    {
                        field: "popup",
                        message: "User Role not created."
                    }
                ],
                message: ""
            });
        }
    } catch (error) {
        if (error.code === 11000) {
            let errorMessage;
            let fieldName;
            if (error.message.includes("userRoleName")) {
                errorMessage = "user role name already exists.";
                fieldName = "userRoleName";
            } else if (error.message.includes("userRoleKey")) {
                errorMessage = "user role key already exists.";
                fieldName = "userRoleKey";
            }
            return response.status(200).json({
                code: 400,
                success: false,
                error: [
                    {
                        field: fieldName,
                        message: errorMessage
                    }
                ],
                message: ""
            });
        } else {
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
}

module.exports = CreateUserRoleController