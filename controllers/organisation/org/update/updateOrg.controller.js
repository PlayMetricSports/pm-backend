const Org = require("@/models/organisation/org.model");

const UpdateOrgController = async (request, response) => {
    try {
        const { orgId } = request.params;
        const userId = request.user._id;
        const updateData = { ...request.body, updatedBy: userId };

        const org = await Org.findByIdAndUpdate(orgId, updateData, { new: true, runValidators: true })
            .populate("createdBy", "id firstName lastName email")
            .populate("updatedBy", "id firstName lastName email");

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
            message: "Organisation updated successfully."
        });
    } catch (error) {
        if (error.code === 11000) {
            const field = Object.keys(error.keyPattern)[0];
            return response.status(200).json({
                code: 400,
                success: false,
                error: [
                    {
                        field: field,
                        message: `${field} must be unique`
                    }
                ],
                message: ""
            });
        }
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

module.exports = UpdateOrgController;
