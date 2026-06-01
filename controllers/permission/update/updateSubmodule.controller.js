const Module = require("@/models/action/module.model");
const Submodule = require("@/models/action/submodule.model");

const UpdateSubmoduleController = async (request, response) => {
    const { submoduleName, submoduleKey, moduleId } = request.body;
    const { submoduleId } = request.params;

    try {
        const module = await Module.findOne({ _id: moduleId }).select("systemId subsystemId");

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

        const submodule = await Submodule.findOneAndUpdate(
            {
                _id: submoduleId
            },
            {
                submoduleName: submoduleName,
                submoduleKey: submoduleKey,
                systemId: module?.systemId,
                subsystemId: module?.subsystemId,
                moduleId: module?._id
            });

        if (submodule) {
            const data = {
                submodule: {
                    _id: submodule?._id,
                    submoduleName: submodule?.submoduleName,
                    submoduleKey: submodule?.submoduleKey,
                    systemId: submodule?.systemId,
                    subsystemId: submodule?.subsystemId,
                    moduleId: submodule?.moduleId
                }
            };

            return response.status(200).json({
                code: 200,
                success: true,
                data: data,
                error: [],
                message: "Submodule updated successfully."
            });
        }
        else {
            return response.status(200).json({
                code: 200,
                success: false,
                error: [
                    {
                        field: "popup",
                        message: "Submodule not updated."
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

module.exports = UpdateSubmoduleController;