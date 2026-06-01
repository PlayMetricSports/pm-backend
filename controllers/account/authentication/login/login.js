const LoginFacade = require("@/facades/login.facades");
const LogController = require("@/controllers/system/logs/log.controller");
const {
    createErrorResponse
} = require('@/utils/helpers/errorFormat/errorFormatter');

const LoginController = async (req, res) => {
    try {

        const result = await LoginFacade.login(req);

        await LogController(
            req,
            "api::login",
            "success",
            "User login successful.",
            req.clientInfo
        );

        return res.status(200).json(result);

    } catch (error) {

        await LogController(
            req,
            "api::login",
            "failed",
            error.message || error
        );

        return res.status(500).json(
            createErrorResponse(
                500,
                "popup",
                `Error: ${error.message || error}`
            )
        );
    }
};

module.exports = LoginController;