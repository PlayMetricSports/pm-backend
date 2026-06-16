const Org = require("@/models/organisation/org.model");

const GetAllOrgsController = async (request, response) => {
    try {
        const { page = 1, limit = 10, search = "" } = request.query;
        const skip = (page - 1) * limit;
        let matchStage = { status: "active" }
        if (search) {
            matchStage["$or"] = [
                { name: { $regex: search, $options: "i" } },
                { organisationNumber: { $regex: search, $options: "i" } },
                { orgSubDomain: { $regex: search, $options: "i" } }
            ]
        }
        if (request.user?.org?._id) {
            matchStage._id = request.user?.orgId?._id
        }
        const query = matchStage


        const orgs = await Org.find(query)
            .populate("createdBy", "id firstName lastName email")
            .populate("updatedBy", "id firstName lastName email")
            .skip(skip)
            .limit(parseInt(limit))
            .sort({ createdAt: -1 });

        const total = await Org.countDocuments(query);

        return response.status(200).json({
            code: 200,
            success: true,
            data: {
                orgs,
                pagination: {
                    total,
                    page: parseInt(page),
                    limit: parseInt(limit),
                    pages: Math.ceil(total / limit)
                }
            },
            error: [],
            message: "Organisations fetched successfully."
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

module.exports = GetAllOrgsController;
