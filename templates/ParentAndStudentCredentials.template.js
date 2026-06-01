const ParentAndStudentsCredentials = (studentDataForEmail) => {
    const studentListItems = (studentDataForEmail?.studentDetails || [])
        .map(
            (student) => `
        <li style="margin-bottom:35px;">
          <p style="font-size:14px;margin:16px 0;font-weight:400;color:#404040;margin-left:40px;margin-bottom:25px">
            Username: ${student?.email || "N/A"}
          </p>
          <p style="font-size:14px;margin:16px 0;font-weight:400;color:#404040;margin-left:40px;margin-bottom:35px">
            Password: ${student?.password || "N/A"}
          </p>
        </li>
      `
        )
        .join(""); // join all <li> into one string
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
                                        We are excited to welcome you to our school community and are pleased to introduce you 
                                        to our Parent and Student Portals. These portals will provide you with seamless access 
                                        to important academic information, updates, and resources.
                                    </p>
                                    <p style="font-size:15px;line-height:26px;margin:16px 0;font-weight:400;color:#404040">
                                        Portal link :
                                        <a href="https://lms.k12onlineschools.com/login"
                                            style="color:#067df7;text-decoration-line:none;text-decoration:none"
                                            target="_blank">
                                            lms.k12onlineschools.com/login
                                        </a>
                                        (Same for parents and students)
                                    </p>
                                    <p
                                        style="font-size:15px;line-height:26px;margin:16px 0;font-weight:bolder;color:#404040">
                                        Parent Credentials:
                                    </p>
                                    <p
                                        style="font-size:14px;margin:16px 0;font-weight:400;color:#404040;margin-left:40px;margin-bottom:25px">
                                        Username: ${studentDataForEmail?.parentEmail}
                                    </p>
                                    <p
                                        style="font-size:14px;margin:16px 0;font-weight:400;color:#404040;margin-left:40px;margin-bottom:35px">
                                        Password: ${studentDataForEmail?.parentPassword}
                                    </p>
                                    <p
                                        style="font-size:15px;line-height:26px;margin:16px 0;font-weight:bolder;color:#404040">
                                        What you can access:
                                    </p>
                                     <ul style="list-style-position: outside; margin-left:40px; padding-left:20px; font-size:14px; color:#404040;">
					                    <li style="margin-bottom:35px;">
			   	                              <p style="font-size:15px;line-height:5px;margin:10px 0;font-weight:400;color:#404040">
                                                Student academic records.
                                            </p>
					                    </li>
					                    <li style="margin-bottom:35px;">
			   	                              <p style="font-size:15px;line-height:5px;margin:10px 0;font-weight:400;color:#404040">
                                                Report cards.
                                            </p>
					                    </li>
					                    <li style="margin-bottom:35px;">
			   	                              <p style="font-size:15px;line-height:5px;margin:10px 0;font-weight:400;color:#404040">
                                                Fee details.
                                            </p>
					                    </li>
					                    <li style="margin-bottom:35px;">
			   	                              <p style="font-size:15px;line-height:5px;margin:10px 0;font-weight:400;color:#404040">
                                                Class notes and updates.
                                            </p>
					                    </li>
					                </ul>
                                     <p
                                        style="font-size:15px;margin:16px 0;font-weight:400;color:#404040;margin-bottom:0;margin-top:25px">
                                        Student Login Credentials:
                                    </p>
                                    <ol style="list-style-position: outside; margin-left:40px; padding-left:20px; font-size:14px; color:#404040;">
					                    ${studentListItems}
					                </ol>
                                      <p
                                        style="font-size:15px;line-height:26px;margin:16px 0;font-weight:bolder;color:#404040">
                                        What students can access:
                                    </p>
                                    <ul style="list-style-position: outside; margin-left:40px; padding-left:20px; font-size:14px; color:#404040;">
					                    <li style="margin-bottom:35px;">
			   	                              <p style="font-size:15px;line-height:5px;margin:10px 0;font-weight:400;color:#404040">
                                                Online classes and sessions
                                            </p>
					                    </li>
					                    <li style="margin-bottom:35px;">
			   	                              <p style="font-size:15px;line-height:5px;margin:10px 0;font-weight:400;color:#404040">
                                                Assignments and learning materials
                                            </p>
					                    </li>
					                    <li style="margin-bottom:35px;">
			   	                              <p style="font-size:15px;line-height:5px;margin:10px 0;font-weight:400;color:#404040">
                                                Important course updates
                                            </p>
					                    </li>
                                        <li style="margin-bottom:35px;">
			   	                              <p style="font-size:15px;line-height:5px;margin:10px 0;font-weight:400;color:#404040">
                                                And many more ...
                                            </p>
					                    </li>
					                </ul>
                                    </p>
                                    <p style="font-size:15px;margin:16px 0;font-weight:400;color:#404040">
                                       If you encounter any issues accessing the portals or need assistance, please don’t hesitate to contact our Tech support team at:&nbsp;
                                        <a href="tel:+918448664002"
                                            style="color:#067df7;text-decoration-line:none;text-decoration:none"
                                            target="_blank">
                                            +91 84486 64002.
                                        </a>
                                    </p>
                                    <p
                                        style="font-size:15px;line-height:26px;margin:16px 0;font-weight:400;color:#404040">
                                        We understand that transitioning to online learning can feel like a big change, 
                                        and we are here to ensure that this process is as smooth and seamless as possible 
                                        for both you and your child.
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

module.exports = ParentAndStudentsCredentials;