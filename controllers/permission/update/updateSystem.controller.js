const System = require("@/models/permission/system.model");

const UpdateSystemController = async (request, response) => {
    const { systemName, systemKey } = request.body;
    const { systemId } = request.params;

    try {
        const system = await System.findOneAndUpdate(
            {
                _id: systemId
            },
            {
                systemName: systemName,
                systemKey: systemKey
            }
        );

        if (system) {
            const data = {
                system: {
                    _id: system?._id,
                    systemName: system?.systemName,
                    systemKey: system?.systemKey
                }
            };

            return response.status(200).json({
                code: 200,
                success: true,
                data: data,
                error: [],
                message: "System updated successfully."
            });
        }
        else {
            return response.status(200).json({
                code: 200,
                success: false,
                error: [
                    {
                        field: "popup",
                        message: "System not updated."
                    }
                ],
                message: ""
            });
        }
    }
    catch (error) {
        return response.status(500).json({
            code: 500,
            success: false,
            error: [
                {
                    field: "popup",
                    message: `Error: ${error?.message}`
                }
            ],
            message: ""
        });
    }
}

module.exports = UpdateSystemController;