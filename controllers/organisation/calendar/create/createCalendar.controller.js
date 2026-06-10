const Calendar = require("@/models/organisation/calendar.model");

const CreateCalendarController = async (request, response) => {
    try {
        const { orgId, venueId, sportId, timeslotId, date, status, bookingId } = request.body;
        const userId = request.user.id;

        const newCalendar = await Calendar.create({
            orgId,
            venueId,
            sportId,
            timeslotId,
            date,
            status: status || "scheduled",
            bookingId,
            createdBy: userId,
            updatedBy: userId
        });

        return response.status(201).json({
            code: 201,
            success: true,
            data: newCalendar,
            error: [],
            message: "Calendar entry created successfully."
        });
    } catch (error) {
        return response.status(500).json({
            code: 500,
            success: false,
            error: [
                {
                    field: "popup",
                    message: `Error: ${error.message}`
                }
            ],
            message: ""
        });
    }
};

module.exports = CreateCalendarController;
