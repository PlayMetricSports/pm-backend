const User = require("@/models/account/user.model");
const Employee = require("@/models/employee/employee.model");

const UserUpdateProfileController = async (request, response) => {
    const { firstName, middleName, lastName, countryCode, mobileNumber } = request.body;

    try {
        await User.findOneAndUpdate(
            { _id: request.user._id },
            {
                name: {
                    firstName: firstName,
                    middleName: middleName,
                    lastName: lastName
                }
            }
        );

        await Employee.findOneAndUpdate(
            { userId: request.user._id },
            {
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
            message: "Profile successfully updated."
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

module.exports = UserUpdateProfileController;