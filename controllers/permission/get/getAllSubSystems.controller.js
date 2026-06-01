const SubSystem = require("@/models/action/subsystem.model");
const { ValidateQueryFiltersAndInsert } = require("@/validators/main/validator/multivalidator.js")

const SubSystemsController = async (request, response) => {
    const { systemId, subSystemName, subSystemKey, page, getAll } = request.query
    const query = ValidateQueryFiltersAndInsert({
        subSystemName, subSystemKey, systemId
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
            $unwind: {
                path: "$systemDetails",
                preserveNullAndEmptyArrays: true,
            },
        },
        {
            $project: {
                _id: 1,
                subSystemName: 1,
                subSystemKey: 1,
                // systemId: "$systemDetails._id",
                systemName: "$systemDetails.systemName",
                systemKey: "$systemDetails.systemKey"
            }
        }])
    try {

        const subSystems = await SubSystem.aggregate(pipeline)


        if (subSystems?.length == 0) {
            return response.status(200).json({
                code: 200,
                success: false,
                error: [
                    {
                        field: "popup",
                        message: "subSystems not found."
                    }
                ],
                message: ""
            });
        }

        const data = {
            subSystems: subSystems

        };
        if (!getAll) {
            const totalSubSystems = await SubSystem.countDocuments({});
            const totalPages = Math.ceil(totalSubSystems / pageSize);
            data.pagination = {
                page: systemPage,
                pageCount: totalPages,
                total: totalSubSystems
            }
        }
        return response.status(200).json({
            code: 200,
            success: true,
            data: data,
            error: [],
            message: "subSystems fetched successfully."
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

module.exports = SubSystemsController;