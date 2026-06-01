
const UserRole = require("@/models/account/userRole.model");
const { default: mongoose } = require("mongoose");

const UserRoleStatusToggleController = async (request, response) => {

    try {
        const { userRoleStatus } = request.body;
        const { id } = request.params;

        if (!id || !mongoose.isValidObjectId(id))
            if (!["active", "inactive"].includes(userRoleStatus))
                await UserRole.findOneAndUpdate(
                    { _id: id },
                    { userRoleStatus: userRoleStatus }
                )

        return response.status(200).json({
            code: 200,
            success: true,
            error: [],
            message: `User Role status changed to ${userRoleStatus == "active" ? "active" : "inactive"} successfully.`
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

module.exports = UserRoleStatusToggleController;