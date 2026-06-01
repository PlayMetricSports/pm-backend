const Module = require("@/models/action/module.model");
const Submodule = require("@/models/action/submodule.model");
const handleCatchError = require("@/utils/middleware/errorHandler.middleware")

const CreateSubmoduleController = async (request, response) => {
    const { subModuleName, subModuleKey, subModuleIcon, moduleId } = request.body;

    try {
        const module = await Module.findById(moduleId).select("subSystemId");

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

        const submodule = await Submodule.create({
            subModuleName: subModuleName,
            subModuleKey: subModuleKey,
            subModuleIcon: subModuleIcon,
            subSystemId: module?.subSystemId,
            moduleId: module?._id
        });

        if (submodule) {
            const data = {
                submodule: {
                    _id: submodule?._id,
                    subModuleName: submodule?.subModuleName,
                    subModuleKey: submodule?.subModuleKey,
                    subModuleIcon: submodule?.subModuleIcon,
                    subSystemId: submodule?.subSystemId,
                    moduleId: submodule?.moduleId
                }
            };

            return response.status(200).json({
                code: 200,
                success: true,
                data: data,
                error: [],
                message: "Submodule created successfully."
            });
        }
        else {
            return response.status(200).json({
                code: 200,
                success: false,
                error: [
                    {
                        field: "popup",
                        message: "Submodule not created."
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

module.exports = CreateSubmoduleController;