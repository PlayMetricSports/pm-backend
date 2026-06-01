// const System = require("@/models/permission/system.model");
const handleCatchError = require("@/utils/middleware/errorHandler.middleware")

const CreateSystemController = async (request, response) => {
    const { systemName, systemKey } = request.body;

    try {
        const system = await System.create({
            systemName: systemName,
            systemKey: systemKey
        });

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
                message: "System created successfully."
            });
        }
        else {
            return response.status(200).json({
                code: 200,
                success: false,
                error: [
                    {
                        field: "popup",
                        message: "System not created."
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

module.exports = CreateSystemController;