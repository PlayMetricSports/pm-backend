
const Action = require("@/models/action/action.model");
const CompileAPIActions = require("@/utils/helpers/account/CompileAPIActions");
const { encryptKeys } = require("@/security/rsa.keys.security");

const AllActionIdsController = async (request, response) => {
    try {
        const actions = await Action
            .find({})
            .sort({ createdAt: -1 })
            .populate({
                path: 'subModuleId',
                select: ('subModuleName subModuleKey')
            })
            .populate({
                path: 'moduleId',
                select: ('moduleName moduleKey moduleIcon')
            })
            .populate({
                path: 'subSystemId',
                select: ('subSystemName subSystemKey subSystemIcon')
            })
            .exec();

        const { actionMenu } = await CompileAPIActions(actions);

        const data = encryptKeys({
            actionMenu: actionMenu
        });

        return response.status(200).json({
            code: 200,
            success: true,
            data: data,
            error: [],
            message: "Action menus fetched successfully."
        });
    } catch (error) {
        return response.status(500).json({
            code: 500,
            success: false,
            error: [
                {
                    field: "popup",
                    message: `Error: ${error}`
                }
            ],
            message: ""
        });
    }
};

module.exports = AllActionIdsController;

