// Express Router Setup
const express = require("express");
const router = express.Router();

// Middleware Controllers
const Middleware = require("@/utils/middleware/middleware");


// API Controllers Controllers
const GetUserTypeRoles = require("@/controllers/employee/employee/getUserTypeRoles.controller");
const EmployeesController = require("@/controllers/employee/employee/employees.controller");
const EmployeesValidator = require("@/validators/employee/employee/employees.validator");

const CreateEmployeeController = require("@/controllers/employee/employee/createEmployee.controller");
const CreateEmployeeValidator = require("@/validators/employee/employee/createEmployee.validator");

const EditEmployeeController = require("@/controllers/employee/employee/editEmployee.controller");
const EditEmployeeValidator = require("@/validators/employee/employee/editEmployee.validator");

// const BulkUploadEmployeeController = require("@/controllers/employee/employee/excelTeacherBulkUpload.controller");


// JSON Body / Param Sanitization
const SanitizeRequestBody = require("@/validators/main/sanitize/sanitizeRequestBody");
const SanitizeRequestParam = require("@/validators/main/sanitize/sanitizeRequestParam");

// Request Body Decryption
const DecryptRequest = require("@/security/decryptRequest.security");
const ActionMiddleware = require("@/utils/middleware/actionMiddleware");
const UploadStorage = require("@/utils/connections/storage/upload.storage");

const key = ["users"]

router.get(
    "/",
    // (request, response, next) => ActionMiddleware(request, response, next, key),
    EmployeesValidator,
    EmployeesController
);

router.get(
    "/get-user-type-roles-and-dept",
    // (request, response, next) => ActionMiddleware(request, response, next, key),
    GetUserTypeRoles
);

router.post(
    "/",
    // (request, response, next) => ActionMiddleware(request, response, next, key),
    // (request, response, next) => UploadStorage(request, response, next, ["image", "application"], false),
    CreateEmployeeValidator,
    CreateEmployeeController
);

router.patch(
    "/edit/:id",
    // (request, response, next) => ActionMiddleware(request, response, next, key),
    EditEmployeeValidator,
    EditEmployeeController
);

// router.post(
//     "/create/bulk-upload-excel",
//     // (request, response, next) => ActionMiddleware(request, response, next, key),
//     (request, response, next) => UploadStorage(request, response, next, ["application"], true, ["xlsx", "csv"]),
//     BulkUploadEmployeeController
// );

module.exports = router;