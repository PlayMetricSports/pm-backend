const Timeslot = require("@/models/organisation/timeslot.model");

const CreateTimeslotController = async (request, response) => {
    try {
        const { slotIndex, orgId, startTime, endTime, timeSlotStatus } = request.body;
        const userId = request.user.id;

        const newTimeslot = await Timeslot.create({
            slotIndex,
            orgId,
            startTime,
            endTime,
            timeSlotStatus: timeSlotStatus || "active",
            createdBy: userId,
            updatedBy: userId
        });

        return response.status(201).json({
            code: 201,
            success: true,
            data: newTimeslot,
            error: [],
            message: "Timeslot created successfully."
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

module.exports = CreateTimeslotController;
