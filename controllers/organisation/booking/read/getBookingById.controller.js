const Booking = require("@/models/organisation/booking.model");

const GetBookingByIdController = async (request, response) => {
    try {
        const { bookingId } = request.params;

        const booking = await Booking.findById(bookingId)
            .populate("orgId", "name")
            .populate("venueId", "name")
            .populate("sportId", "name")
            .populate("timeslotId", "startTime endTime")
            .populate("createdBy", "id firstName lastName email")
            .populate("updatedBy", "id firstName lastName email");

        if (!booking) {
            return response.status(200).json({
                code: 400,
                success: false,
                error: [
                    {
                        field: "popup",
                        message: "Booking entry not found"
                    }
                ],
                message: ""
            });
        }

        return response.status(200).json({
            code: 200,
            success: true,
            data: booking,
            error: [],
            message: "Booking entry fetched successfully."
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

module.exports = GetBookingByIdController;
