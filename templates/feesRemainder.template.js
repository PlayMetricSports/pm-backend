
const moment = require("moment");
const timestampCalculate = (num) => {
    return num * 24 * 60 * 60 * 1000
}
const calculateTimeStamp = (dueDateReverse) => {
    const dueDate = new Date(dueDateReverse).setUTCHours(0, 0, 0, 0);
    const oneDayBeforeDueDate = new Date(dueDateReverse).setUTCHours(0, 0, 0, 0) - timestampCalculate(1);
    const fiveDayBeforeDueDate = new Date(dueDateReverse).setUTCHours(0, 0, 0, 0) - timestampCalculate(5);
    const tenDayBeforeDueDate = new Date(dueDateReverse).setUTCHours(0, 0, 0, 0) - timestampCalculate(10);


    return { dueDate, oneDayBeforeDueDate, fiveDayBeforeDueDate, tenDayBeforeDueDate }
}
const feesRemainderTemplate = (studentDataForEmail) => {
    let content = `This is a gentle reminder that the payment for the upcoming school fees for '${studentDataForEmail?.studentName?.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}', is now due. Kindly review the details below:`;

    const dueDateReverse = studentDataForEmail?.dueDate?.split("/")?.reverse()?.join("-");
    const dueDateReverseMoment = moment(dueDateReverse);

    const currentDateInTime = new Date().setUTCHours(0, 0, 0, 0);

    const timestamp = calculateTimeStamp(dueDateReverse)

    // flags
    const tenDaysBefore = timestamp.tenDayBeforeDueDate > currentDateInTime
    const betweenTenthToFifthDay = timestamp.tenDayBeforeDueDate <= currentDateInTime && timestamp.fiveDayBeforeDueDate > currentDateInTime
    const betweenfifthtofirstDay = timestamp.fiveDayBeforeDueDate <= currentDateInTime && timestamp.oneDayBeforeDueDate > currentDateInTime
    const onfirstDayBefore = currentDateInTime >= timestamp.oneDayBeforeDueDate && currentDateInTime < timestamp.dueDate;
    const ontheDueDate = timestamp.dueDate == currentDateInTime
    const afterDueDate = timestamp.dueDate < currentDateInTime

    // console.log(timestamp.tenDayBeforeDueDate);
    // console.log(currentDateInTime);
    // console.log(timestamp.fiveDayBeforeDueDate);
    // console.log(timestamp.oneDayBeforeDueDate);
    // console.log(timestamp.dueDate);

    // console.log({tenDaysBefore});
    // console.log({betweenTenthToFifthDay});
    // console.log({betweenfifthtofirstDay});
    // console.log({onfirstDayBefore});
    // console.log({ontheDueDate});
    // console.log({afterDueDate});

    const studentCred = `${studentDataForEmail?.studentName?.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')} | ${studentDataForEmail?.studentAdmissionNumber}`

    if (tenDaysBefore) {
        content = `This is a gentle reminder that the school fee installment for your child <strong style="font-weight:bold;">${studentCred}</strong> will be due on ${studentDataForEmail?.dueDate}. Kindly make the payment on or before the due date to avoid late charges.`
    }
    else if (betweenTenthToFifthDay) {
        content = `This is a reminder that the <strong style="font-weight:bold;">school fee installment</strong> for your child <strong style="font-weight:bold;">${studentCred}</strong> is due on ${studentDataForEmail?.dueDate}. Kindly make the payment on or before the due date to avoid late charges.`
    }
    else if (betweenfifthtofirstDay) {
        content = `This is an urgent reminder that the <strong style="font-weight:bold;">school fee installment</strong> for your child <strong style="font-weight:bold;">${studentCred}</strong> is due on ${studentDataForEmail?.dueDate}. Please ensure timely payment to avoid late fine and disruption in student services.`
    }
     else if (onfirstDayBefore) {
        content = `This is an urgent reminder that the <strong style="font-weight:bold;">school fee installment</strong> for your child <strong style="font-weight:bold;">${studentCred}</strong> is due tomorrow, ${studentDataForEmail?.dueDate}. Please ensure timely payment to avoid late fine and disruption in student services.`
    }
    else if (ontheDueDate) {
        content = `This is an urgent reminder that the <strong style="font-weight:bold;">school fee installment</strong> for your child <strong style="font-weight:bold;">${studentCred}</strong> is due today, ${studentDataForEmail?.dueDate}. Please ensure timely payment to avoid late fine and disruption in student services.`
    }
    else if (afterDueDate) {
        content = `Our records indicate that the following school fee installment for your child <strong style="font-weight:bold;">${studentCred}</strong> was due and is still pending.`
    }



    const overdueDateInDays = moment().diff(dueDateReverseMoment, "days") > 0 ? moment().diff(dueDateReverseMoment, "days") : 0;




    const template = `
        <!DOCTYPE>
        <html>
            <head>
                <link rel="preload" as="image" href="https://lms.k12onlineschools.com/_next/image?url=%2Fassets%2Fimg%2Fk12schools-logo.webp&amp;w=384&amp;q=1" />
                <meta content="text/html; charset=UTF-8" http-equiv="Content-Type" />
                <meta name="x-apple-disable-message-reformatting" />
            </head>
            <body style="background-color:#F6F9FC;padding:10px 0px;font-family:sans-serif">
                <table align="center" width="100%" border="0" cellPadding="0" cellSpacing="0" role="presentation" style="max-width:37.5em;background-color:#FFFFFF;border:1px solid #F0F0F0;padding:45px;border-radius:10px">
                    <tbody>
                        <tr style="width:100%">
                            <td>
                                <table align="center" width="100%" border="0" cellPadding="0" cellSpacing="0" role="presentation">
                                    <tbody>
                                        <tr>
                                            <td>
                                                <p style="font-size:16px;line-height:26px;margin:16px 0;font-weight:300;color:#404040">
                                                    Dear, ${studentDataForEmail?.parentName?.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                                                </p>
                                                <p style="font-size:16px;line-height:26px;margin:16px 0;font-weight:300;color:#404040">
                                                    I hope this email finds you well.
                                                </p>
                                                <p style="font-size:16px;line-height:26px;margin:16px 0;font-weight:300;color:#404040">
                                                    ${content}
                                                </p>
                                                <p style="font-size:16px;line-height:26px;margin:16px 0;font-weight:bolder;color:#404040">
                                                    Kindly review the details below:
                                                </p>
                                                <p style="font-size:16px;line-height:20px;margin:0px;font-weight:300;color:#404040;padding-top:5px">
                                                    <strong style="font-weight:bold;">Student Name:</strong> ${studentDataForEmail?.studentName?.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                                                </p>
                                                <p style="font-size:16px;line-height:20px;margin:0px;font-weight:300;color:#404040;padding-top:5px">
                                                    <strong style="font-weight:bold;">Admission Number:</strong> ${studentDataForEmail?.studentAdmissionNumber}
                                                </p>
                                                <p style="font-size:16px;line-height:20px;margin:0px;font-weight:300;color:#404040;padding-top:5px">
                                                    <strong style="font-weight:bold;">Installment Due Date:</strong> ${studentDataForEmail?.dueDate}
                                                </p>
                                                <p style="font-size:16px;line-height:20px;margin:0px;font-weight:300;color:#404040;padding-top:5px">
                                                    <strong style="font-weight:bold;">Amount Due:</strong> ${studentDataForEmail?.finalAmount}
                                                </p>
                                                <p style="font-size:16px;line-height:20px;margin:0px;font-weight:300;color:#404040;padding-top:5px">
                                                    <strong style="font-weight:bold;">Late Fine</strong> : ${studentDataForEmail?.lateFine}
                                                </p>
                                                <p style="font-size:16px;line-height:20px;margin:0px;font-weight:300;color:#404040;padding-top:5px">
                                                    <strong style="font-weight:bold;">Days Delayed:</strong> : ${overdueDateInDays} Days
                                                </p>
                                                <p style="font-size:16px;line-height:20px;margin:0px;font-weight:300;color:#404040;padding-top:5px">
                                                    <strong style="font-weight:bold;">Total Payable:</strong> ${studentDataForEmail?.amount}
                                                </p>
                                                <p style="font-size:16px;line-height:26px;margin:16px 0;font-weight:300;color:#404040">
                                                   If you have already paid the above amount, you can upload the payment screenshot on the parent portal through the link 
below, or alternatively, you can attach the screenshot to this email
                                                </p>
                                                <p style="font-size:16px;line-height:26px;margin:16px 0;font-weight:bolder;color:#404040">
                                                    How to Pay:
                                                </p>
                                                <ol style="list-style-position: outside; margin-left:40px; padding-left:20px; font-size:14px; color:#404040;">
                                                    <p style="font-size:16px;line-height:20px;margin:0px;font-weight:300;color:#404040;padding-top:5px">
                                                        <strong style="font-weight:bold;">Parent Portal</strong> - Login → Fee Section → Pay Now
                                                    </p>
                                                    <p style="font-size:16px;line-height:20px;margin:0px;font-weight:300;color:#404040;padding-top:5px">
                                                        <strong style="font-weight:bold;">Quick Link</strong> - Pay directly via link: 
                                                        <a href="${studentDataForEmail?.paymentUrl}" style="font-size:16px;line-height:26px;margin:16px 0;font-weight:300;color:#007bff; text-decoration:none;">
                                                            ${studentDataForEmail?.paymentUrl}
                                                        </a>
                                                    </p>
                                                </ol>
                                                <p style="font-size:16px;line-height:20px;margin:0px;font-weight:300;color:#404040;padding-top:5px">
                                                    Warm regards,
                                                </p>
                                                <p style="font-size:16px;line-height:20px;margin:0px;font-weight:300;color:#404040;padding-top:5px">
                                                    <a href="https://lms.k12onlineschools.com/" style="color:#067df7;text-decoration-line:none;text-decoration:none" target="_blank">
                                                        K12 Schools - Fee Department.
                                                    </a>
                                                </p>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </body>
        </html>
    `
    
    return template;
}

module.exports = feesRemainderTemplate;