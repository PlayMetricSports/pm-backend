

const ChangeUserStatusTemplate = (studentDataForEmail) => {
    const template = `
        <!DOCTYPE>
            <html>
                <head>
                    <link rel="preload" as="image"
                        href="https://lms.k12onlineschools.com/_next/image?url=%2Fassets%2Fimg%2Fk12schools-logo.webp&amp;w=384&amp;q=1" />
                    <meta content="text/html; charset=UTF-8" http-equiv="Content-Type" />
                    <meta name="x-apple-disable-message-reformatting" />
                </head>
                <body style="background-color:#F6F9FC;padding:10px 0px;font-family:sans-serif">
                    <table align="center" width="100%" border="0" cellPadding="0" cellSpacing="0" role="presentation"
                        style="max-width:37.5em;background-color:#FFFFFF;border:1px solid #F0F0F0;padding:45px;border-radius:10px">
                        <tbody>
                            <tr style="width:100%">
                                <td>
                                    <table align="center" width="100%" border="0" cellPadding="0" cellSpacing="0" role="presentation">
                                        <tbody>
                                            <tr>
                                                <td>
                                                    <p
                                                        style="font-size:16px;line-height:26px;margin:16px 0;font-weight:300;color:#404040">
                                                        Dear, ${studentDataForEmail?.parentName.charAt(0).toUpperCase() + studentDataForEmail?.parentName?.slice(1)}</p>
                                                    <p
                                                        style="font-size:16px;line-height:26px;margin:16px 0;font-weight:300;color:#404040">
                                                        I hope this email finds you well.</p>
                                                    <p
                                                        style="font-size:16px;line-height:26px;margin:16px 0;font-weight:300;color:#404040">
                                                        This is to inform you that the status of your child,  ${studentDataForEmail?.studentName.charAt(0).toUpperCase() + studentDataForEmail?.studentName?.slice(1)}, has been
                                                        updated to "${studentDataForEmail?.userStatus}" at K12 Schools. Kindly review the details below:</p>
                                                    <p
                                                        style="font-size:16px;line-height:20px;margin:0px;font-weight:300;color:#404040;padding-top:5px">
                                                        Student Name: ${studentDataForEmail?.studentName.charAt(0).toUpperCase() + studentDataForEmail?.studentName?.slice(1)}</p>
                                                    <p
                                                        style="font-size:16px;line-height:20px;margin:0px;font-weight:300;color:#404040;padding-top:5px">
                                                        Curriculum: ${studentDataForEmail?.board}</p>
                                                    <p
                                                        style="font-size:16px;line-height:20px;margin:0px;font-weight:300;color:#404040;padding-top:5px">
                                                        Grade: ${studentDataForEmail?.grade}</p>

                                                    <p
                                                        style="font-size:16px;line-height:20px;margin:0px;font-weight:300;color:#404040;padding-top:5px">
                                                        Admission Number: ${studentDataForEmail?.admissionNumber}</p>

                                                    <p
                                                        style="font-size:16px;line-height:20px;margin:0px;font-weight:300;color:#404040;padding-top:5px">
                                                        Current Status: ${studentDataForEmail?.userStatus}</p>
                                                    
                                                    <p
                                                        style="font-size:16px;line-height:20px;margin:0px;font-weight:300;color:#404040;padding-top:5px">
                                                        Reason: ${studentDataForEmail?.reason}</p>

                                                    <p
                                                        style="font-size:16px;line-height:26px;margin:16px 0;font-weight:300;color:#404040">
                                                        If you have any questions or require further clarification, please feel free to
                                                        contact us.</p>
                                                    <p
                                                        style="font-size:16px;line-height:26px;margin:16px 0;font-weight:300;color:#404040">
                                                        We appreciate your cooperation and support.</p>
                                                    <p
                                                        style="font-size:16px;line-height:20px;margin:0px;font-weight:300;color:#404040;padding-top:5px">
                                                        Warm regards,</p>
                                                    <p
                                                        style="font-size:16px;line-height:20px;margin:0px;font-weight:300;color:#404040;padding-top:5px">
                                                        <a href="https://k12onlineschool.com/"
                                                            style="color:#067df7;text-decoration-line:none;text-decoration:none"
                                                            target="_blank">K12 Schools.</a>
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


module.exports = ChangeUserStatusTemplate;