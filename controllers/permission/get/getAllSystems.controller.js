const System = require("@/models/actions/system.model");
const { ValidateQueryFiltersAndInsert } = require("@/validators/main/validator/multivalidator.js")
const SystemsController = async (request, response) => {
    const { systemName, systemKey, page, getAll } = request.query
    const query = ValidateQueryFiltersAndInsert({ systemName, systemKey })

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
            $project: {
                _id: 1,
                systemName: 1,
                systemKey: 1
            }
        }])
    try {

        const systems = await System.aggregate(pipeline)


        if (systems?.length == 0) {
            return response.status(200).json({
                code: 200,
                success: false,
                error: [
                    {
                        field: "popup",
                        message: "Systems not found."
                    }
                ],
                message: ""
            });
        }

        const data = {
            systems: systems,
        };
        if (!getAll) {
            const totalSystems = await System.countDocuments({});
            const totalPages = Math.ceil(totalSystems / pageSize);
            data.pagination = {
                page: systemPage,
                pageCount: totalPages,
                total: totalSystems
            }
        }
        return response.status(200).json({
            code: 200,
            success: true,
            data: data,
            error: [],
            message: "Systems fetched successfully."
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

module.exports = SystemsController;