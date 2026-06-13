require("module-alias/register");
require("dotenv").config();
const { connectDB } = require("@/utils/connections/database/connectDB");
const { google } = require("googleapis");

/*******************************************************
 * Fields to populate 
 *  
 *  bookingId: 
 *  bookingDateTime:
 *  
 *  customerName:
 *  customerPhone:
 *  customerEmail:
 *  
 *  venue:
 *  sport:
 *  slotTimings:
 *  courtName or courtType:
 *  courtNumber:
 *  
 *  ticketAmount:
 *  convenienceFee:
 *  discount:
 *  totalAmount:
 *  status:
 *  
 *  tpa:
 *  emailSentAt:
 *  
 *  -----Extra Details-------
 *  commissionAmt:
 *  
 *  when status == "cancelled"
 *  Cancellation Fees 
 *  Refund Amount 
 *  
 *  
*******************************************************/
const mongoose = require("mongoose");

const SPORTS_REGEX =
    /\b(football|pickleball|badminton|cricket|tennis|table tennis|basketball|volleyball|squash|padle|futsal|swimming)\b/i;

function decodeBase64(data) {
    return Buffer.from(
        data.replace(/-/g, "+").replace(/_/g, "/"),
        "base64"
    ).toString("utf8");
}

function extractBody(payload) {
    if (payload.body?.data) {
        return decodeBase64(payload.body.data);
    }

    if (payload.parts) {
        for (const part of payload.parts) {
            if (
                (part.mimeType === "text/plain" ||
                    part.mimeType === "text/html") &&
                part.body?.data
            ) {
                return decodeBase64(part.body.data);
            }

            if (part.parts) {
                const nested = extractBody(part);
                if (nested) return nested;
            }
        }
    }

    return "";
}

function detectTPA(subject, body) {
    if (body.includes("district.in")) {
        return "District";
    }

    if (
        body.includes("playo.co") ||
        body.includes("Playo App")
    ) {
        return "Playo";
    }

    return "Unknown";
}
function extractAmount(body, fieldName) {
    const regex = new RegExp(
        `${fieldName}[\\s\\S]*?(?:Rs\\.?|₹)\\s*(\\d+(?:\\.\\d+)?)`,
        "i"
    );

    return Number(body.match(regex)?.[1] || 0);
}
function extractVenueFieldAndNextValue(body) {


    const match = body.match(/Venue\s+([\s\S]*?)\s+([A-Z0-9]{6})\s+/i);

    if (!match) {
        return null;
    }

    return {
        venue: match[1].trim(),
        bookingId: match[2].trim()
    };
}
function extractSport(subject, body) {
    const patterns = [
        SPORTS_REGEX,
        /Booking for\s+\*?([A-Za-z ]+?)\s+at/i,
        /Sport:\s*\*?([A-Za-z ]+?)\*?(?:\n|$)/i,
        /Your\s+([A-Za-z ]+?)\s+booking/i,
    ];

    for (const pattern of patterns) {
        const match = (body.match(pattern) || subject.match(pattern));

        if (match?.[1]) {
            return match[1].trim().toLowerCase();
        }
    }

    return null;
}
function extractCourtNumber(body, sport) {
    if (!body) return null;

    if (sport?.toLowerCase() === "badminton") {
        return (
            body.match(/\*Court ?(\d+)/i)?.[1] ||
            null
        );
    }

    return (
        body.match(/Court-\s?(\d+)/i)?.[1] ||
        body.match(/Turf[- ]?(\d+)/i)?.[1] ||
        body.match(/Court\s+(\d+)/i)?.[1] ||
        body.match(/Court:\s*\*?([^*\n]+)/i)?.[1]?.trim() ||
        null
    );
}

function extractSlotTimings(body, sport, status) {
    return sport.toLowerCase() === "football" && status !== "cancelled" ?
        body.match(/@(\d{1,2}:\d{2}\s*[AP]M)-(\d{1,2}:\d{2}\s*[AP]M)/i) !== null ?
            `${body.match(/@(\d{1,2}:\d{2}\s*[AP]M)-(\d{1,2}:\d{2}\s*[AP]M)/i)?.[1]}-${body.match(/@(\d{1,2}:\d{2}\s*[AP]M)-(\d{1,2}:\d{2}\s*[AP]M)/i)?.[2]}` :
            body.match(/Slot:\s*\*?(\d{1,2}:\d{2}\s*[AP]M-\d{1,2}:\d{2}\s*[AP]M)\*?/i)?.[1] || body.match(/Slot:\s*\*?([A-Za-z ]+)\*?/i)?.[1]?.trim() || null :
        status === "cancelled" ?
            body.match(/Slot:\s*\*?(\d{1,2}:\d{2}\s*[AP]M-\d{1,2}:\d{2}\s*[AP]M)\*?/i)?.[1] :
            body.match(/Slot:\s*\*?([A-Za-z ]+)\*?/i)?.[1]?.trim()
}

