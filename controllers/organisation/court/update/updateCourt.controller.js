const Court = require("@/models/organisation/court.model");

const UpdateCourtController = async (request, response) => {
    try {
        const { courtId } = request.params;
        const userId = request.user.id;
        const updateData = { ...request.body, updatedBy: userId };

        const court = await Court.findByIdAndUpdate(courtId, updateData, { new: true, runValidators: true })
            .populate("orgId", "name")
            .populate("venueId", "name")
            .populate("sportId", "name")
            .populate("createdBy", "id firstName lastName email")
            .populate("updatedBy", "id firstName lastName email");

        if (!court) {
            return response.status(200).json({
                code: 400,
                success: false,
                error: [
                    {
                        field: "popup",
                        message: "Court not found"
                    }
                ],
                message: ""
            });
        }

        return response.status(200).json({
            code: 200,
            success: true,
            data: court,
            error: [],
            message: "Court updated successfully."
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

module.exports = UpdateCourtController;
