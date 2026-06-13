const Court = require("@/models/organisation/court.model");

const CreateCourtController = async (request, response) => {
    try {
        const { orgId, venueId, sportId, courtNumber, courtName, isMultipurpose } = request.body;
        const userId = request.user.id;

        const newCourt = await Court.create({
            orgId,
            venueId,
            sportId,
            courtNumber,
            courtName,
            isMultipurpose,
            createdBy: userId,
            updatedBy: userId
        });

        return response.status(201).json({
            code: 201,
            success: true,
            data: newCourt,
            error: [],
            message: "Court created successfully."
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

module.exports = CreateCourtController;
