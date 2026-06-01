const User = require("@/models/account/user.model");

const UserStatusToggleController = async (request, response) => {
    try {
        const { userStatus } = request.body;
        const { id } = request.params;

        if(!(id == request.user._id)){
            await User.findOneAndUpdate(
                { _id: id },
                { userStatus: userStatus }
            )
            return response.status(200).json({
                code: 200,
                success: true,
                error: [],
                message: `User status changed to ${userStatus == "active" ? "active" : "inactive"} successfully.`
            });
        }
        else {
            return response.status(200).json({
                code: 200,
                success: false,
                error: [
                    {
                        field: "popup",
                        message: `You can't ${userStatus == "active" ? "active" : "inactive"} yourself.`
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

module.exports = UserStatusToggleController;