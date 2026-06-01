const getTransporter = require("@/utils/connections/mail/getTransporter");

const escapeHtml = (value = "") => {
    return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
};

const AdmissionFormController = async (request, response) => {
    try {
        const { studentName, fatherName, fatherNumber, className, email } = request.body;

        const transporter = getTransporter({
            username: process.env.SMTP_USERNAME,
            password: process.env.SMTP_PASSWORD
        });

        const emailContent = {
            from: `"Admission Form" <${process.env.SMTP_USERNAME}>`,
            ...(email && { replyTo: email }),
            to: "angalogovths1957@gmail.com",
            subject: `New Admission Enquiry - ${escapeHtml(studentName)}`,
            html: `
                <div style="font-family: Arial, sans-serif; color: #333; max-width: 600px; margin: 0 auto; border: 1px solid #ddd; padding: 20px; background: #fff;">
                    <h2 style="margin-top: 0; margin-bottom: 20px; font-size: 22px; font-weight: 600; color: #2c3e50;">
                        New Admission Form Submission
                    </h2>

                    <div style="margin-bottom: 15px;">
                        <strong>Student Name:</strong>
                        <div style="margin-top: 5px;">${escapeHtml(studentName)}</div>
                    </div>

                    <div style="margin-bottom: 15px;">
                        <strong>Father's Name:</strong>
                        <div style="margin-top: 5px;">${escapeHtml(fatherName)}</div>
                    </div>

                    <div style="margin-bottom: 15px;">
                        <strong>Father's Contact Number:</strong>
                        <div style="margin-top: 5px;">${escapeHtml(fatherNumber)}</div>
                    </div>

                    <div style="margin-bottom: 15px;">
                        <strong>Class Applying For:</strong>
                        <div style="margin-top: 5px;">${escapeHtml(className)}</div>
                    </div>

                    <div style="margin-bottom: 15px;">
                        <strong>Email:</strong>
                        <div style="margin-top: 5px;">
                            ${email ? escapeHtml(email) : ""}
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
                message: "Admission form submitted successfully."
            });
        }

        return response.status(200).json({
            code: 200,
            success: false,
            error: [],
            message: "Admission form submission failed."
        });

    } catch (error) {
        return response.status(500).json({
            code: 500,
            success: false,
            error: [],
            message: error.message || "Internal Server Error"
        });
    }
};

module.exports = AdmissionFormController;