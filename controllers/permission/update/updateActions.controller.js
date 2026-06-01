const SubModule = require("@/models/action/submodule.model");
const Module = require("@/models/action/module.model");
const Subsystem = require("@/models/action/subsystem.model");
const System = require("@/models/permission/system.model");
const Action = require(@/models/action / action.model");

const UpdateActionController = async (request, response) => {
    const { actionKey, subModuleId, moduleId, subSystemId, systemId } = request.body;
    const { actionId } = request.params;

    try {
        const submodule = await SubModule.findOne({
            _id: subModuleId,
            moduleId,
            subSystemId,
            systemId
        }).select("moduleId subsystemId systemId");

        if (!submodule) {
            return response.status(200).json({
                code: 404,
                success: false,
                error: [
                    {
                        field: "popup",
                        message: "Sub Module not found."
                    }
                ],
                message: ""
            });
        }
        const module = await Module.findOne({
            _id: moduleId,
            subSystemId,
            systemId
        }).select("subsystemId systemId");

        if (!module) {
            return response.status(200).json({
                code: 404,
                success: false,
                error: [
                    {
                        field: "popup",
                        message: "Module not found."
                    }
                ],
                message: ""
            });
        }
        const subsystem = await SubSystem.findOne({
            _id: subSystemId,
            systemId
        }).select("systemId");

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
        const system = await System.findById(systemId).select("_id");

        if (!system) {
            return response.status(200).json({
                code: 404,
                success: false,
                error: [
                    {
                        field: "popup",
                        message: "System not found."
                    }
                ],
                message: ""
            });
        }

        const action = await Action.findOneAndUpdate(
            {
                _id: actionId
            },
            {
                actionKey, subModuleId, moduleId, subSystemId, systemId
            });

        if (action) {
            const data = {
                module: {
                    _id: action?._id,
                    actionKey: action?.actionKey,
                    subModuleId: action?.subModuleId,
                    moduleId: action?.moduleId,
                    systemId: action?.systemId,
                    subsystemId: action?.subsystemId
                }
            };

            return response.status(200).json({
                code: 200,
                success: true,
                data: data,
                error: [],
                message: "Action updated successfully."
            });
        }
        else {
            return response.status(200).json({
                code: 200,
                success: false,
                error: [
                    {
                        field: "popup",
                        message: "Action not updated."
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

module.exports = UpdateActionController