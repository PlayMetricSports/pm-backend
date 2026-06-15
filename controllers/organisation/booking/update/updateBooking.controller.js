const Booking = require("@/models/organisation/booking.model");

const UpdateBookingController = async (request, response) => {
    try {
        const { bookingId } = request.params;
        const userId = request.user.id;
        const updateData = { ...request.body, updatedBy: userId };

        const booking = await Booking.findByIdAndUpdate(bookingId, updateData, { new: true, runValidators: true })
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
                        message: "booking entry not found"
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
            message: "Booking entry updated successfully."
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

module.exports = UpdateBookingController;
