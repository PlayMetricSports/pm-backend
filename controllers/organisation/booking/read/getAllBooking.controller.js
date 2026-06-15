const Booking = require("@/models/organisation/booking.model");

const GetAllBookingsController = async (request, response) => {
    try {
        const { orgId, venueId, sportId, status, page = 1, limit = 10 } = request.query;

        const query = {};
        if (orgId) query.orgId = orgId;
        if (venueId) query.venueId = venueId;
        if (sportId) query.sportId = sportId;
        if (status) query.status = status;

        const skip = (page - 1) * limit;

        const bookings = await Booking.find(query)
            .populate("orgId", "name")
            .populate("venueId", "name")
            .populate("sportId", "name")
            .populate("timeslotId", "startTime endTime")
            .populate("courtId", "courtName courtNumber")
            .populate("createdBy", "_id firstName lastName email")
            .populate("updatedBy", "_id firstName lastName email")
            .skip(skip)
            .limit(parseInt(limit))
            .sort({ date: -1 });

        const total = await Booking.countDocuments(query);

        return response.status(200).json({
            code: 200,
            success: true,
            data: {
                bookings,
                pagination: {
                    total,
                    page: parseInt(page),
                    limit: parseInt(limit),
                    pages: Math.ceil(total / limit)
                }
            },
            error: [],
            message: "Booking entries fetched successfully."
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

module.exports = GetAllBookingsController;
