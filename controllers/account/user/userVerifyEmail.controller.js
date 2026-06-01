const Verify = require("@/models/account/verify.model");
const User = require("@/models/account/user.model");
const OTPExpiryValidation = require("@/utils/helpers/account/OTPExpiryValidation");

const UserVerifyEmailController = async (request, response) => {
    const { email, code } = request.body;

    try {
        const VerifyResponse = await Verify.findOne({ otp: code, email: email }).select("email createdAt");

        if (VerifyResponse?._id) {
            const notExpire = OTPExpiryValidation(VerifyResponse.createdAt);

            if (notExpire.success && !notExpire.expire) {
                await User.findOneAndUpdate(
                    { _id: request.user._id },
                    {
                        loginEmail: {
                            address: email,
                            isValid: true
                        }
                    }
                );

                await Verify.deleteMany({ email: email });

                return response.status(200).json({
                    code: 200,
                    success: true,
                    error: [],
                    message: "Profile email details updated successfully."
                });
            }
            else {
                return response.status(200).json({
                    code: 200,
                    success: false,
                    error: [
                        {
                            field: "popup",
                            message: "Verification OTP is expired."
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
                        message: "Verification OTP Not found in the database."
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

module.exports = UserVerifyEmailController;