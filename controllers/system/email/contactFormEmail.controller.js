const getTransporter = require("@/utils/connections/mail/getTransporter");

const escapeHtml = (value = "") => {
    return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
};

const ContactFormController = async (request, response) => {
    try {
        const { name, email, subject, message } = request.body;

        if (!name || !email || !subject || !message) {
            return response.status(400).json({
                code: 400,
                success: false,
                error: [
                    {
                        field: "popup",
                        message: "All fields are required: name, email, subject, message."
                    }
                ],
                message: ""
            });
        }

        const transporter = getTransporter({
            username: process.env.SMTP_USERNAME,
            password: process.env.SMTP_PASSWORD
        });

        const emailContent = {
            from: `"${escapeHtml(name)}" <${process.env.SMTP_USERNAME}>`,
            replyTo: email,
            to: "angalogovths1957@gmail.com",
            subject: subject,
            html: `
                <div style="font-family: Arial, sans-serif; color: #333; max-width: 600px; margin: 0 auto; border: 1px solid #ddd; padding: 20px; background: #fff;">
                    <h2 style="margin-top: 0; margin-bottom: 20px; font-size: 22px; font-weight: 600;">
                        New Contact Form Submission
                    </h2>

                    <div style="margin-bottom: 15px;">
                        <strong>Name:</strong>
                        <div style="margin-top: 5px;">${escapeHtml(name)}</div>
                    </div>

                    <div style="margin-bottom: 15px;">
                        <strong>Email:</strong>
                        <div style="margin-top: 5px;">${escapeHtml(email)}</div>
                    </div>

                    <div style="margin-bottom: 15px;">
                        <strong>Subject:</strong>
                        <div style="margin-top: 5px;">${escapeHtml(subject)}</div>
                    </div>

                    <div style="margin-bottom: 15px;">
                        <strong>Message:</strong>
                        <div style="margin-top: 8px; padding: 12px; border: 1px solid #ddd; background: #f9f9f9; white-space: normal;">
                            ${escapeHtml(message).replace(/\n/g, "<br>")}
                        </div>
                    </div>
                </div>
            `
        };

        const emailSend = await transporter.sendMail(emailContent);

        if (emailSend) {
            return response.status(200).json({
                code: 200,
                success: true,
                error: [],
                message: "Email sent successfully."
            });
        }

        return response.status(200).json({
            code: 200,
            success: false,
            error: [
                {
                    field: "popup",
                    message: "Email not sent."
                }
            ],
            message: ""
        });
    } catch (error) {
        return response.status(500).json({
            code: 500,
            success: false,
            error: [
                {
                    field: "popup",
                    message: `Error: ${error.message || error}`
                }
            ],
            message: ""
        });
    }
};

module.exports = ContactFormController;