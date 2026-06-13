const Court = require("@/models/organisation/court.model");

const DeleteCourtController = async (request, response) => {
    try {
        const { courtId } = request.params;

        const court = await Court.findByIdAndUpdate(courtId, { status: "inactive" }, { new: true });

        if (!court) {
            return response.status(200).json({
                code: 400,
                success: false,
                error: [
                    {
                        field: "popup",
                        message: "Court not found"
                    }
                ],
                message: ""
            });
        }

        return response.status(200).json({
            code: 200,
            success: true,
            data: court,
            error: [],
            message: "Court deleted successfully."
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

module.exports = DeleteCourtController;
