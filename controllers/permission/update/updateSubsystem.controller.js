const Subsystem = require("@/models/action/subsystem.model");

const UpdateSubsystemController = async (request, response) => {
    const { subSystemName, subSystemKey, subSystemIcon, systemId } = request.body;
    const { subSystemId } = request.params;

    try {
        const subsystem = await Subsystem.findOneAndUpdate(
            {
                _id: subSystemId
            },
            {
                subSystemName: subSystemName,
                subSystemKey: subSystemKey,
                subSystemIcon: subSystemIcon || "",
                systemId: systemId
            }
        );

        if (subsystem) {
            const data = {
                subsystem: {
                    _id: subsystem?._id,
                    subsystemName: subsystem?.subsystemName,
                    subsystemKey: subsystem?.subsystemKey,
                    subSystemIcon: subsystem?.subSystemIcon || "",
                    systemId: subsystem?.systemId
                }
            };

            return response.status(200).json({
                code: 200,
                success: true,
                data: data,
                error: [],
                message: "Subsystem updated successfully."
            });
        }
        else {
            return response.status(200).json({
                code: 200,
                success: false,
                error: [
                    {
                        field: "popup",
                        message: "Subsystem not updated."
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

module.exports = UpdateSubsystemController;