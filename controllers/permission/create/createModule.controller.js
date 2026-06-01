const Subsystem = require("@/models/action/subsystem.model");
const Module = require("@/models/action/module.model");
const handleCatchError = require("@/utils/middleware/errorHandler.middleware")

const CreateModuleController = async (request, response) => {
    const { subSystemId, moduleName, moduleIcon, moduleKey } = request.body;

    try {
        const subsystem = await Subsystem.findById(subSystemId).select("_id");

        if (!subsystem) {
            return response.status(200).json({
                code: 404,
                success: false,
                error: [
                    {
                        field: "popup",
                        message: "Subsystem not found."
                    }
                ],
                message: ""
            });
        }

        const module = await Module.create({
            moduleName: moduleName,
            moduleKey: moduleKey,
            moduleIcon: moduleIcon,
            subSystemId: subsystem?._id
        });

        if (module) {
            const data = {
                module: {
                    _id: module?._id,
                    moduleName: module?.moduleName,
                    moduleKey: module?.moduleKey,
                    moduleIcon: module?.moduleIcon,
                    subsystemId: module?.subsystemId
                }
            };

            return response.status(200).json({
                code: 200,
                success: true,
                data: data,
                error: [],
                message: "Module created successfully."
            });
        }
        else {
            return response.status(200).json({
                code: 200,
                success: false,
                error: [
                    {
                        field: "popup",
                        message: "Module not created."
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

module.exports = CreateModuleController;