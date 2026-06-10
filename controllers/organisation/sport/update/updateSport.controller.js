const Sport = require("@/models/organisation/sport.model");

const UpdateSportController = async (request, response) => {
    try {
        const { sportId } = request.params;
        const userId = request.user.id;
        const updateData = { ...request.body, updatedBy: userId };

        const sport = await Sport.findByIdAndUpdate(sportId, updateData, { new: true, runValidators: true })
            .populate("orgId", "name")
            .populate("createdBy", "id firstName lastName email")
            .populate("updatedBy", "id firstName lastName email");

        if (!sport) {
            return response.status(200).json({
                code: 400,
                success: false,
                error: [
                    {
                        field: "popup",
                        message: "Sport not found"
                    }
                ],
                message: ""
            });
        }

        return response.status(200).json({
            code: 200,
            success: true,
            data: sport,
            error: [],
            message: "Sport updated successfully."
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

module.exports = UpdateSportController;
