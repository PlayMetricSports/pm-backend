const Timetable = require("@/models/erp/timetable-old/timetable.model");

const GenerateTimetableReferenceNumber = async () => {
    try {
        const timetable = "TT";
        const date = new Date();
        const day = String(date.getDate()).padStart(2, "0");
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const year = date.getFullYear();
        const formattedDate = `${day}-${month}-${year}`;
        const randomCode = generateRandomTwoLetterCode();
        const timetableReferenceNumber = `${timetable}-${formattedDate}-${randomCode}`;

        const existingTimetableReferenceNumber = await Timetable.findOne({ timetableReferenceNumber: timetableReferenceNumber }).select("_id");

        if (existingTimetableReferenceNumber) {
            return GenerateTimetableReferenceNumber();
        } else {
            return {
                code: 200,
                success: true,
                data: {
                    timetableReferenceNumber: timetableReferenceNumber
                },
                error: [],
                message: "Timetable reference number generated successfully."
            };
        }
    }
    catch (error) {
        return {
            code: 500,
            success: false,
            error: [
                {
                    field: "popup",
                    message: `Error: ${error}`
                }
            ],
            message: ""
        };
    }
}

const generateRandomTwoLetterCode = () => {
    const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    let code = "";
    for (let i = 0; i < 2; i++) {
        code += letters.charAt(Math.floor(Math.random() * letters.length));
    }
    return code;
}

module.exports = GenerateTimetableReferenceNumber;