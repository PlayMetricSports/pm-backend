const Timeslot = require("@/models/organisation/timeslot.model");

const GetAllTimeslotsController = async (request, response) => {
    try {
        const { orgId, status, page = 1, limit = 10 } = request.query;

        const query = { orgId };
        if (status) query.timeSlotStatus = status;

        const skip = (page - 1) * limit;

        const timeslots = await Timeslot.find(query)
            .populate("orgId", "name")
            .populate("createdBy", "id firstName lastName email")
            .populate("updatedBy", "id firstName lastName email")
            .skip(skip)
            .limit(parseInt(limit))
            .sort({ slotIndex: 1 });

        const total = await Timeslot.countDocuments(query);

        return response.status(200).json({
            code: 200,
            success: true,
            data: {
                timeslots,
                pagination: {
                    total,
                    page: parseInt(page),
                    limit: parseInt(limit),
                    pages: Math.ceil(total / limit)
                }
            },
            error: [],
            message: "Timeslots fetched successfully."
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

module.exports = GetAllTimeslotsController;
