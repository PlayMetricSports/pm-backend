const ForgotPasswordOTPTemplate = (code) => {
    const template = `
        <!DOCTYPE html>
        <html dir="ltr" lang="en">
            <head>
                <meta content="text/html; charset=UTF-8" http-equiv="Content-Type" />
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
                                                <p style="font-size:16px;line-height:26px;margin:16px 0;font-weight:300;color:#404040">
                                                    Hi,
                                                </p>
                                                <p style="font-size:16px;line-height:26px;margin:16px 0;font-weight:300;color:#404040">
                                                    Someone recently requested a password change for your K12 Online School account. If this was you, you can set a new password with this verification code:
                                                </p>
                                                <p style="font-size:25px;line-height:1.3;margin:16px 0;color:#377DFF;font-weight:600;text-align:center;margin-top:10px;margin-bottom:10px">
                                                    ${code}
                                                </p>
                                                <p style="font-size:16px;line-height:26px;margin:16px 0;font-weight:300;color:#404040">
                                                    If you don't want to change your password or didn't request this, just ignore and delete this message.</p>
                                                <p style="font-size:16px;line-height:26px;margin:16px 0;font-weight:300;color:#404040">
                                                    To keep your account secure, please don't forward this email to anyone.&nbsp;
                                                    <a href="https://k12onlineschool.com/" style="color:#067df7;text-decoration:none" target="_blank">more security
                                                        tips.
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
    `;

    return template;

}

module.exports = ForgotPasswordOTPTemplate;