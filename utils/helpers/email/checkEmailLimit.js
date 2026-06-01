const EmailSendLimit = require("@/models/system/emailSendLimit.model");

const DAILY_EMAIL_LIMIT = 1200;

const UpdateEmailLimit = async (email) => {
    try {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        if (email) {
            let emailRecord = await EmailSendLimit.findOne({ email: email?.toLowerCase() });

            if (!emailRecord) {
                const newEmailRecord = new EmailSendLimit({
                    email: email.toLowerCase(),
                    sentCount: 1,
                    lastResetDate: today
                });

                await newEmailRecord.save();

                return {
                    allowed: true,
                    remainingEmails: DAILY_EMAIL_LIMIT - 1
                };
            }

            const recordDate = new Date(emailRecord.lastResetDate);
            recordDate.setHours(0, 0, 0, 0);

            const isNewDay = today.getTime() > recordDate.getTime();

            if (isNewDay) {
                emailRecord.sentCount = 1;
                emailRecord.lastResetDate = today;
                await emailRecord.save();

                return {
                    allowed: true,
                    remainingEmails: DAILY_EMAIL_LIMIT - 1
                };
            }

            if (emailRecord.sentCount >= DAILY_EMAIL_LIMIT) {
                return {
                    allowed: false,
                    remainingEmails: 0
                };
            }

            emailRecord.sentCount += 1;
            await emailRecord.save();

            return {
                allowed: true,
                remainingEmails: DAILY_EMAIL_LIMIT - emailRecord.sentCount
            };
        }
        else {
            return {
                allowed: false,
                remainingEmails: 0
            };
        }

    }
    catch (err) {
        throw new Error(err)
    }

};

module.exports = UpdateEmailLimit;