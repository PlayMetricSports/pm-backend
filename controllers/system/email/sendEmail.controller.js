const checkAndUpdateEmailLimit = require("@/utils/helpers/email/checkEmailLimit");
const getTransporter = require("@/utils/connections/mail/getTransporter")
const SendEmailController = async (params) => {
    if (process.env.NODE_ENV !== "local") {
        const senderEmail = params?.username;

        const limitStatus = await checkAndUpdateEmailLimit(senderEmail);

        if (!limitStatus?.allowed) {
            return {
                code: 429,
                success: false,
                error: [
                    {
                        field: "popup",
                        message: "Daily email limit exceeded. You can only send 1200 emails per day. Please try again tomorrow."
                    }
                ],
                message: ""
            };
        }

        const transporter = getTransporter(params)

        let emailContent = {
            from: `"${process.env.SMTP_FROM}" <${senderEmail}>`,
            subject: params?.subject,
            html: params?.content,
        };

        if (params?.attachments) {
            emailContent.attachments = params?.attachments || []
        }

        if (params?.email) {
            emailContent.to = params?.email;
        }

        if (params?.bcc) {
            if (Array.isArray(params.bcc)) {
                emailContent.bcc = params.bcc.join(", ");
            } else {
                emailContent.bcc = params.bcc;
            }
        }

        if (params?.cc) {
            if (Array.isArray(params.cc)) {
                emailContent.cc = params.cc.join(", ");
            } else {
                emailContent.cc = params.cc;
            }
        }

        try {
            const emailSend = await transporter.sendMail(emailContent);

            if (emailSend) {
                return {
                    code: 200,
                    success: true,
                    error: [],
                    message: "Email sent successfully."
                };
            }
            else {
                return {
                    code: 200,
                    success: false,
                    error: [
                        {
                            field: "popup",
                            message: "Email not sent."
                        }
                    ],
                    message: ""
                };
            }
        }
        catch (error) {
            return {
                code: 500,
                success: false,
                error: [
                    {
                        field: "popup",
                        message: `Error: ${error}`
                    }
                ],
                message: ""
            };
        }
    }

};

module.exports = SendEmailController;