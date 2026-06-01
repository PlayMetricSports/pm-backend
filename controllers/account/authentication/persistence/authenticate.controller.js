const { encryptKeys } = require("@/security/rsa.keys.security");

const AuthenticateController = async (request, response) => {
    try {
        if (request?.user?._id) {
            const data = encryptKeys({
                user: {
                    userBlockStatus: request?.user?.userBlockStatus,
                    userStatus: request?.user?.userStatus,
                    userType: request?.user?.userType,
                    userRoleName: request?.user?.userRoleName
                }
            });
            return response.status(200).json({
                code: 200,
                success: true,
                data: data,
                error: [],
                message: "User authentication successful."
            });
        }
        else if (request?.user?.status == "inactive") {

            return response.status(200).json({
                code: 401,
                success: false,
                error: [
                    {
                        field: "popup",
                        message: "User authentication failed."
                    }
                ],
                message: ""
            });
        }
        else {
            return response.status(200).json({
                code: 401,
                success: false,
                error: [
                    {
                        field: "popup",
                        message: "User authentication failed."
                    }
                ],
                message: ""
            });
        }
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

module.exports = AuthenticateController;