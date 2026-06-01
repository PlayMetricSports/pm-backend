const moment = require("moment");

const PaymentSuccessTemplate = (params) => {
    const template = `
    <!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
    <html dir="ltr" lang="en">
        <head>
            <link rel="preload" as="image"
                href="https://lms.k12onlineschools.com/_next/image?url=%2Fassets%2Fimg%2Fk12schools-logo.webp&amp;w=384&amp;q=1" />
            <meta content="text/html; charset=UTF-8" http-equiv="Content-Type" />
            <meta name="x-apple-disable-message-reformatting" />
            <style>
                .container_padding {
                    padding: 45px !important;
                }
                @media (max-width: 600px) {
                    .container_padding {
                        padding: 10px !important;
                    }
                }
            </style>
        </head>
        <body style="background-color:#F6F9FC;padding:10px 0px;font-family:sans-serif">
            <table align="center" width="100%" class="container_padding" border="0" cellPadding="0" cellSpacing="0"
                role="presentation"
                style="max-width:37.5em;background-color:#f8fffc;border:1px solid #00df86;padding:45px;border-radius:10px">
                <tbody>
                    <tr style="width:100%">
                        <td>
                            <table align="center" width="100%" border="0" cellPadding="0" cellSpacing="0" role="presentation">
                                <tbody>
                                    <tr>
                                        <td>
                                            <p
                                                style="font-size:13px;line-height:20px;margin:0px;text-align:center;font-weight:300;color:#787676">
                                                Hi ${CreateName(params?.transaction?.userId?.name)}, Congratulation!</p>
                                            <p
                                                style="font-size:22px;line-height:20px;margin:5px 0px 5px 0px;font-weight:500;color:#00df86;text-align:center">
                                                Payment Successful</p>
                                            <p
                                                style="font-size:18px;line-height:20px;margin:8px 0px 8px 0px;font-weight:300;color:#787676;text-align:center">
                                                Total Amount Paid : ${params?.transaction?.amountPaid} ${params?.transaction?.currency}</p>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                            <table align="center" width="100%" border="0" cellPadding="0" cellSpacing="0" role="presentation"
                                style="margin-top:20px">
                                <tbody>
                                    <tr>
                                        <td>
                                            <table align="center" width="100%" border="0" cellPadding="0" cellSpacing="8"
                                                role="presentation">
                                                <tbody style="width:100%">
                                                    <tr style="width:100%">
                                                        <td data-id="__react-email-column" style="width:50%">
                                                            <p
                                                                style="font-size:13px;line-height:20px;margin:0px;font-weight:300;color:#787676;display:flex;align-item:center">
                                                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16"
                                                                    fill="currentColor" class="bi bi-postcard"
                                                                    viewBox="0 0 16 16" style="margin-right:5px">
                                                                    <path fill-rule="evenodd"
                                                                        d="M2 2a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2zM1 4a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1zm7.5.5a.5.5 0 0 0-1 0v7a.5.5 0 0 0 1 0zM2 5.5a.5.5 0 0 1 .5-.5H6a.5.5 0 0 1 0 1H2.5a.5.5 0 0 1-.5-.5m0 2a.5.5 0 0 1 .5-.5H6a.5.5 0 0 1 0 1H2.5a.5.5 0 0 1-.5-.5m0 2a.5.5 0 0 1 .5-.5H6a.5.5 0 0 1 0 1H2.5a.5.5 0 0 1-.5-.5M10.5 5a.5.5 0 0 0-.5.5v3a.5.5 0 0 0 .5.5h3a.5.5 0 0 0 .5-.5v-3a.5.5 0 0 0-.5-.5zM13 8h-2V6h2z">
                                                                    </path>
                                                                </svg> <!-- -->Transaction ID
                                                            </p>
                                                            <p
                                                                style="font-size:14px;line-height:20px;margin:0px;font-weight:300;color:#404040;padding-left:22px">
                                                                ${params?.transactionNumber}</p>
                                                        </td>
                                                        <td data-id="__react-email-column" style="width:50%">
                                                            <p
                                                                style="font-size:13px;line-height:20px;margin:0px;font-weight:300;color:#787676;display:flex;align-item:center">
                                                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16"
                                                                    fill="currentColor" class="bi bi-journals"
                                                                    viewBox="0 0 16 16" style="margin-right:5px">
                                                                    <path
                                                                        d="M5 0h8a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2 2 2 0 0 1-2 2H3a2 2 0 0 1-2-2h1a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V4a1 1 0 0 0-1-1H3a1 1 0 0 0-1 1H1a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v9a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H5a1 1 0 0 0-1 1H3a2 2 0 0 1 2-2">
                                                                    </path>
                                                                    <path
                                                                        d="M1 6v-.5a.5.5 0 0 1 1 0V6h.5a.5.5 0 0 1 0 1h-2a.5.5 0 0 1 0-1zm0 3v-.5a.5.5 0 0 1 1 0V9h.5a.5.5 0 0 1 0 1h-2a.5.5 0 0 1 0-1zm0 2.5v.5H.5a.5.5 0 0 0 0 1h2a.5.5 0 0 0 0-1H2v-.5a.5.5 0 0 0-1 0">
                                                                    </path>
                                                                </svg> <!-- -->Product
                                                            </p>
                                                            <p
                                                                style="font-size:13px;line-height:20px;margin:0px;font-weight:300;color:#404040;padding-left:22px">
                                                                ${params?.transaction?.productInfo}</p>
                                                        </td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                            <table align="center" width="100%" border="0" cellPadding="0" cellSpacing="8"
                                                role="presentation">
                                                <tbody style="width:100%">
                                                    <tr style="width:100%">
                                                        <td data-id="__react-email-column" style="width:50%">
                                                            <p
                                                                style="font-size:13px;line-height:20px;margin:0px;font-weight:300;color:#787676;display:flex;align-item:center">
                                                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16"
                                                                    fill="currentColor" class="bi bi-person-lines-fill"
                                                                    viewBox="0 0 16 16" style="margin-right:5px">
                                                                    <path
                                                                        d="M6 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6m-5 6s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1zM11 3.5a.5.5 0 0 1 .5-.5h4a.5.5 0 0 1 0 1h-4a.5.5 0 0 1-.5-.5m.5 2.5a.5.5 0 0 0 0 1h4a.5.5 0 0 0 0-1zm2 3a.5.5 0 0 0 0 1h2a.5.5 0 0 0 0-1zm0 3a.5.5 0 0 0 0 1h2a.5.5 0 0 0 0-1z">
                                                                    </path>
                                                                </svg>Name
                                                            </p>
                                                            <p
                                                                style="font-size:13px;line-height:20px;margin:0px;font-weight:300;color:#404040;padding-left:22px">
                                                                ${CreateName(params?.transaction?.userId?.name)}</p>
                                                        </td>
                                                        <td data-id="__react-email-column" style="width:50%">
                                                            <p
                                                                style="font-size:13px;line-height:20px;margin:0px;font-weight:300;color:#787676;display:flex;align-item:center">
                                                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16"
                                                                    fill="currentColor" class="bi bi-cash-stack"
                                                                    viewBox="0 0 16 16" style="margin-right:5px">
                                                                    <path
                                                                        d="M1 3a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1zm7 8a2 2 0 1 0 0-4 2 2 0 0 0 0 4">
                                                                    </path>
                                                                    <path
                                                                        d="M0 5a1 1 0 0 1 1-1h14a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1H1a1 1 0 0 1-1-1zm3 0a2 2 0 0 1-2 2v4a2 2 0 0 1 2 2h10a2 2 0 0 1 2-2V7a2 2 0 0 1-2-2z">
                                                                    </path>
                                                                </svg>Amount
                                                            </p>
                                                            <p
                                                                style="font-size:13px;line-height:20px;margin:0px;font-weight:300;color:#404040;padding-left:22px">
                                                                ${params?.transaction?.amountPaid} ${params?.transaction?.currency}</p>
                                                        </td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                            <table align="center" width="100%" border="0" cellPadding="0" cellSpacing="8"
                                                role="presentation">
                                                <tbody style="width:100%">
                                                    <tr style="width:100%">
                                                        <td data-id="__react-email-column" style="width:50%">
                                                            <p
                                                                style="font-size:13px;line-height:20px;margin:0px;font-weight:300;color:#787676;display:flex;align-item:center">
                                                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16"
                                                                    fill="currentColor" class="bi bi-calendar-check"
                                                                    viewBox="0 0 16 16" style="margin-right:5px">
                                                                    <path
                                                                        d="M10.854 7.146a.5.5 0 0 1 0 .708l-3 3a.5.5 0 0 1-.708 0l-1.5-1.5a.5.5 0 1 1 .708-.708L7.5 9.793l2.646-2.647a.5.5 0 0 1 .708 0">
                                                                    </path>
                                                                    <path
                                                                        d="M3.5 0a.5.5 0 0 1 .5.5V1h8V.5a.5.5 0 0 1 1 0V1h1a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V3a2 2 0 0 1 2-2h1V.5a.5.5 0 0 1 .5-.5M1 4v10a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V4z">
                                                                    </path>
                                                                </svg>Date
                                                            </p>
                                                            <p
                                                                style="font-size:13px;line-height:20px;margin:0px;font-weight:300;color:#404040;padding-left:22px">
                                                                ${moment(params?.payment?.addedon).format("Do MMM, YYYY")}</p>
                                                        </td>
                                                        <td data-id="__react-email-column" style="width:50%">
                                                            <p
                                                                style="font-size:13px;line-height:20px;margin:0px;font-weight:300;color:#787676;display:flex;align-item:center">
                                                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16"
                                                                    fill="currentColor" class="bi bi-alarm" viewBox="0 0 16 16"
                                                                    style="margin-right:5px">
                                                                    <path
                                                                        d="M8.5 5.5a.5.5 0 0 0-1 0v3.362l-1.429 2.38a.5.5 0 1 0 .858.515l1.5-2.5A.5.5 0 0 0 8.5 9z">
                                                                    </path>
                                                                    <path
                                                                        d="M6.5 0a.5.5 0 0 0 0 1H7v1.07a7.001 7.001 0 0 0-3.273 12.474l-.602.602a.5.5 0 0 0 .707.708l.746-.746A6.97 6.97 0 0 0 8 16a6.97 6.97 0 0 0 3.422-.892l.746.746a.5.5 0 0 0 .707-.708l-.601-.602A7.001 7.001 0 0 0 9 2.07V1h.5a.5.5 0 0 0 0-1zm1.038 3.018a6 6 0 0 1 .924 0 6 6 0 1 1-.924 0M0 3.5c0 .753.333 1.429.86 1.887A8.04 8.04 0 0 1 4.387 1.86 2.5 2.5 0 0 0 0 3.5M13.5 1c-.753 0-1.429.333-1.887.86a8.04 8.04 0 0 1 3.527 3.527A2.5 2.5 0 0 0 13.5 1">
                                                                    </path>
                                                                </svg>Time
                                                            </p>
                                                            <p
                                                                style="font-size:13px;line-height:20px;margin:0px;font-weight:300;color:#404040;padding-left:22px">
                                                                ${moment(params?.payment?.addedon).format("hh:MM A")}</p>
                                                        </td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                            <table align="center" width="100%" border="0" cellPadding="0" cellSpacing="8"
                                                role="presentation">
                                                <tbody style="width:100%">
                                                    <tr style="width:100%">
                                                        <td data-id="__react-email-column" style="width:50%">
                                                            <p
                                                                style="font-size:13px;line-height:20px;margin:0px;font-weight:300;color:#787676;display:flex;align-item:center">
                                                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16"
                                                                    fill="currentColor" class="bi bi-bank" viewBox="0 0 16 16"
                                                                    style="margin-right:5px">
                                                                    <path
                                                                        d="m8 0 6.61 3h.89a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-.5.5H15v7a.5.5 0 0 1 .485.38l.5 2a.498.498 0 0 1-.485.62H.5a.498.498 0 0 1-.485-.62l.5-2A.5.5 0 0 1 1 13V6H.5a.5.5 0 0 1-.5-.5v-2A.5.5 0 0 1 .5 3h.89zM3.777 3h8.447L8 1zM2 6v7h1V6zm2 0v7h2.5V6zm3.5 0v7h1V6zm2 0v7H12V6zM13 6v7h1V6zm2-1V4H1v1zm-.39 9H1.39l-.25 1h13.72z">
                                                                    </path>
                                                                </svg>Bank
                                                            </p>
                                                            <p
                                                                style="font-size:13px;line-height:20px;margin:0px;font-weight:300;color:#404040;padding-left:22px">
                                                                ${params?.payment?.bankcode}</p>
                                                        </td>
                                                        <td data-id="__react-email-column" style="width:50%">
                                                            <p
                                                                style="font-size:13px;line-height:20px;margin:0px;font-weight:300;color:#787676;display:flex;align-item:center">
                                                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16"
                                                                    fill="currentColor" class="bi bi-pass" viewBox="0 0 16 16"
                                                                    style="margin-right:5px">
                                                                    <path
                                                                        d="M5.5 5a.5.5 0 0 0 0 1h5a.5.5 0 0 0 0-1zm0 2a.5.5 0 0 0 0 1h3a.5.5 0 0 0 0-1z">
                                                                    </path>
                                                                    <path
                                                                        d="M8 2a2 2 0 0 0 2-2h2.5A1.5 1.5 0 0 1 14 1.5v13a1.5 1.5 0 0 1-1.5 1.5h-9A1.5 1.5 0 0 1 2 14.5v-13A1.5 1.5 0 0 1 3.5 0H6a2 2 0 0 0 2 2m0 1a3 3 0 0 1-2.83-2H3.5a.5.5 0 0 0-.5.5v13a.5.5 0 0 0 .5.5h9a.5.5 0 0 0 .5-.5v-13a.5.5 0 0 0-.5-.5h-1.67A3 3 0 0 1 8 3">
                                                                    </path>
                                                                </svg>Bank UTR Number
                                                            </p>
                                                            <p
                                                                style="font-size:13px;line-height:20px;margin:0px;font-weight:300;color:#404040;padding-left:22px">
                                                                ${params?.payment?.bank_ref_num}</p>
                                                        </td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                            <table align="center" width="100%" border="0" cellPadding="0" cellSpacing="8"
                                                role="presentation">
                                                <tbody style="width:100%">
                                                    <tr style="width:100%">
                                                        ${params?.payment?.field1 ? `<td data-id="__react-email-column" style="width:50%">
                                                            <p
                                                                style="font-size:13px;line-height:20px;margin:0px;font-weight:300;color:#787676;display:flex;align-item:center">
                                                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16"
                                                                    fill="currentColor" class="bi bi-passport"
                                                                    viewBox="0 0 16 16" style="margin-right:5px">
                                                                    <path
                                                                        d="M8 5a3 3 0 1 0 0 6 3 3 0 0 0 0-6M6 8a2 2 0 1 1 4 0 2 2 0 0 1-4 0m-.5 4a.5.5 0 0 0 0 1h5a.5.5 0 0 0 0-1z">
                                                                    </path>
                                                                    <path
                                                                        d="M3.232 1.776A1.5 1.5 0 0 0 2 3.252v10.95c0 .445.191.838.49 1.11.367.422.908.688 1.51.688h8a2 2 0 0 0 2-2V4a2 2 0 0 0-1-1.732v-.47A1.5 1.5 0 0 0 11.232.321l-8 1.454ZM4 3h8a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1">
                                                                    </path>
                                                                </svg>Bank Account Number
                                                            </p>
                                                            <p
                                                                style="font-size:13px;line-height:20px;margin:0px;font-weight:300;color:#404040;padding-left:22px">
                                                                ${params?.payment?.field1}</p>
                                                        </td>` : ``}
                                                        <td data-id="__react-email-column" style="width:50%">
                                                            <p
                                                                style="font-size:13px;line-height:20px;margin:0px;font-weight:300;color:#787676;display:flex;align-item:center">
                                                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16"
                                                                    fill="currentColor" class="bi bi-person-check"
                                                                    viewBox="0 0 16 16" style="margin-right:5px">
                                                                    <path
                                                                        d="M12.5 16a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7m1.679-4.493-1.335 2.226a.75.75 0 0 1-1.174.144l-.774-.773a.5.5 0 0 1 .708-.708l.547.548 1.17-1.951a.5.5 0 1 1 .858.514M11 5a3 3 0 1 1-6 0 3 3 0 0 1 6 0M8 7a2 2 0 1 0 0-4 2 2 0 0 0 0 4">
                                                                    </path>
                                                                    <path
                                                                        d="M8.256 14a4.5 4.5 0 0 1-.229-1.004H3c.001-.246.154-.986.832-1.664C4.484 10.68 5.711 10 8 10q.39 0 .74.025c.226-.341.496-.65.804-.918Q8.844 9.002 8 9c-5 0-6 3-6 4s1 1 1 1z">
                                                                    </path>
                                                                </svg>Reciever
                                                            </p>
                                                            <p
                                                                style="font-size:13px;line-height:20px;margin:0px;font-weight:300;color:#404040;padding-left:22px">
                                                                Edovu Ventures</p>
                                                        </td>
                                                    </tr>
                                                </tbody>
                                            </table>
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

let CreateName = (name) => {
    return `${name?.firstName} ${name?.middleName ? name?.middleName + " " + name?.lastName : name?.lastName}`;
}

module.exports = PaymentSuccessTemplate;