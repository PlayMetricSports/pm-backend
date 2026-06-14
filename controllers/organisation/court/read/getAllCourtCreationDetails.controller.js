const Court = require("@/models/organisation/court.model");

const GetAllCourtsController = async (request, response) => {
    try {
        const { orgId, venueId, search } = request.query;

        const query = { status: "active" };
        if (orgId) {
            query.orgId = orgId;
        }
        if (venueId) {
            query.venueId = venueId;
        }
        if (search) {
            query.courtName = { $regex: search, $options: "i" };
        }

        const courts = await Court.distinct("courtName", query);

        return response.status(200).json({
            code: 200,
            success: true,
            data: courts,

            error: [],
            message: "Courts Details fetched successfully."
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

module.exports = GetAllCourtsController;
