const UserRole = require("@/models/account/userRole.model");
const { encryptKeys } = require("@/security/rsa.keys.security");

const ActionIdUserRoleController = async (request, response) => {
    try {
        const { id } = request.params;

        const userRole = await UserRole.findById(id)
            .select("actionIds")
            .populate({
                path: 'actionIds',
                select: 'actionKey'
            });

        if (!userRole) {
            return response.status(200).json({
                code: 400,
                success: false,
                error: [
                    {
                        field: "popup",
                        message: "User role not found"
                    }
                ],
                message: ""
            });
        }

        // Map the actionIds to an array of actionKeys
        const actionKeys = userRole.actionIds.map(action => action.actionKey);

        const data = encryptKeys({
            actionKeys: actionKeys
        });

        return response.status(200).json({
            code: 200,
            success: true,
            data: data,
            error: [],
            message: "Action key fetched successfully."
        });
    } catch (error) {
        return response.status(500).json({
            code: 500,
            success: false,
            error: [
                {
                    field: "popup",
                    message: `Error: ${error.message}`
                }
            ],
            message: ""
        });
    }
};

module.exports = ActionIdUserRoleController;
