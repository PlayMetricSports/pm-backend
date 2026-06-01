const LateTeacherJoinMailTemplate = (data) => {
    const template = `
<!DOCTYPE html>
<html>
  <head>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
    <meta name="x-apple-disable-message-reformatting" />
    <title>Teacher Late Join Notification</title>
  </head>
  <body style="background-color:#F6F9FC;padding:10px 0;font-family:sans-serif;">
    <table align="center" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation"
           style="max-width:600px;background-color:#FFFFFF;border:1px solid #F0F0F0;padding:36px;border-radius:8px;">
      <tbody>
        <tr>
          <td>
            <p style="margin:0 0 12px 0;font-size:16px;line-height:24px;color:#404040;">
               Dear Admin,
            </p>

            <p>The following class was started late by the teacher.</p>

            <table border="1" cellpadding="8" cellspacing="0">
                <tr>
                    <td><strong>Teacher Name</strong></td>
                    <td>${data.teacherName}</td>
                </tr>
                <tr>
                    <td><strong>Subject</strong></td>
                    <td>${data.subjectName}</td>
                </tr>
                <tr>
                    <td><strong>Class Date</strong></td>
                    <td>${data.classDate}</td>
                </tr>
                <tr>
                    <td><strong>Scheduled Start Time</strong></td>
                    <td>${data.scheduledTime}</td>
                </tr>
                <tr>
                    <td><strong>Actual Join Time</strong></td>
                    <td>${data.actualJoinTime}</td>
                </tr>
                <tr>
                    <td><strong>Delay (Minutes)</strong></td>
                    <td>${data.delayMinutes} minutes</td>
                </tr>
            </table>

            <p>Please review and take necessary action.</p>
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
};

module.exports = LateTeacherJoinMailTemplate;
