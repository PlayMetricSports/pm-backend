const Timeslot = require("@/models/organisation/timeslot.model");

const GetTimeslotByIdController = async (request, response) => {
    try {
        const { timeslotId } = request.params;

        const timeslot = await Timeslot.findById(timeslotId)
            .populate("orgId", "name")
            .populate("createdBy", "id firstName lastName email")
            .populate("updatedBy", "id firstName lastName email");

        if (!timeslot) {
            return response.status(200).json({
                code: 400,
                success: false,
                error: [
                    {
                        field: "popup",
                        message: "Timeslot not found"
                    }
                ],
                message: ""
            });
        }

        return response.status(200).json({
            code: 200,
            success: true,
            data: timeslot,
            error: [],
            message: "Timeslot fetched successfully."
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

module.exports = GetTimeslotByIdController;
