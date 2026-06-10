const User = require("@/models/account/user.model");
const Employee = require("@/models/employee/employee.model");

const EditEmployeeController = async (request, response) => {
    const { firstName, middleName, lastName, countryCode, mobileNumber, employeeCode, organization, designation, orgId } = request.body;
    const { id } = request.params;

    try {
        await User.findOneAndUpdate(
            { _id: id },
            {
                name: {
                    firstName: firstName,
                    middleName: middleName,
                    lastName: lastName
                }
            }
        );

        await Employee.findOneAndUpdate(
            { userId: id },
            {
                orgId,
                employeeCode: employeeCode,
                organization: organization,
                designation: designation,
                mobileNumber: {
                    number: mobileNumber,
                    countryCode: countryCode
                }
            }
        )

        return response.status(200).json({
            code: 200,
            success: true,
            error: [],
            message: "Employee Details successfully updated."
        });
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

module.exports = EditEmployeeController;