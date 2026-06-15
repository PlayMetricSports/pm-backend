const Sport = require("@/models/organisation/sport.model");

const CreateSportController = async (request, response) => {
    try {
        const { name, orgId, venueId } = request.body;
        const userId = request.user._id;

        const newSport = await Sport.create({
            name,
            orgId,
            venueId,
            createdBy: userId,
            updatedBy: userId
        });

        return response.status(201).json({
            code: 201,
            success: true,
            data: newSport,
            error: [],
            message: "Sport created successfully."
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

module.exports = CreateSportController;
