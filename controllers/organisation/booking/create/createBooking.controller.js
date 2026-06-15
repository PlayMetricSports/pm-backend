const Booking = require("@/models/organisation/booking.model");
const { ValidateQueryFiltersAndInsert, ValidateNonEmptyElements } = require("@/validators/main/validator/multivalidator.js")
const { createSuccessResponse, createErrorResponse } = require('@/utils/helpers/errorFormat/errorFormatter');
const STATUS_CODES = require('@/utils/helpers/statusCodes.helper')
const handleCatchError = require("@/utils/middleware/errorHandler.middleware")
const CreateCalendarController = async (request, response) => {
    try {

        // customerName: {
        //         firstName: {
        //             type: String,
        //             required: [true, "First name is required."],
        //             set: capitalizeWords,
        //             trim: true
        //         },
        //         middleName: {
        //             type: String,
        //             required: false,
        //             set: capitalizeWords,
        //             trim: true
        //         },
        //         lastName: {
        //             type: String,
        //             required: [true, "Last name is required."],
        //             set: capitalizeWords,
        //             trim: true
        //         }
        //     },
        //     customerPhone: {
        //         countryCode: {
        //             type: String,
        //             required: false,
        //             match: [/^\+[1-9]\d{0,2}$/, "Please enter a valid country code."],
        //         },
        //         number: {
        //             type: String,
        //             required: false,
        //             match: [
        //                 /^[6-9]\d{9}$/,
        //                 "Please enter a valid 10-digit Mobile number."
        //             ]
        //         },
        //     },
        //     customerEmail:
        //     {
        //         type: String,
        //         match: [
        //             /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
        //             "Please enter a valid email address.",
        //         ],
        //         required: false,
        //     },
        //     bookingDateTime: {
        //         type: String,
        //     },
        //     bookingCode: {
        //         type: String,
        //         required: [true, "Booking Code is required."]
        //     },
        //     TPA: {
        //         type: String,
        //         enum: TPATypeEnum,
        //         required: [true, "TPA Type is required."]
        //     },
        //     finDetails: {
        //         ticketAmount: { type: Number, required: [true, "Ticket Amount is required."] },
        //         convenienceFees: { type: Number, required: [true, "Convenience Fees is required."] },
        //         discount: { type: Number, required: [true, "Discount Amount is required."] },
        //         gstPercentage: { type: Number, },
        //         gstAmount: { type: Number, },
        //         totalAmount: { type: Number, required: [true, "Total Amount is required."] },
        //     },
        //     orgId: {
        //         type: mongoose.Schema.Types.ObjectId,
        //         ref: "Org",
        //         required: [true, "Organisation ID is required."]
        //     },
        //     venueId: {
        //         type: mongoose.Schema.Types.ObjectId,
        //         ref: "Venue",
        //         required: [true, "Venue ID is required."]
        //     },
        //     sportId: {
        //         type: mongoose.Schema.Types.ObjectId,
        //         ref: "Sport",
        //         required: [true, "Sport ID is required."]
        //     },
        //     timeslotId: {
        //         type: mongoose.Schema.Types.ObjectId,
        //         ref: "Timeslot",
        //         required: [true, "Timeslot ID is required."]
        //     },
        //     date: {
        //         type: Date,
        //         default: () => new Date(),
        //         required: [true, "Date is required."]
        //     },
        //     courtNumber: {
        //         type: Number,
        //     },
        //     courtName: {
        //         type: String,
        //         enum: courtNameEnums
        //     },


        function constructNameObject(firstName, middleName, lastName) {
            return ValidateQueryFiltersAndInsert({ firstName, middleName, lastName })
        }
        function constructMobileNumberObject(countryCode, number) {
            return ValidateQueryFiltersAndInsert({ countryCode, number })
        }

        function constructFinancialDetails(
            ticketAmount,
            convenienceFees,
            discount,
            gstPercentage,
            gstAmount,
            totalAmount) {
            return ValidateQueryFiltersAndInsert({
                ticketAmount,
                convenienceFees,
                discount,
                gstPercentage,
                gstAmount,
                totalAmount
            })
        }

        const crypto = require('crypto');

        function generateBookingCode(length = 8) {
            // Pool excludes: I, O, U, A, E, 0, 1 (Ambiguity & Vowel mitigation)
            const allowedChars = 'BCDFGHJKLMNPQRSTVWXYZ23456789';
            let result = '';

            while (result.length < length) {
                // Generate secure random bytes
                const bytes = crypto.randomBytes(length);
                for (let i = 0; i < bytes.length && result.length < length; i++) {
                    const index = bytes[i] % allowedChars.length;
                    result += allowedChars[index];
                }
            }
            return result;
        }

        async function generateUniqueBookingCode() {
            while (true) {
                const bookingCode = generateBookingCode();

                const existing = await Booking.findUnique({
                    where: { bookingCode }
                });

                if (!existing) {
                    return bookingCode;
                }
            }
        }

        async function getTimeSlots(orgId, startTime, endTime) {
            const Timeslot = require("@/models/organisation/timeslot.model");
            const findTimeSlots = await Timeslot.find({
                orgId, timeSlotStatus: "active",

                $or: [
                    { startTime },
                    { endTime }
                ]

            }).select("_id").lean()
            return findTimeSlots.map(ts => ts?._id)

        }


        let { firstName, middleName, lastName, countryCode, number, customerEmail, bookingDateTime, bookingCode, TPA = "Own", ticketAmount, convenienceFees, discount, gstPercentage, gstAmount, totalAmount, courtId, orgId, venueId, sportId, startTime, endTime, bookingDate = new Date(), status = "scheduled",
        } = request.body;


        const userId = request.user._id;

        const customerName = constructNameObject(firstName, middleName, lastName)
        const customerPhone = constructMobileNumberObject(countryCode, number)

        const bookingCodeError = ValidateNonEmptyElements({ bookingCode })
        if (bookingCodeError.length > 0) {
            bookingCode = await generateUniqueBookingCode()
        }

        const finDetails = constructFinancialDetails(ticketAmount, convenienceFees, discount, gstPercentage, gstAmount, totalAmount)

        const timeslotId = await getTimeSlots(orgId, startTime, endTime)
        if (timeslotId?.length == 0) {
            return response.status(STATUS_CODES.BAD_REQUEST).json(
                createErrorResponse(STATUS_CODES.BAD_REQUEST, "popup", "No TimeSlots found within the start and end Timings"));
        }

        const newBooking = await Booking.create({
            customerName,
            customerPhone,
            customerEmail,
            bookingDateTime,
            bookingCode,
            TPA,
            finDetails,
            orgId,
            venueId,
            sportId,
            courtId,
            timeslotId,
            bookingDate,
            status,
            createdBy: userId,
            updatedBy: userId
        });

        return response.status(STATUS_CODES.CREATED).json(
            createSuccessResponse(STATUS_CODES.CREATED, newBooking, "Booking entry created successfully."));
    } catch (error) {
        return response.status(500).json({
            code: 500,
            success: false,
            error: [
                {
                    field: "popup",
                    message: `Error: ${error.message} `
                }
            ],
            message: ""
        });
    }
};

module.exports = CreateCalendarController;
