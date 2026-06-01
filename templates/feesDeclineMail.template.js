const feesDeclineMailTemplate = (studentDataForEmail) => {

    const template = `
<!DOCTYPE html>
<html>
  <head>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
    <meta name="x-apple-disable-message-reformatting" />
    <title>Payment Declined Notification</title>
  </head>
  <body style="background-color:#F6F9FC;padding:10px 0;font-family:sans-serif;">
    <table align="center" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation"
           style="max-width:600px;background-color:#FFFFFF;border:1px solid #F0F0F0;padding:36px;border-radius:8px;">
      <tbody>
        <tr>
          <td>
            <p style="margin:0 0 12px 0;font-size:16px;line-height:24px;color:#404040;">
               Dear ${studentDataForEmail?.parentName?.split(" ").map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(" ")},
            </p>

            <p style="margin:0 0 12px 0;font-size:16px;line-height:24px;color:#404040;">
                This is to inform you that the payment submitted for your child
                    <strong style="font-weight:bold;">${studentDataForEmail?.studentName?.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(' ')} - ${studentDataForEmail?.admissionNumber || "N/A"}</strong> 
                    has been declined due to the following reason.
            </p>


            ${studentDataForEmail?.declineRemarks
            ? `<p style="margin:0 0 12px 0;font-size:16px;line-height:24px;color:#404040;">
                <strong style="font-weight:bold;">Reason for Decline:</strong> ${studentDataForEmail?.declineRemarks
                ?.charAt(0)
                .toUpperCase() + studentDataForEmail?.declineRemarks?.slice(1).toLowerCase()
            }
            </p>`
            : ""}


               <p style="margin:12px 0;font-size:16px;line-height:24px;color:#404040;">
               Kindly review the payment and reinitiate the transaction using one of the following methods:
            </p>

            <p style="margin:12px 0;font-size:16px;line-height:24px;color:#404040;">
               <strong style="font-weight:bold;">Payment Options:</strong>
            </p>

            <ul style="margin:0 0 16px 18px;font-size:15px;color:#404040;line-height:22px;">
              <li><strong style="font-weight:bold;">Parent Portal</strong>: Login → Go to Fee Section → Click on Pay Now</li>
            </ul>

            <p style="margin:0 0 16px 0;font-size:16px;line-height:24px;color:#404040;">
              If you have any queries or recommendations, please contact our support team at
              <a href="mailto:finance@k12onlineschools.com" style="color:#007bff;text-decoration:none;">
                finance@k12onlineschools.com
              </a>.
            </p>

            <p style="margin:18px 0 0 0;font-size:16px;line-height:22px;color:#404040;">
              Warm regards,
            </p>
            <p style="margin:6px 0 0 0;font-size:16px;line-height:22px;color:#404040;">
                K12 Schools - Fee Department
            </p>
          </td>
        </tr>
      </tbody>
    </table>
  </body>
</html>
`;
    return template;

}

module.exports = feesDeclineMailTemplate;