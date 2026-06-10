const Venue = require("@/models/organisation/venue.model");

const GetVenueByIdController = async (request, response) => {
    try {
        const { venueId } = request.params;

        const venue = await Venue.findById(venueId)
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
            message: "Venue fetched successfully."
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

module.exports = GetVenueByIdController;
