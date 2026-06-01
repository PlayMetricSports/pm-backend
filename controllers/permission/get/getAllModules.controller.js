const Module = require("@/models/action/module.model");
const { ValidateQueryFiltersAndInsert } = require("@/validators/main/validator/multivalidator.js")

const ModulesController = async (request, response) => {
    const { systemId, subSystemId, moduleName, moduleKey, page, getAll } = request.query
    const query = ValidateQueryFiltersAndInsert({
        moduleName, moduleKey, systemId, subSystemId
    })
    const systemPage = page || 1
    const pageSize = 10
    let pipeline = []
    if (!getAll) {
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
                from: "systems",
                let: { systemId: "$systemId" },
                pipeline: [
                    {
                        $match: {
                            $expr:
                                { $eq: ["$_id", "$$systemId"] },
                        },
                    },
                    {
                        $project: {
                            _id: 1,
                            systemName: 1,
                            systemKey: 1
                        },
                    },
                ],
                as: "systemDetails",
            },
        },
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
                            _id: 1,
                            subSystemName: 1,
                            subSystemKey: 1
                        },
                    },
                ],
                as: "subSystemDetails",
            },
        },
        {
            $unwind: {
                path: "$systemDetails",
                preserveNullAndEmptyArrays: true,
            },
        },
        {
            $unwind: {
                path: "$subSystemDetails",
                preserveNullAndEmptyArrays: true,
            },
        },
        {
            $project: {
                _id: 1,
                moduleName: 1,
                moduleKey: 1,
                // subSystemId: "$subSystemDetails._id",
                subSystemName: "$subSystemDetails.subSystemName",
                subSystemKey: "$subSystemDetails.subSystemKey",
                // systemId: "$systemDetails._id",
                systemName: "$systemDetails.systemName",
                systemKey: "$systemDetails.systemKey"
            }
        }])
    try {

        const modules = await Module.aggregate(pipeline)


        if (modules?.length == 0) {
            return response.status(200).json({
                code: 200,
                success: false,
                error: [
                    {
                        field: "popup",
                        message: "Modules not found."
                    }
                ],
                message: ""
            });
        }

        const data = {
            modules: modules
        };
        if (!getAll) {
            const totalModules = await Module.countDocuments({});
            const totalPages = Math.ceil(totalModules / pageSize);
            data.pagination = {
                page: systemPage,
                pageCount: totalPages,
                total: totalModules
            }
        }
        return response.status(200).json({
            code: 200,
            success: true,
            data: data,
            error: [],
            message: "Modules fetched successfully."
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

module.exports = ModulesController;