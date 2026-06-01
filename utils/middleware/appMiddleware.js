const AppMiddleware = async (request, response, next) => {

    const recievedApiKey = request.headers["api-key"]
    if (recievedApiKey && recievedApiKey === process.env.API_KEY) {
        next();
    }
    else {
        return response.status(200).json({
            code: 401,
            success: false,
            error: [
                {
                    field: "popup",
                    message: "You don't have permission to do this task."
                }
            ],
            message: ""
        })
    }
}

module.exports = AppMiddleware;