const Org = require("@/models/organisation/org.model");

const CreateOrgController = async (request, response) => {
    try {
        const { name, domainUrl, organisationNumber, mainOffice, orgSubDomain } = request.body;
        const userId = request.user._id;

        const newOrg = await Org.create({
            name,
            domainUrl,
            organisationNumber,
            mainOffice,
            orgSubDomain,
            createdBy: userId,
            updatedBy: userId
        });

        return response.status(201).json({
            code: 201,
            success: true,
            data: newOrg,
            error: [],
            message: "Organisation created successfully."
        });
    } catch (error) {
        if (error.code === 11000) {
            const field = Object.keys(error.keyPattern)[0];
            return response.status(200).json({
                code: 400,
                success: false,
                error: [
                    {
                        field: field,
                        message: `${field} must be unique`
                    }
                ],
                message: ""
            });
        }
        return response.status(500).json({
            code: 500,
            success: false,
            error: [
                {
                    field: "popup",
                    message: `Error: ${error.message}`
                }
            ],
            message: ""
        });
    }
};

module.exports = CreateOrgController;
