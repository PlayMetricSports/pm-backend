const Submodule = require("@/models/action/submodule.model");
const Action = require("@/models/action/action.model");
const userModel = require("@/models/account/user.model");
const userRoleModel = require("@/models/account/userRole.model");
const handleCatchError = require("@/utils/middleware/errorHandler.middleware")

const CreateActionController = async (request, response) => {
    const { subModuleId, userRoleId } = request.body;

    try {
        const submodule = await Submodule.findById(subModuleId).select("subSystemId moduleId");

        if (!submodule) {
            return response.status(200).json({
                code: 404,
                success: false,
                error: [
                    {
                        field: "popup",
                        message: "Submodule not found."
                    }
                ],
                message: ""
            });
        }

        let actionKey = "ac-101";

        const prevAction = await Action
            .findOne({})
            .select("actionKey")
            .sort({ _id: -1 });

        if (prevAction) {
            const splitActionKey = prevAction?.actionKey.split("-");
            const createActionKey = `ac-${Number(splitActionKey[splitActionKey?.length - 1]) + 1}`;

            actionKey = createActionKey;
        }

        const action = await Action.create({
            actionKey: actionKey,
            subSystemId: submodule?.subSystemId,
            moduleId: submodule?.moduleId,
            subModuleId: submodule?._id,
            userRoleId: userRoleId
        });

        await userModel.updateMany(
            {
                userRoleId: { $in: userRoleId }
            },
            {
                $addToSet: { actionIds: action?._id }
            }
        )
        await userRoleModel.updateMany(
            {
                _id: { $in: userRoleId }
            },
            {
                $addToSet: { actionIds: action?._id }
            })

        if (action) {
            const data = {
                action: {
                    _id: action?._id,
                    actionKey: action?.actionKey,
                    systemId: action?.systemId,
                    subSystemId: action?.subSystemId,
                    moduleId: action?.moduleId,
                    subModuleId: action?.subModuleId,
                    userRoleId: action?.userRoleId
                }
            };

            return response.status(200).json({
                code: 200,
                success: true,
                data: data,
                error: [],
                message: "Action created successfully."
            });
        }
        else {
            return response.status(200).json({
                code: 200,
                success: false,
                error: [
                    {
                        field: "popup",
                        message: "Action not created."
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

module.exports = CreateActionController;