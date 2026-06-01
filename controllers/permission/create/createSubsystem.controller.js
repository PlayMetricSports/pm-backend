const Subsystem = require("@/models/action/subsystem.model");
const handleCatchError = require("@/utils/middleware/errorHandler.middleware")
const CreateSubsystemController = async (request, response) => {
    const { subSystemName, subSystemKey, subSystemIcon } = request.body;

    try {

        const subsystem = await Subsystem.create({
            subSystemName: subSystemName,
            subSystemKey: subSystemKey,
            subSystemIcon: subSystemIcon,
        });

        if (subsystem) {
            const data = {
                subsystem: {
                    _id: subsystem?._id,
                    subSystemName: subsystem?.subSystemName,
                    subSystemKey: subsystem?.subSystemKey,
                    subSystemIcon: subsystem?.subSystemIcon,
                    systemId: subsystem?.systemId
                }
            };

            return response.status(200).json({
                code: 200,
                success: true,
                data: data,
                error: [],
                message: "Subsystem created successfully."
            });
        }
        else {
            return response.status(200).json({
                code: 200,
                success: false,
                error: [
                    {
                        field: "popup",
                        message: "Subsystem not created."
                    }
                ],
                message: ""
            });
        }
    }
    catch (error) {
        return handleCatchError(error, response)
    }
}

module.exports = CreateSubsystemController;