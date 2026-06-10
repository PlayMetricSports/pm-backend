const Venue = require("@/models/organisation/venue.model");

const CreateVenueController = async (request, response) => {
    try {
        const { name, orgId, address } = request.body;
        const userId = request.user.id;

        const newVenue = await Venue.create({
            name,
            orgId,
            address,
            createdBy: userId,
            updatedBy: userId
        });

        return response.status(201).json({
            code: 201,
            success: true,
            data: newVenue,
            error: [],
            message: "Venue created successfully."
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

module.exports = CreateVenueController;
