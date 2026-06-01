const User = require("@/models/account/user.model");
const { encryptKeys } = require("@/security/rsa.keys.security");

const SingleUserActionIdsController = async (request, response) => {
    try {
        const { id } = request.params;

        const user = await User.findById(id)
            .select("actionIds isSuperAdmin")
            .populate({
                path: 'actionIds',
                select: 'actionKey'
            });

        if (!user) {
            return response.status(200).json({
                code: 400,
                success: false,
                error: [
                    {
                        field: "popup",
                        message: "User not found"
                    }
                ],
                message: ""
            });
        }

        // Map the actionIds to an array of actionKeys
        const actionKeys = user.actionIds.map(action => action.actionKey);

        const data = encryptKeys({
            actionKeys: actionKeys,
            isSuperAdmin: user?.isSuperAdmin
        });

        return response.status(200).json({
            code: 200,
            success: true,
            data: data,
            error: [],
            message: "Action keys fetched successfully."
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

module.exports = SingleUserActionIdsController;
