const User = require("@/models/account/user.model");

const UserBlockToggleController = async (request, response) => {
    try {
        const { userBlockStatus } = request.body;
        const { id } = request.params;

        if(!(id == request.user._id)){
            await User.findOneAndUpdate(
                { _id: id },
                { userBlockStatus: userBlockStatus }
            )
    
            return response.status(200).json({
                code: 200,
                success: true,
                error: [],
                message: `User ${userBlockStatus == "yes" ? "blocked" : "unblocked"} successfully.`
            });
        }
        else {
            return response.status(200).json({
                code: 200,
                success: false,
                error: [
                    {
                        field: "popup",
                        message: `You can't ${userBlockStatus == "yes" ? "block" : "unblock"} yourself.`
                    }
                ],
                message: ""
            });
        }
    }
    catch (error){
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

module.exports = UserBlockToggleController;