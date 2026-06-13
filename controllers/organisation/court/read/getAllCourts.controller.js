const Court = require("@/models/organisation/court.model");

const GetAllCourtsController = async (request, response) => {
    try {
        const { orgId, venueId, page = 1, limit = 10, search = "" } = request.query;

        const query = { status: "active" };
        if (search) {
            query.courtName = { $regex: search, $options: "i" };
        }
        if (orgId) {
            query.orgId = orgId;
        }
        if (venueId) {
            query.venueId = venueId;
        }

        const skip = (page - 1) * limit;

        const courts = await Court.find(query)
            .populate("orgId", "name")
            .populate("venueId", "name")
            .populate("sportId", "name")
            .populate("createdBy", "id firstName lastName email")
            .populate("updatedBy", "id firstName lastName email")
            .skip(skip)
            .limit(parseInt(limit))
            .sort({ createdAt: -1 });

        const total = await Court.countDocuments(query);

        return response.status(200).json({
            code: 200,
            success: true,
            data: {
                courts,
                pagination: {
                    total,
                    page: parseInt(page),
                    limit: parseInt(limit),
                    pages: Math.ceil(total / limit)
                }
            },
            error: [],
            message: "Courts fetched successfully."
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
