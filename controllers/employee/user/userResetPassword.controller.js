const SendEmailController = require("@/controllers/system/email/sendEmail.controller");
const User = require("@/models/account/user.model");
const { encryptPassword } = require("@/security/rsa.keys.security");
const ResetPasswordTemplate = require("@/templates/resetPassword.template");
const GeneratePassword = require("@/utils/helpers/organization/generatePassword");

const UserResetPasswordController = async (request, response) => {
    try {
        const { id } = request.params;

        const password = GeneratePassword();

        const newPassword = encryptPassword(password);
        const user = await User.findOneAndUpdate(
            { _id: id },
            { password: newPassword }
        )

        if (user?._id) {
            const emailParams = {
                email: user?.email?.address,
                username: process.env.ADMISSION_SMTP_USERNAME,
                password: process.env.ADMISSION_SMTP_PASSWORD,
                subject: "Reset Password",
                content: ResetPasswordTemplate(password)
            }

            const sendEmail = await SendEmailController(emailParams);

            if (sendEmail?.success) {
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
                            message: "Updated password email not sent to user."
                        }
                    ],
                    message: ""
                });
            }
        }
        else {
            return response.status(200).json({
                code: 200,
                success: false,
                error: [
                    {
                        field: "popup",
                        message: "Password not updated."
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

module.exports = UserResetPasswordController;