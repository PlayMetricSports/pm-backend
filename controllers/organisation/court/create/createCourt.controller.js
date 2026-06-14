const Court = require("@/models/organisation/court.model");
const { createSuccessResponse, createErrorResponse } = require('@/utils/helpers/errorFormat/errorFormatter');
const STATUS_CODES = require('@/utils/helpers/statusCodes.helper')
const CreateCourtController = async (request, response) => {
    try {
        const { orgId, venueId, sportId, courtNumber, courtName, isMultipurpose } = request.body;
        const userId = request.user.id;
        const existingCourt = await Court.findOne({ orgId, venueId, sportId: { $in: [sportId] }, courtNumber, courtName, status: "active" })
        if (existingCourt) {
            return response.status(STATUS_CODES.BAD_REQUEST).json(
                createErrorResponse(STATUS_CODES.BAD_REQUEST, "popup", "Court with Name and Number already Exists for that sport.")
            );
        }
        const newCourt = await Court.create({
            orgId,
            venueId,
            sportId: sportId,
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
