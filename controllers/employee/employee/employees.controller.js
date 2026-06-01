const Employee = require("@/models/employee/employee.model");
const { encryptKeys } = require("@/security/rsa.keys.security");
const UserModel = require("@/models/account/user.model");

const EmployeesController = async (request, response) => {
    const { page, firstName, lastName, email, number } = request.query;

    try {
        let systemPage = page || 1;
        let limit = 10;
        let filter = {};
        let employees, employeeCount;

        // Check if any filter is applied
        const isFilterApplied = firstName || lastName || email || number;

        if (isFilterApplied) {
            // Apply filters
            filter = {};
            if (firstName || lastName || email) {
                const userQuery = {};
                if (firstName) userQuery['name.firstName'] = new RegExp(firstName, 'i');
                if (lastName) userQuery['name.lastName'] = new RegExp(lastName, 'i');
                if (email) userQuery['loginEmail.address'] = new RegExp(email, 'i');

                const users = await UserModel.find(userQuery).select('_id');
                const userIds = users.map(user => user._id);
                filter.userId = { $in: userIds };
            }
            if (number) filter["mobileNumber.number"] = { $regex: new RegExp(number, "i") };

            // Fetch employees without pagination
            employees = await Employee
                .find(filter)
                .sort({ createdAt: -1 })
                .select("employeeCode mobileNumber.countryCode mobileNumber.number userId userRoleName organization designation")
                .populate({
                    path: "userId",
                    select: `
        name
        userType
        email.address
        loginEmail.address
        userStatus
        userBlockStatus
        timezone
    `,
                    match: {
                        userType: { $in: ["employee", "admin"] }
                    }
                });

            employeeCount = employees.length;
        } else {
            // Fetch employees with pagination
            employeeCount = await Employee.countDocuments({});
            employees = await Employee
                .find({})
                .sort({ createdAt: -1 })
                .select("employeeCode mobileNumber.countryCode mobileNumber.number userId userRoleName organization designation")
                .skip((systemPage - 1) * limit)
                .limit(limit)
                .populate({
                    path: "userId",
                    select: `
        name
        userType
        email.address
        loginEmail.address
        userStatus
        userBlockStatus
        timezone
    `,
                    match: {
                        userType: { $in: ["employee", "admin"] }
                    }
                });
        }

        const SystemTotal = employeeCount;
        const SystemPageCount = Math.ceil(employeeCount / limit);

        const data = {
            employees: employees
        };

        // Add pagination data only if no filters are applied
        if (!isFilterApplied) {
            data.pagination = {
                page: systemPage,
                pageCount: SystemPageCount,
                total: SystemTotal
            };
        }

        const encryptedData = encryptKeys(data);

        return response.status(200).json({
            code: 200,
            success: true,
            data: encryptedData,
            error: [],
            message: "Employees fetched successfully."
        });
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
};

module.exports = EmployeesController;
