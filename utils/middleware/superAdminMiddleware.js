const SuperAdminMiddleware = async (request, response, next) => {
    try {
        if (request.user?.isSuperAdmin) {
            next();
        }
        else{
            return response.status(200).json({
                code: 401,
                success: false,
                error: [
                    {
                        field: "popup",
                        message: "You do not have permission to perform this task."
                    }
                ],
                message: ""
            });
        }
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
}

module.exports = SuperAdminMiddleware;