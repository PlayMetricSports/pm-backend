const Calendar = require("@/models/organisation/calendar.model");

const UpdateCalendarController = async (request, response) => {
    try {
        const { calendarId } = request.params;
        const userId = request.user.id;
        const updateData = { ...request.body, updatedBy: userId };

        const calendar = await Calendar.findByIdAndUpdate(calendarId, updateData, { new: true, runValidators: true })
            .populate("orgId", "name")
            .populate("venueId", "name")
            .populate("sportId", "name")
            .populate("timeslotId", "startTime endTime")
            .populate("createdBy", "id firstName lastName email")
            .populate("updatedBy", "id firstName lastName email");

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
            message: "Calendar entry updated successfully."
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

module.exports = UpdateCalendarController;
