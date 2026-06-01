const Action = require("@/models/action/action.model");
const { ValidateQueryFiltersAndInsert } = require("@/validators/main/validator/multivalidator.js")

const ActionsController = async (request, response) => {
    const { systemId, subSystemId, moduleId, subModuleId, actionKey, page, getAll } = request.query
    const query = ValidateQueryFiltersAndInsert({
        systemId, subSystemId, moduleId, subModuleId, actionKey
    })
    const systemPage = page || 1
    const pageSize = 10
    let pipeline = []
    if (!(getAll === "true")) {
        pipeline.push(
            { $match: query },
            { $skip: (systemPage - 1) * pageSize },
            { $limit: pageSize }
        );
    }
    pipeline = pipeline.concat([
        {
            $sort: {
                _id: -1
            }
        },
        {
            $lookup: {
                from: "userroles",
                let: { userRoleIds: "$userRoleId" },
                pipeline: [
                    {
                        $match: {
                            $expr:
                                { $in: ["$_id", "$$userRoleIds"] },
                        },
                    },
                    {
                        $project: {
                            _id: 0,
                            userRoleName: 1,
                            userRoleKey: 1
                        },
                    },
                ],
                as: "userRoleDetails",
            },
        },
        // {
        //     $lookup: {
        //         from: "systems",
        //         let: { systemId: "$systemId" },
        //         pipeline: [
        //             {
        //                 $match: {
        //                     $expr:
        //                         { $eq: ["$_id", "$$systemId"] },
        //                 },
        //             },
        //             {
        //                 $project: {
        //                     _id: 0,
        //                     systemName: 1,
        //                     systemKey: 1
        //                 },
        //             },
        //         ],
        //         as: "systemDetails",
        //     },
        // },
        {
            $lookup: {
                from: "subsystems",
                let: { subSystemId: "$subSystemId" },
                pipeline: [
                    {
                        $match: {
                            $expr:
                                { $eq: ["$_id", "$$subSystemId"] },
                        },
                    },
                    {
                        $project: {
                            _id: 0,
                            subSystemName: 1,
                            subSystemKey: 1
                        },
                    },
                ],
                as: "subSystemDetails",
            },
        },
        {
            $lookup: {
                from: "modules",
                let: { moduleId: "$moduleId" },
                pipeline: [
                    {
                        $match: {
                            $expr:
                                { $eq: ["$_id", "$$moduleId"] },
                        },
                    },
                    {
                        $project: {
                            _id: 0,
                            moduleName: 1,
                            moduleKey: 1
                        },
                    },
                ],
                as: "moduleDetails",
            },
        },
        {
            $lookup: {
                from: "submodules",
                let: { subModuleId: "$subModuleId" },
                pipeline: [
                    {
                        $match: {
                            $expr:
                                { $eq: ["$_id", "$$subModuleId"] },
                        },
                    },
                    {
                        $project: {
                            _id: 0,
                            subModuleName: 1,
                            subModuleKey: 1
                        },
                    },
                ],
                as: "subModuleDetails",
            },
        },
        {
            $unwind: "$userRoleDetails"
        },
        {
            $unwind: "$subModuleDetails"
        },
        {
            $unwind: "$moduleDetails"
        },
        {
            $unwind: "$subSystemDetails"
        },
        // {
        //     $unwind: "$systemDetails"
        // },
        {
            $project: {
                _id: 1,
                actionKey: 1,
                userRoleName: "$userRoleDetails.userRoleName",
                userRoleKey: "$userRoleDetails.userRoleKey",
                subModuleName: "$subModuleDetails.subModuleName",
                subModuleKey: "$subModuleDetails.subModuleKey",
                moduleName: "$moduleDetails.moduleName",
                moduleKey: "$moduleDetails.moduleKey",
                subSystemName: "$subSystemDetails.subSystemName",
                subSystemKey: "$subSystemDetails.subSystemKey",
                // systemName: "$systemDetails.systemName",
                // systemKey: "$systemDetails.systemKey",
            }
        }
    ])

    try {

        const actions = await Action.aggregate(pipeline)


        if (actions?.length == 0) {
            return response.status(200).json({
                code: 200,
                success: false,
                error: [
                    {
                        field: "popup",
                        message: "Actions not found."
                    }
                ],
                message: ""
            });
        }

        const data = {
            actions: actions
        };
        if (!(getAll === "true")) {
            const totalActions = await Action.countDocuments({});
            const totalPages = Math.ceil(totalActions / pageSize);
            data.pagination = {
                page: systemPage,
                pageCount: totalPages,
                total: totalActions
            }
        }
        return response.status(200).json({
            code: 200,
            success: true,
            data: data,
            error: [],
            message: "Actions fetched successfully."
        });
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

module.exports = ActionsController;