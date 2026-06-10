const Venue = require("@/models/organisation/venue.model");

const GetAllVenuesController = async (request, response) => {
    try {
        const { orgId, page = 1, limit = 10, search = "" } = request.query;

        const query = { orgId, status: "active" };
        if (search) {
            query.name = { $regex: search, $options: "i" };
        }

        const skip = (page - 1) * limit;

        const venues = await Venue.find(query)
            .populate("orgId", "name")
            .populate("createdBy", "id firstName lastName email")
            .populate("updatedBy", "id firstName lastName email")
            .skip(skip)
            .limit(parseInt(limit))
            .sort({ createdAt: -1 });

        const total = await Venue.countDocuments(query);

        return response.status(200).json({
            code: 200,
            success: true,
            data: {
                venues,
                pagination: {
                    total,
                    page: parseInt(page),
                    limit: parseInt(limit),
                    pages: Math.ceil(total / limit)
                }
            },
            error: [],
            message: "Venues fetched successfully."
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

module.exports = GetAllVenuesController;
