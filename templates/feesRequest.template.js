
const feesRequestTemplate = (studentDataForEmail) => {
    const template = `
<!DOCTYPE>
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
                                                Dear, ${studentDataForEmail?.parentName?.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}</p>
                                            <p
                                                style="font-size:16px;line-height:26px;margin:16px 0;font-weight:300;color:#404040">
                                                I hope this email finds you well.</p>
                                            <p
                                                style="font-size:16px;line-height:26px;margin:16px 0;font-weight:300;color:#404040">
                                                This is a gentle reminder that the payment for the upcoming school fees for
                                                '${studentDataForEmail?.studentName?.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}', is now due. Kindly review the details below:</p>
                                            <p
                                                style="font-size:16px;line-height:20px;margin:0px;font-weight:300;color:#404040;padding-top:5px">
                                                Amount Due: ${studentDataForEmail?.amount}</p>
                                            <p
                                                style="font-size:16px;line-height:20px;margin:0px;font-weight:300;color:#404040;padding-top:5px">
                                                Due Date: ${studentDataForEmail?.dueDate}</p>
                                            <p
                                                style="font-size:16px;line-height:26px;margin:16px 0;font-weight:300;color:#404040">
                                                We greatly appreciate your timely payment and support as we continue to provide
                                                a high-quality educational experience for your child.</p>
                                            <p
                                                style="font-size:16px;line-height:20px;margin:0px;font-weight:300;color:#404040;padding-top:5px">
                                                Warm regards,</p>
                                            <p
                                                style="font-size:16px;line-height:20px;margin:0px;font-weight:300;color:#404040;padding-top:5px">
                                                <a href="https://lms.k12onlineschools.com/"
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


module.exports = feesRequestTemplate;