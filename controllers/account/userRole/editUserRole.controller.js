
const UserRole = require("@/models/account/userRole.model");
const Action = require("@/models/action/action.model");

const EditUserRoleController = async (request, response) => {
    const { id } = request.params;
    const { userRoleName, userRoleKey, userType, actionIds } = request.body;

    try {

        const actionObjects = await Action.find({ actionKey: { $in: actionIds } }).select('_id').lean();

        // Extract _ids from actionObjects
        const actionIdObjects = actionObjects.map(action => action._id);

        // Find the user role by ID and update it with the new details
        const updatedUserRole = await UserRole.findByIdAndUpdate(
            { _id: id },
            { userRoleName, userRoleKey, userType, actionIds: actionIdObjects }
        );

        if (updatedUserRole) {
            return response.status(200).json({
                code: 201,
                success: true,
                error: [],
                message: "User role successfully updated."
            });
        } else {
            return response.status(200).json({
                code: 404,
                success: false,
                error: [
                    {
                        field: "popup",
                        message: "User role not found."
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

module.exports = EditUserRoleController;
