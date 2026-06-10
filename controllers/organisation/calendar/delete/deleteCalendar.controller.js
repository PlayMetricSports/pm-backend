const Calendar = require("@/models/organisation/calendar.model");

const DeleteCalendarController = async (request, response) => {
    try {
        const { calendarId } = request.params;

        const calendar = await Calendar.findByIdAndDelete(calendarId);

        if (!calendar) {
            return response.status(200).json({
                code: 400,
                success: false,
                error: [
                    {
                        field: "popup",
                        message: "Calendar entry not found"
                    }
                ],
                message: ""
            });
        }

        return response.status(200).json({
            code: 200,
            success: true,
            data: calendar,
            error: [],
            message: "Calendar entry deleted successfully."
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

module.exports = DeleteCalendarController;
