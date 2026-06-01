const feesConfirmationMailTemplate = (studentDataForEmail) => {

    const template = `
<!DOCTYPE html>
<html>
  <head>
    <link rel="preload" as="image" href="https://lms.k12onlineschools.com/_next/image?url=%2Fassets%2Fimg%2Fk12schools-logo.webp&w=384&q=1" />
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
    <meta name="x-apple-disable-message-reformatting" />
  </head>
  <body style="background-color:#F6F9FC;padding:10px 0;font-family:sans-serif;">
    <table align="center" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="max-width:37.5em;background-color:#FFFFFF;border:1px solid #F0F0F0;padding:45px;border-radius:10px;">
      <tbody>
        <tr style="width:100%">
          <td>
            <table align="center" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation">
              <tbody>
                <tr>
                  <td>
                    <p style="font-size:16px;line-height:26px;margin:16px 0;color:#404040;">
                        Dear ${studentDataForEmail?.parentName?.split(" ").map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(" ")},
                    </p>
                    <p style="font-size:16px;line-height:24px;margin:0 0 12px;color:#404040">
                      We are pleased to inform you that the school has successfully received your payment.
                      Please find the details below for your reference:
                    </p>

                    <p style="font-size:16px;line-height:24px;mmargin:0 0 12px;font-weight:bold;color:#404040">
                        Payment Details
                    </p>

                    <p style="font-size:16px;line-height:22px;margin:0;color:#404040;padding-top:5px;">
                    <strong style="font-weight:bold;">Student Name:</strong> ${studentDataForEmail?.studentName?.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(' ')}
                    </p>

                    <p style="font-size:16px;line-height:22px;margin:0;color:#404040;padding-top:5px;">
                      <strong style="font-weight:bold;">Admission Number:</strong> ${studentDataForEmail?.admissionNumber}
                    </p>
                    <p style="font-size:16px;line-height:22px;margin:0;color:#404040;padding-top:5px;">
                      <strong style="font-weight:bold;">Payment Date:</strong> ${studentDataForEmail?.paymentDate.toLocaleDateString('en-GB')}
                    </p>
                    <p style="font-size:16px;line-height:22px;margin:0;color:#404040;padding-top:5px;">
                      <strong style="font-weight:bold;">Amount Received:</strong> ${studentDataForEmail?.totalPaidAmount} ${studentDataForEmail?.currency}
                    </p>
                    <p style="font-size:16px;line-height:22px;margin:0;color:#404040;padding-top:5px;">
                      <strong style="font-weight:bold;">Payment Mode:</strong> ${studentDataForEmail?.paymentMode?.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                    </p>
                    <p style="font-size:16px;line-height:22px;margin:0;color:#404040;padding-top:5px;">
                      <strong style="font-weight:bold;">Transaction ID:</strong> ${studentDataForEmail?.bankTransactionId?.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ') || "N/A"}
                    </p>
                   ${studentDataForEmail?.remarks?.length > 0 ? `<p style="font-size:16px;line-height:22px;margin:0;color:#404040;padding-top:5px;">
                    <strong style="font-weight:bold;">Remarks:</strong> ${studentDataForEmail?.remarks?.charAt(0).toUpperCase() +
                    studentDataForEmail?.remarks?.slice(1).toLowerCase()
                    }
                    </p>`
                    : ""}

                    <p style="font-size:16px;line-height:26px;margin:20px 0;color:#404040">
                      Your payment has been updated in our records, and you can view the complete fee summary anytime through your Parent Portal.
                    </p>

                    <p style="font-size:16px;line-height:26px;margin:16px 0;color:#404040">
                      If you have made any additional payments or notice any discrepancy in the above details,
                      please contact our support team at
                      <a href="mailto:finance@k12onlineschools.com" style="color:#007bff;text-decoration:none;">
                        finance@k12onlineschools.com
                      </a>
                      with the payment proof.
                    </p>

                    <p style="font-size:16px;line-height:26px;margin:16px 0;color:#404040">
                      Thank you for your timely payment and continued support.
                    </p>

                    <p style="font-size:16px;line-height:20px;margin:0;color:#404040;padding-top:10px;">
                      Warm regards,
                    </p>
                    <p style="font-size:16px;line-height:20px;margin:0;color:#404040;padding-top:5px;">
                        K12 Schools - Fee Department
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

module.exports = feesConfirmationMailTemplate;