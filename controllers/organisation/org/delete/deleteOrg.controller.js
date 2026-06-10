const Org = require("@/models/organisation/org.model");

const DeleteOrgController = async (request, response) => {
    try {
        const { orgId } = request.params;

        const org = await Org.findByIdAndUpdate(orgId, { status: "inactive" }, { new: true });

        if (!org) {
            return response.status(200).json({
                code: 400,
                success: false,
                error: [
                    {
                        field: "popup",
                        message: "Organisation not found"
                    }
                ],
                message: ""
            });
        }

        return response.status(200).json({
            code: 200,
            success: true,
            data: org,
            error: [],
            message: "Organisation deleted successfully."
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

module.exports = DeleteOrgController;
