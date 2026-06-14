const Court = require("@/models/organisation/court.model");
const Sport = require("@/models/organisation/sport.model");
function checkIfMultipleSportsIds(sportId) {
    return Array.isArray(sportId) && sportId.length > 1
}
const { createSuccessResponse, createErrorResponse } = require('@/utils/helpers/errorFormat/errorFormatter');
const STATUS_CODES = require('@/utils/helpers/statusCodes.helper')
const handleCatchError = require("@/utils/middleware/errorHandler.middleware")

const CreateCourtController = async (request, response) => {
    try {
        const { orgId, venueId, sportId, courtNumber, courtName, isMultipurpose = false } = request.body;
        const userId = request.user.id;
        const existingCourt = await Court.findOne({ orgId, venueId, sportId: { $in: [sportId] }, courtNumber, courtName, status: "active" })
        if (existingCourt) {
            return response.status(STATUS_CODES.BAD_REQUEST).json(
                createErrorResponse(STATUS_CODES.BAD_REQUEST, "popup", "Court with Name and Number already Exists for that sport.")
            );
        }
        const existingSport = await Sport.findOne({ orgId, venueId, _id: sportId, status: "active" })
        if (!existingSport?._id) {
            return response.status(STATUS_CODES.BAD_REQUEST).json(
                createErrorResponse(STATUS_CODES.BAD_REQUEST, "popup", "Selected Combination (org,venue,sport) does not exist.")
            );
        }
        if (isMultipurpose) {
            if (!checkIfMultipleSportsIds(sportId))
                return response.status(STATUS_CODES.BAD_REQUEST).json(
                    createErrorResponse(STATUS_CODES.BAD_REQUEST, "popup", "Select more than one Sport if Court is Multi Purpose.")
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

        return response.status(STATUS_CODES.CREATED).json(
            createSuccessResponse(STATUS_CODES.CREATED, newCourt, "Court created successfully."));
    } catch (error) {
        return handleCatchError(error, response)
    }
};

module.exports = CreateCourtController;
