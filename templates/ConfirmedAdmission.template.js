const ConfirmedAdmissionTemplate = (studentDataForEmail) => {
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
                                        Dear ${studentDataForEmail?.parentName},
                                    </p>
                                    <p
                                        style="font-size:15px;line-height:26px;margin:16px 0;font-weight:400;color:#404040">
                                        Welcome to the K12 Schools family! We are delighted to have you and your child,
                                        ${studentDataForEmail?.studentName} (${studentDataForEmail?.admissionNumber}),
                                        join our esteemed educational community in the ${studentDataForEmail?.board}
                                        ${studentDataForEmail?.grade} ( ${studentDataForEmail?.timePreference || ""} AY ${studentDataForEmail?.academicSession}). We are
                                        dedicated to creating a nurturing environment and fostering academic excellence
                                        for every learner.
                                    </p>
                                    <p
                                        style="font-size:15px;line-height:26px;margin:16px 0;font-weight:400;color:#404040">
                                        As you embark on this exciting journey with us, we are excited to introduce you
                                        to our advanced learning tools and platforms designed to enhance your child's
                                        learning experience both inside and outside the classroom.
                                    </p>
                                    <p
                                        style="font-size:15px;line-height:26px;margin:16px 0;font-weight:400;color:#404040">
                                        We look forward to getting to know you better, exploring new opportunities
                                        together, and creating lasting memories throughout your time with us.
                                    </p>
                                    <p
                                        style="font-size:15px;line-height:26px;margin:16px 0;font-weight:400;color:#404040">
                                        Please see below the Student's Credentials:
                                    </p>
                                    <p
                                        style="font-size:15px;line-height:26px;margin:16px 0;font-weight:bolder;color:#404040">
                                        Credentials for Access:
                                    </p>
                                    <p
                                        style="font-size:14px;margin:16px 0;font-weight:400;color:#404040;margin-left:25px;margin-bottom:25px">
                                        Gmail and Google Chat:&nbsp;
                                        <a href="https://gmail.com"
                                            style="color:#067df7;text-decoration-line:none;text-decoration:none"
                                            target="_blank">
                                            gmail.com
                                        </a>
                                    </p>
                                    <p
                                        style="font-size:14px;margin:16px 0;font-weight:400;color:#404040;margin-left:40px;margin-bottom:25px">
                                        Username: ${studentDataForEmail?.studentLoginEmail}
                                    </p>
                                    <p
                                        style="font-size:14px;margin:16px 0;font-weight:400;color:#404040;margin-left:40px;margin-bottom:35px">
                                        Password: ${studentDataForEmail?.studentLoginPassword}
                                    </p>
                                    <p
                                        style="font-size:14px;margin:16px 0;font-weight:400;color:#404040;margin-left:25px;margin-bottom:25px">
                                        LMS (Learning Management System):&nbsp;
                                        <a href="https://lms.k12onlineschools.com/login"
                                            style="color:#067df7;text-decoration-line:none;text-decoration:none"
                                            target="_blank">
                                            lms.k12onlineschools.com
                                        </a>
                                    </p>
                                    <p
                                        style="font-size:14px;margin:16px 0;font-weight:400;color:#404040;margin-left:40px;margin-bottom:25px">
                                        Username: ${studentDataForEmail?.studentLoginEmail}
                                    </p>
                                    <p
                                        style="font-size:14px;margin:16px 0;font-weight:400;color:#404040;margin-left:40px;margin-bottom:35px">
                                        Password: ${studentDataForEmail?.studentLoginPassword}
                                    </p>
                                    <p
                                        style="font-size:15px;line-height:26px;margin:16px 0;font-weight:400;color:#404040">
                                        We are confident that these advanced learning tools will enrich your child's
                                        educational experience and empower them to thrive academically. Should you have
                                        any questions or require further assistance, please do not hesitate to reach out
                                        to us.
                                    </p>
                                    <p
                                        style="font-size:15px;margin:16px 0;font-weight:400;color:#404040;margin-bottom:0;margin-top:25px">
                                        For Access of LMS please follow the Step by Step manual
                                    </p>
                                    <p
                                        style="font-size:15px;line-height:26px;margin:16px 0;font-weight:400;color:#404040">
                                        <a href="https://lms.k12onlineschools.com/lms/common/help"
                                            style="color:#067df7;text-decoration-line:none;text-decoration:none"
                                            target="_blank">
                                            lms.k12onlineschools.com/lms/common/help
                                        </a>
                                    </p>
                                    <p
                                        style="font-size:15px;margin:16px 0;font-weight:400;color:#404040;margin-bottom:25px;margin-top:25px">
                                        For Download G Space Chat
                                    </p>
                                    <p
                                        style="font-size:15px;margin:16px 0;font-weight:400;color:#404040;margin-bottom:0;margin-left:20px">
                                        IOS:&nbsp;
                                        <a href="https://apps.apple.com/in/app/google-chat/id1163852619"
                                            style="color:#067df7;text-decoration-line:none;text-decoration:none"
                                            target="_blank">
                                            Apple Store
                                        </a>
                                    </p>
                                    <p
                                        style="font-size:15px;line-height:26px;margin:16px 0;font-weight:400;color:#404040;margin-left:20px">
                                        Android:&nbsp;
                                        <a href="https://play.google.com/store/apps/details?id=com.google.android.apps.dynamite"
                                            style="color:#067df7;text-decoration-line:none;text-decoration:none"
                                            target="_blank">
                                            Google Play
                                        </a>
                                    </p>
                                    <p
                                        style="font-size:15px;line-height:26px;margin:16px 0;font-weight:400;color:#404040">
                                        Once again, welcome to K12 Schools. We look forward to partnering with you in
                                        your child's educational journey and witnessing their growth and success.
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

module.exports = ConfirmedAdmissionTemplate;