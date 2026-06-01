const User = require("@/models/account/user.model");
const { encryptKey } = require("@/security/rsa.key.security");

const UserChangePasswordController = async (request, response) => {
    try {
        const { oldPassword, newPassword } = request.body;

        const encryptedOldPassword = encryptKey(oldPassword);
        const encryptedNewPassword = encryptKey(newPassword);

        const user = await User.findOneAndUpdate(
            { _id: request.user._id, password: encryptedOldPassword },
            { password: encryptedNewPassword }
        )

        if (user?._id) {
            return response.status(200).json({
                code: 200,
                success: true,
                error: [],
                message: "Password successfully updated."
            });
        }
        else {
            return response.status(200).json({
                code: 200,
                success: false,
                error: [
                    {
                        field: "popup",
                        message: "Old Password is incorrect."
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

module.exports = UserChangePasswordController;