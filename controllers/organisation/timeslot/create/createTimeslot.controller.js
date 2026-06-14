const Timeslot = require("@/models/organisation/timeslot.model");

const { createSuccessResponse, createErrorResponse } = require('@/utils/helpers/errorFormat/errorFormatter');
const STATUS_CODES = require('@/utils/helpers/statusCodes.helper')
const handleCatchError = require("@/utils/middleware/errorHandler.middleware")

async function getTimeSlots(orgId, startTime, endTime) {
    const findTimeSlots = await Timeslot.find({
        orgId, timeSlotStatus: "active",

        $or: [
            { startTime },
            { endTime }
        ]

    }).select("_id").lean()
    return findTimeSlots.map(ts => ts?._id)

}
const CreateTimeslotController = async (request, response) => {
    try {
        const { slotIndex, orgId, startTime, endTime, timeSlotStatus } = request.body;
        const userId = request.user.id;

        const findExistingTimeSlots = await getTimeSlots(orgId, startTime, endTime)
        if (findExistingTimeSlots.length !== 0) {
            return response.status(STATUS_CODES.CONFLICT).json(
                createErrorResponse(STATUS_CODES.CONFLICT, "popup", "Timeslot with start or endtime already exists for Organisation."));
        }

        const newTimeslot = await Timeslot.create({
            slotIndex,
            orgId,
            startTime,
            endTime,
            timeSlotStatus: timeSlotStatus || "active",
            createdBy: userId,
            updatedBy: userId
        });

        return response.status(201).json(
            createSuccessResponse(STATUS_CODES.CREATED, newTimeslot, "Timeslot created successfully."));
    } catch (error) {
        return handleCatchError(error, response)
    }
};

module.exports = CreateTimeslotController;
