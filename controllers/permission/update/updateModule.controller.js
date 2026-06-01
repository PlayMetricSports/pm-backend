const Subsystem = require("@/models/action/subsystem.model");
const Module = require("@/models/action/module.model");

const UpdateModuleController = async (request, response) => {
    const { subSystemId, moduleName, moduleIcon, moduleKey } = request.body;
    const { moduleId } = request.params;

    try {
        const subsystem = await Subsystem.find({ _id: subSystemId }).select("systemId");

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

        const module = await Module.findOneAndUpdate(
            {
                _id: moduleId
            },
            {
                moduleName: moduleName,
                moduleKey: moduleKey,
                moduleIcon: moduleIcon,
                systemId: subsystem?.systemId,
                subsystemId: subsystem?._id
            });

        if (module) {
            const data = {
                module: {
                    _id: module?._id,
                    moduleName: module?.moduleName,
                    moduleKey: module?.moduleKey,
                    moduleIcon: module?.moduleIcon,
                    systemId: module?.systemId,
                    subsystemId: module?.subsystemId
                }
            };

            return response.status(200).json({
                code: 200,
                success: true,
                data: data,
                error: [],
                message: "Module updated successfully."
            });
        }
        else {
            return response.status(200).json({
                code: 200,
                success: false,
                error: [
                    {
                        field: "popup",
                        message: "Module not updated."
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

module.exports = UpdateModuleController