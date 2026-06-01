const Setup = require("@/models/system/setup.model");
const { encryptKeys } = require("@/security/rsa.keys.security");

const CreateSetupController = async (request, response) => {
    const { currentStartYear } = request.body;
    try {
        const setup = await Setup.create({
            currentStartYear: currentStartYear
        })

        if (setup?._id) {
            const data = encryptKeys({
                setupId: setup?._id
            });
            return response.status(200).json({
                code: 201,
                success: true,
                data: data,
                error: [],
                message: "setup successfully created."
            });
        } else {
            return response.status(200).json({
                code: 200,
                success: false,
                error: [
                    {
                        field: "popup",
                        message: "setup not created."
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

module.exports = CreateSetupController;