/* eslint-disable no-undef */
const nodemailer = require("nodemailer");
let transporter = null;
let transporterTimeout = null;
const TRANSPORTER_LIFETIME = 2 * 60 * 1000; // 2 mins
const getTransporter = (params) => {
    if (transporter) {
        resetTransporterTimer();
        return transporter;
    }

    if (!transporter) {
        transporter = nodemailer.createTransport({
            service: process.env.SMTP_SERVICE,
            host: process.env.SMTP_HOST,
            port: process.env.SMTP_PORT,
            secure: false,
            pool: true,
            maxConnections: 1,
            maxMessages: 100,
            auth: {
                user: params?.username || process.env.SMTP_USERNAME,
                pass: params?.password || process.env.SMTP_PASSWORD,
            },
            timeout: 5000
        });
    }

    const originalClose = transporter.close.bind(transporter);
    transporter.close = () => {
        clearTimeout(transporterTimeout);
        console.log("Transporter closed manually.");
        transporter = null;
        return originalClose();
    };

    resetTransporterTimer();

    return transporter
}

function resetTransporterTimer() {
    if (transporterTimeout) clearTimeout(transporterTimeout);
    transporterTimeout = setTimeout(() => {
        if (transporter) {
            transporter.close();
            console.log("Transporter automatically closed after 2 minutes of use.");
            transporter = null;
        }
    }, TRANSPORTER_LIFETIME);
}
module.exports = getTransporter;
