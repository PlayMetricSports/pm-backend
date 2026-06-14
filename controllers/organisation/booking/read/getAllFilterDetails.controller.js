const Court = require("@/models/organisation/court.model");
const Timeslot = require("@/models/organisation/timeslot.model");
const { createSuccessResponse, createErrorResponse } = require('@/utils/helpers/errorFormat/errorFormatter');
const STATUS_CODES = require('@/utils/helpers/statusCodes.helper')
const handleCatchError = require("@/utils/middleware/errorHandler.middleware")

const GetAllFilterDetailsController = async (request, response) => {
    try {
        let timeSlotQuery = {
            timeSlotStatus: "active"
        }
        let courtQuery = {
            status: "active"
        }
        const userType = request.user.userType
        const userOrg = request.user.orgId
        if (userType !== "admin") {
            timeSlotQuery.orgId = userOrg?._id
            courtQuery.orgId = userOrg?._id
        }

        const getAllTimeSlots = await Timeslot.find(timeSlotQuery).populate("orgId", "name").lean()
        const getAllCourts = await Court.find(courtQuery)
            .populate("orgId", "name")
            .populate("venueId", "name")
            .populate("sportId", "name")
            .lean()
        return response.status(STATUS_CODES.OK).json(
            createSuccessResponse(STATUS_CODES.OK, [{ timeSlot: getAllTimeSlots, courts: getAllCourts }], "Filter Details fetched Successfully.")
        )
    }

    catch (error) {
        return handleCatchError(error, response)
    }


}

module.exports = GetAllFilterDetailsController
