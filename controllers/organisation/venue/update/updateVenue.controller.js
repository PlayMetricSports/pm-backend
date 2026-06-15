const Venue = require("@/models/organisation/venue.model");

const UpdateVenueController = async (request, response) => {
    try {
        const { venueId } = request.params;
        const userId = request.user._id;
        const updateData = { ...request.body, updatedBy: userId };

        const venue = await Venue.findByIdAndUpdate(venueId, updateData, { new: true, runValidators: true })
            .populate("orgId", "name")
            .populate("createdBy", "id firstName lastName email")
            .populate("updatedBy", "id firstName lastName email");

        if (!venue) {
            return response.status(200).json({
                code: 400,
                success: false,
                error: [
                    {
                        field: "popup",
                        message: "Venue not found"
                    }
                ],
                message: ""
            });
        }

        return response.status(200).json({
            code: 200,
            success: true,
            data: venue,
            error: [],
            message: "Venue updated successfully."
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

module.exports = UpdateVenueController;
