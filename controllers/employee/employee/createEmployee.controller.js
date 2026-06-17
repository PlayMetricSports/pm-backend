const Employee = require("@/models/employee/employee.model");
const User = require("@/models/account/user.model");
const UserRole = require("@/models/account/userRole.model");
const { encryptPassword } = require("@/security/rsa.keys.security");
const UserDepartment = require("@/models/account/user-department.model");
const RollbackManager = require('@/services/rollBack.service')
const rollback = new RollbackManager();
const { createSuccessResponse, createErrorResponse } = require('@/utils/helpers/errorFormat/errorFormatter');
const STATUS_CODES = require('@/utils/helpers/statusCodes.helper')
const handleCatchError = require("@/utils/middleware/errorHandler.middleware")

const CreateEmployeeController = async (request, response) => {
    const { firstName, middleName, lastName, email, countryCode, mobileNumber, department, userRole, organization, employeeCode, designation, orgId } = request.body
    const password = encryptPassword(process.env.USER_PASSWORD);
    let user, employee;

    try {

        const getUserRole = await UserRole.findOne({ userRoleKey: userRole, userRoleStatus: "active" }).select("userRoleName userType actionIds _id");

        if (!getUserRole) {
            return response.status(200).json(
                createErrorResponse(409, "popup", "Role Conflict: User creation failed"));
        }

        const getUserDepartment = await UserDepartment.findOne({ departmentKey: department, departmentStatus: "active" }).select("_id");

        if (!getUserDepartment) {
            return response.status(STATUS_CODES.CONFLICT).json(
                createErrorResponse(STATUS_CODES.CONFLICT, "popup", "Please input valid user-department."));
        }

        let createUserBody = {
            name: {
                firstName: firstName,
                middleName: middleName,
                lastName: lastName
            },
            email: { address: email },
            loginEmail: { address: email },
            password: password,
            userType: getUserRole?.userType,
            userRoleId: getUserRole?._id || "",
            userDepartmentId: getUserDepartment?._id,
            actionIds: getUserRole?.actionIds || []
        }
        if (userRole == "admin") {
            createUserBody.orgId = orgId
        }
        user = await User.create(createUserBody);

        if (user?._id) {
            rollback.add(async () => {
                await User.deleteOne({ _id: user._id });
            });

            let createEmployeeBody = {
                employeeCode: employeeCode,
                designation: designation,
                mobileNumber: { countryCode: countryCode, number: mobileNumber },
                userId: user?._id,
                userRoleId: getUserRole?._id,
                userRoleName: getUserRole?.userRoleName,
            }


            employee = await Employee.create(createEmployeeBody);

            if (employee?._id) {
                rollback.add(async () => {
                    await Employee.deleteOne({ _id: employee._id });
                });



                const data = {
                    userId: user?._id,
                    employeeId: employee?._id,
                    employeeCode: employee?.employeeCode
                };
                rollback.clear();
                return response.status(STATUS_CODES.CREATED).json(
                    createSuccessResponse(STATUS_CODES.CREATED, data, "Employee successfully created."));
            } else {
                await rollback.rollback();
                return response.status(STATUS_CODES.CONFLICT).json(
                    createErrorResponse(STATUS_CODES.CONFLICT, "popup", "Employee creation failed."));
            }
        }

        await rollback.rollback();
        return response.status(200).json(
            createErrorResponse(400, "popup", "Employee not created by the server."));
    } catch (error) {
        await rollback.rollback();
        return handleCatchError(error, response)

    }
};

module.exports = CreateEmployeeController;