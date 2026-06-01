const Verify = require("@/models/account/verify.model");
const User = require("@/models/account/user.model");
const GenerateCode = require("@/utils/helpers/account/generateCode");
const SendEmailController = require("@/controllers/system/email/sendEmail.controller");
const EmailVerificationOTPTemplate = require("@/templates/EmailVerificationOTP.template");

const UserSendOTPVerifyEmailController = async (request, response) => {
    const { email } = request.body;

    try {
        const code = GenerateCode();

        const user = await User.findOne({ _id: request.user._id });

        if (email == user.loginEmail.address && user.loginEmail.isValid) {
            return response.status(200).json({
                code: 200,
                success: false,
                error: [
                    {
                        field: "popup",
                        message: "This email address is already verified."
                    }
                ],
                message: ""
            });
        }

        await Verify.create({ otp: code, email: email });

        const emailParams = {
            email: email,
            subject: "Verification OTP",
            content: EmailVerificationOTPTemplate(code)
        }

        const sendEmail = await SendEmailController(emailParams);

        return response.status(200).json({
            code: 200,
            success: sendEmail.success,
            error: sendEmail.error,
            message: sendEmail.message
        });
    }
    catch (error) {
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

module.exports = UserSendOTPVerifyEmailController;