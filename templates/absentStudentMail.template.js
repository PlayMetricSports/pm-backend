const AbsentStudentMailTemplate = (data) => {

  const template = `
<!DOCTYPE html>
<html>
  <head>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
    <meta name="x-apple-disable-message-reformatting" />
    <title>Student Absence Notification – K12 Online Schools</title>
  </head>
  <body style="background-color:#F6F9FC;padding:10px 0;font-family:sans-serif;">
    <table align="center" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation"
           style="max-width:600px;background-color:#FFFFFF;border:1px solid #F0F0F0;padding:36px;border-radius:8px;">
      <tbody>
        <tr>
          <td>
            <p style="margin:0 0 12px 0;font-size:16px;line-height:24px;color:#404040;">
               Dear ${data?.parentName?.split(" ").map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(" ")},
            </p>

            <p style="margin:0 0 12px 0;font-size:16px;line-height:24px;color:#404040;">
                This is to inform you that your child
                    <strong style="font-weight:bold;">${data?.studentName?.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(' ')} - ${data?.admissionNumber || "N/A"}</strong> 
                    was Absent for the online class.
            </p>
             <p>
          <strong>Subject:</strong> ${data.subjectName}<br/>
          <strong>Date:</strong> ${data.classDate}<br/>
          <strong>Time:</strong> ${data.classTime}
        </p>

             <p style="margin:0 0 16px 0;font-size:16px;line-height:24px;color:#404040;">
              Regular attendance is important to ensure continuity in learning.
              If your child faced any difficulty in attending the class, we request you to kindly inform the school.
            </p>

            <p style="margin:0 0 16px 0;font-size:16px;line-height:24px;color:#404040;">
              For any queries or support, please contact us at
              <a href="mailto:support@k12onlineschools.com" style="color:#007bff;text-decoration:none;">
                support@k12onlineschools.com
              </a>.
            </p>
            <p style="margin:18px 0 0 0;font-size:16px;line-height:22px;color:#404040;">
              Warm regards,
            </p>
            <p style="margin:6px 0 0 0;font-size:16px;line-height:22px;color:#404040;">
            K12 Online Schools
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

module.exports = AbsentStudentMailTemplate;