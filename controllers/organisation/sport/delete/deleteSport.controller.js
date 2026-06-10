const Sport = require("@/models/organisation/sport.model");

const DeleteSportController = async (request, response) => {
    try {
        const { sportId } = request.params;

        const sport = await Sport.findByIdAndUpdate(sportId, { status: "inactive" }, { new: true });

        if (!sport) {
            return response.status(200).json({
                code: 400,
                success: false,
                error: [
                    {
                        field: "popup",
                        message: "Sport not found"
                    }
                ],
                message: ""
            });
        }

        return response.status(200).json({
            code: 200,
            success: true,
            data: sport,
            error: [],
            message: "Sport deleted successfully."
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

module.exports = DeleteSportController;