function parseDistrict(subject, body) {

    const { venue, bookingId } = extractVenueFieldAndNextValue(body)
    const ticketAmount = extractAmount(body, "Ticket Amount")

    const convenienceFee = extractAmount(body, "Convenience Fee")

    const discount = extractAmount(body, "Discount")

    const totalAmount = extractAmount(body, "Total Amount")

    const sport = extractSport(subject, body)
    return {
        bookingId: bookingId,
        bookingDateTime: body.match(/Date\s+([^\n]+)/i)?.[1],

        customerName: body.match(/Name\s+([\s\S]*?)\s+Email/i)?.[1]?.trim(),
        customerPhone: body.match(/Phone\s+(\d{10})/i)?.[1],
        customerEmail: null,

        venue: venue,
        sport: sport,
        slotTimings: null,
        courtName: null,
        courtNumber: extractCourtNumber(body, sport),

        ticketAmount,
        convenienceFee,
        discount,
        totalAmount,
        status: "confirmed"
    };
}

function parsePlayo(subject, body) {

    let status = "confirmed";

    if (subject.toLowerCase().includes("cancel"))
        status = "cancelled";

    if (subject.toLowerCase().includes("rescheduled"))
        status = "rescheduled";


    const bookingId =
        subject.match(/\[([A-Z0-9]+)\]/)?.[1]
        || body.match(/Booking ID:\s*\*?([A-Z0-9]+)\*?/i)?.[1];

    const sport = extractSport(subject, body);
    // if (sport.toLowerCase() == "badminton") {
    //     console.log(body)
    // }
    const sportFormat = sport.toLowerCase() === "football" ?
        body.match(/^\*?([^@]*?)\s+Turf-/i)?.[1]?.trim() : null;
    const match = body.match(
        /Court:\s*\*?Court\s+(.+?)\s+(\d+)\*?/i
    );

    const courtType = match?.[1]?.trim() || null;

    // const courtName = sport === "football" ?
    //     body.match(/(Turf-\d+)/i)?.[1] : null;

    const bookingDateTime =
        body.match(
            /Booked on\s+(\d{1,2}\s+[A-Za-z]{3}\s+\d{4},\s+\d{1,2}:\d{2}\s*[AP]M)/i
        )?.[1];
    const courtNumber = sport.toLowerCase() === "badminton" ?
        match?.[2] || null
        :
        body.match(/Court- ?(\d+)/i)?.[1] ||
        body.match(/Court:\s*\*?([A-Za-z ]+)\*?/i)?.[1]?.trim() ||
        body.match(/Turf[- ]?(\d+)/i)?.[1] ||
        null;

    const customerName =
        body.match(/\Hey\s+([^,*]+)/i)?.[1];

    const slotTimings = extractSlotTimings(body, sport, status)

    const ticketAmount = extractAmount(body, "Court Price:")

    const convenienceFee = extractAmount(body, "Convenience Fee:")

    const discount = extractAmount(body, "Discount / Karma availed:")

    const totalAmount = extractAmount(body, "Gross Amount:")

    return {
        bookingId,
        bookingDateTime,

        customerName,
        customerPhone: null,
        customerEmail: null,

        venue: null,
        sport: sport ? sport.toLowerCase() : null,
        courtName: null,
        courtNumber,
        slotTimings,

        ticketAmount,
        convenienceFee,
        discount,
        totalAmount,
        status
    };
}

function normalizeEmail(email) {

    console.log(email)
    const tpa = detectTPA(
        email.subject,
        email.body
    );

    if (tpa === "District") {
        const d = parseDistrict(email.subject, email.body);

        return {
            ...d,
            tpa,
            emailSentAt: email.sentAt
        };
    }

    if (tpa === "Playo") {
        const p = parsePlayo(
            email.subject,
            email.body
        );

        return {
            ...p,
            tpa,
            emailSentAt: email.sentAt
        };
    }

    return null;
}
const viewForwardedMailsAndPerformETLScript = async () => {
    try {

        await connectDB()

        const auth = new google.auth.OAuth2(
            process.env.GOOGLE_OAUTH_CLIENT_ID,
            process.env.GOOGLE_OAUTH_CLIENT_SECRET
        );


        auth.setCredentials({
            refresh_token: process.env.GOOGLE_OAUTH_REFRESH_TOKEN
        });

        const gmail = google.gmail({
            version: "v1",
            auth
        });

        // console.log(gmail)
        async function run() {
            const response = await gmail.users.messages.list({
                userId: "me",
                q: "from:vivektushir7@gmail.com newer_than:30d",
                maxResults: 20,
            });

            const messages = response.data.messages || [];

            console.log(`Found ${messages.length} emails\n`);

            for (const msg of messages) {
                const email = await gmail.users.messages.get({
                    userId: "me",
                    id: msg.id,
                });

                const headers = email.data.payload.headers;


                const subject =
                    headers.find((h) => h.name === "Subject")?.value || "";

                const from =
                    headers.find((h) => h.name === "From")?.value || "";

                const sentAt =
                    headers.find((h) => h.name === "Date")?.value || "";

                const body = extractBody(email.data.payload);
                const normalized = normalizeEmail({
                    subject,
                    body,
                    sentAt,
                    from
                });
                console.log(normalized)
                // const { bookingId,
                //     sport,
                //     customerName,
                //     courtNumber,
                //     slotTimings,
                //     status
                // }
                // console.log("================================");
                // console.log("FROM:", from);
                // console.log("SUBJECT:", subject);
                // console.log("DATE:", date);
                // console.log("BODY:");
                // console.log(body.substring(0, 1000));
                // console.log("================================\n");
            }
        }

        await run().catch(console.error)
        process.exit(1)
    } catch (error) {
        console.log(error)
        process.exit(0)
    }
}
viewForwardedMailsAndPerformETLScript();
