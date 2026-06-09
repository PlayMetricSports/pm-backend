const User = require("@/models/account/user.model");
const { encryptKey } = require("@/security/rsa.key.security");
const STATUS_CODES = require('@/utils/helpers/statusCodes.helper')

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
            return response.status(STATUS_CODES.OK).json({
                code: STATUS_CODES.OK,
                success: true,
                error: [],
                message: "Password successfully updated."
            });
        }
        else {
            return response.status(STATUS_CODES.BAD_REQUEST).json({
                code: STATUS_CODES.BAD_REQUEST,
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
        return response.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({
            code: STATUS_CODES.INTERNAL_SERVER_ERROR,
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