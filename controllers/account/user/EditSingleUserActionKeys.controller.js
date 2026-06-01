
const User = require("@/models/account/user.model");
const Action = require("@/models/action/action.model");

const EditSingleUserActionKeysController = async (request, response) => {
    const { id } = request.params;
    const { actionIds } = request.body;

    try {
        const actionObjects = await Action.find({ actionKey: { $in: actionIds } }).select('_id');

        // Extract _ids from actionObjects
        const actionIdObjects = actionObjects.map(action => action._id);

        // Find the user by ID and update it with the new details
        const updatedUser = await User.findByIdAndUpdate(
            { _id: id },
            { actionIds: actionIdObjects }
        );

        if (updatedUser) {
            return response.status(200).json({
                code: 201,
                success: true,
                error: [],
                message: "User actions successfully updated."
            });
        } else {
            return response.status(200).json({
                code: 404,
                success: false,
                error: [
                    {
                        field: "popup",
                        message: "User actions not found."
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

module.exports = EditSingleUserActionKeysController;
