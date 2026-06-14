const Booking = require("@/models/organisation/booking.model");
const { createSuccessResponse, createErrorResponse } = require('@/utils/helpers/errorFormat/errorFormatter');
const STATUS_CODES = require('@/utils/helpers/statusCodes.helper')
const handleCatchError = require("@/utils/middleware/errorHandler.middleware")
const DeleteBookingController = async (request, response) => {
    try {
        const { bookingId } = request.params;

        const booking = await Booking.findByIdAndDelete(bookingId);

        if (!booking) {
            return response.status(STATUS_CODES.NOT_FOUND).json(
                createErrorResponse(STATUS_CODES.NOT_FOUND, "popup", "Booking entry not found"));
        }
        return response.status(STATUS_CODES.OK).json(
            createSuccessResponse(STATUS_CODES.OK, booking, "Booking entry deleted successfully."));
    } catch (error) {
        return handleCatchError(error, response)
    }
};

module.exports = DeleteBookingController;
