const Parent = require("@/models/erp/student/parent.model");

const ParentMiddleware = async (request, response, next) => {
    try {
        if (request?.user && request?.user?.userType != "parent") {
            return response.status(200).json({
                code: 401,
                success: false,
                error: [
                    {
                        field: "popup",
                        message: "User not valid."
                    }
                ],
                message: ""
            });
        }
        else {
            const parent = await Parent.findOne({ userId: request?.user?._id }).select("_id studentIdList");

            request.body.parentId = parent?._id;
            request.parent = parent;
            next();
        }
    }
    catch (error) {
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
}

module.exports = ParentMiddleware;