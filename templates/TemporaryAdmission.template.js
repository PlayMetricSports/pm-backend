const TemporaryAdmissionTemplate = (studentDataForEmail) => {
    const template = `
      <!DOCTYPE html>
<html dir="ltr" lang="en">

<head>
    <meta content="text/html; charset=UTF-8" http-equiv="Content-Type" />
    <meta name="x-apple-disable-message-reformatting" />
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" />
    <link
        href="https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&amp;display=swap"
        rel="stylesheet" />
</head>

<body style="background-color:#F6F9FC;padding:10px 0px;font-family:Inter">
    <table align="center" width="100%" border="0" cellPadding="0" cellSpacing="0" role="presentation"
        style="max-width:40em;background-color:#FFFFFF;border:1px solid #F0F0F0;padding:45px;border-radius:10px">
        <tbody>
            <tr style="width:100%">
                <td>
                    <table align="center" width="100%" border="0" cellPadding="0" cellSpacing="0" role="presentation">
                        <tbody>
                            <tr>
                                <td>
                                    <p
                                        style="font-size:15px;line-height:26px;margin:16px 0;font-weight:400;color:#404040">
                                        Greetings!
                                    </p>
                                    <p
                                        style="font-size:15px;line-height:26px;margin:16px 0;font-weight:400;color:#404040">
                                        Dear ${studentDataForEmail?.parentName},
                                    </p>
                                    <p
                                        style="font-size:15px;line-height:26px;margin:16px 0;font-weight:400;color:#404040">
                                        On behalf of the K12 Schools, we extend a warm welcome to you and your child
                                        ${studentDataForEmail?.studentName} to our K12 School family. We are delighted
                                        to have you as part of our community, and we look forward to a successful and
                                        fruitful partnership with you.</p>
                                    <p
                                        style="font-size:15px;line-height:26px;margin:16px 0;font-weight:400;color:#404040">
                                        Please see below the details of final confirmation of enrollment of children.
                                    </p>
                                    <p
                                        style="font-size:15px;line-height:26px;margin:16px 0;font-weight:400;color:#404040">
                                        Please see below the Parent's Credentials:</p>
                                    <p
                                        style="font-size:15px;line-height:26px;margin:16px 0;font-weight:400;color:#404040">
                                        Parent Login Username: ${studentDataForEmail?.parentEmail}</p>
                                    <p
                                        style="font-size:15px;line-height:26px;margin:16px 0;font-weight:400;color:#404040">
                                        Parent Login Password: ${studentDataForEmail?.parentPassword}</p>
                                    <p
                                        style="font-size:15px;line-height:26px;margin:16px 0;font-weight:bolder;color:#404040">
                                        Steps to follow</p>
                                    <p
                                        style="font-size:14px;margin:16px 0;font-weight:400;color:#404040;margin-left:25px;margin-bottom:25px">
                                        1. Login to&nbsp;
                                        <a href="https://lms.k12onlineschools.com/login"
                                            style="color:#067df7;text-decoration-line:none;text-decoration:none"
                                            target="_blank">
                                            lms.k12onlineschools.com/login
                                        </a>
                                    </p>
                                    <p
                                        style="font-size:14px;margin:16px 0;font-weight:400;color:#404040;margin-left:25px;margin-bottom:25px">
                                        2. Fill the Communication Form</p>
                                    <p
                                        style="font-size:14px;margin:16px 0;font-weight:400;color:#404040;margin-left:25px;margin-bottom:25px">
                                        3. Attached Valid Documents</p>
                                    <p
                                        style="font-size:14px;margin:16px 0;font-weight:400;color:#404040;margin-left:25px;margin-bottom:25px">
                                        4. Pay Fees</p>
                                    <p
                                        style="font-size:14px;margin:16px 0;font-weight:400;color:#404040;margin-left:25px;margin-bottom:25px">
                                        5. Click Submit</p>
                                    <p
                                        style="font-size:15px;line-height:26px;margin:16px 0;font-weight:400;color:#404040">
                                        We warmly welcome you and are committed to making your experience at K12 Schools
                                        exceptional in every way.
                                    </p>
                                    <p
                                        style="font-size:15px;line-height:26px;margin:16px 0;font-weight:400;color:#404040">
                                        For any assistance, please don't hesitate to reach out on below details:
                                    </p>
                                    <p
                                        style="font-size:15px;line-height:26px;margin:16px 0;font-weight:bolder;color:#404040">
                                        CONTACT PERSON
                                    </p>
                                    <p
                                        style="font-size:14px;margin:16px 0;font-weight:bolder;color:#404040;margin-left:25px;margin-bottom:25px">
                                        1. ADMIN
                                    </p>
                                    <p
                                        style="font-size:14px;margin:16px 0;font-weight:400;color:#404040;margin-left:40px;margin-bottom:35px">
                                        Email:&nbsp;
                                        <a href="mailto:admin@k12onlineschools.com"
                                            style="color:#067df7;text-decoration-line:none;text-decoration:none"
                                            target="_blank">
                                            admin@k12onlineschools.com
                                        </a>
                                    </p>
                                    <p
                                        style="font-size:14px;margin:16px 0;font-weight:bolder;color:#404040;margin-left:25px;margin-bottom:25px">
                                        2. PRO (Parent Relationship Manager)</p>
                                    <p
                                        style="font-size:14px;margin:16px 0;font-weight:400;color:#404040;margin-left:40px;margin-bottom:25px">
                                        Email:&nbsp;
                                        <a href="mailto:pro@k12onlineschools.com"
                                            style="color:#067df7;text-decoration-line:none;text-decoration:none"
                                            target="_blank">
                                            pro@k12onlineschools.com
                                        </a>
                                    </p>
                                    <p
                                        style="font-size:14px;margin:16px 0;font-weight:400;color:#404040;margin-left:40px;margin-bottom:35px">
                                        Phone and WhatsApp:&nbsp;
                                        <a href="tel:+918527492463"
                                            style="color:#067df7;text-decoration-line:none;text-decoration:none"
                                            target="_blank">
                                            +91 8527492463
                                        </a>
                                    </p>
                                    <p
                                        style="font-size:14px;margin:16px 0;font-weight:bolder;color:#404040;margin-left:25px;margin-bottom:25px">
                                        3. IT SUPPORT
                                    </p>
                                    <p
                                        style="font-size:14px;margin:16px 0;font-weight:400;color:#404040;margin-left:40px;margin-bottom:35px">
                                        Contact No and WhatsApp:&nbsp;
                                        <a href="tel:+918448664002"
                                            style="color:#067df7;text-decoration-line:none;text-decoration:none"
                                            target="_blank">
                                            +91 8448664002
                                        </a>
                                    </p>
                                    <p
                                        style="font-size:15px;margin:16px 0;font-weight:400;color:#404040;margin-top:75px;margin-bottom:0">
                                        Warm regards,
                                    </p>
                                    <p
                                        style="font-size:15px;line-height:26px;margin:16px 0;font-weight:400;color:#404040">
                                        K12 Schools
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
    `;

    return template;
}

module.exports = TemporaryAdmissionTemplate;