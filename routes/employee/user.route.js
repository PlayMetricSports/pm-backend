// Express Router Setup
const express = require("express");
const router = express.Router();

// Middleware Controllers
const Middleware = require("@/utils/middleware/middleware");

// API Controllers Controllers
const UserBlockToggleController = require("@/controllers/employee/user/userBlockToggle.controller");
const UserBlockToggleValidator = require("@/validators/employee/user/userBlockToggle.validator");

const UserStatusToggleController = require("@/controllers/employee/user/userStatusToggle.controller");
const UserStatusToggleValidator = require("@/validators/employee/user/userStatusToggle.validator");

const UserResetPasswordController = require("@/controllers/employee/user/userResetPassword.controller");

const AllActionIdsController = require("@/controllers/account/user/allActionIds.controller");
const SingleUserActionIdsController = require("@/controllers/account/user/SingleUserActionIds.controller");
const EditSingleUserActionKeysController = require("@/controllers/account/user/EditSingleUserActionKeys.controller");

// JSON Body / Param Sanitization
const SanitizeRequestBody = require("@/validators/main/sanitize/sanitizeRequestBody");
const SanitizeRequestParam = require("@/validators/main/sanitize/sanitizeRequestParam");

// Request Body Decryption
const DecryptRequest = require("@/security/decryptRequest.security");
const ActionMiddleware = require("@/utils/middleware/actionMiddleware");

const key = ["users"]

router.patch(
    "/toggle/block/:id",
    (request, response, next) => ActionMiddleware(request, response, next, ["users", "fr-users"]),
    UserBlockToggleValidator,
    UserBlockToggleController
);

router.patch(
    "/toggle/status/:id",
    (request, response, next) => ActionMiddleware(request, response, next, ["users", "fr-users"]),
    UserStatusToggleValidator,
    UserStatusToggleController
);

router.post(
    "/reset-password/:id",
    (request, response, next) => ActionMiddleware(request, response, next, ["users", "fr-users"]),
    UserResetPasswordController
);

router.get(
    "/all-action-menus",
    (request, response, next) => ActionMiddleware(request, response, next, key),
    AllActionIdsController
);

router.get(
    "/singleUser-action-key/:id",
    (request, response, next) => ActionMiddleware(request, response, next, key),
    SingleUserActionIdsController
);

router.patch(
    "/edit-single-user-actions/:id",
    (request, response, next) => ActionMiddleware(request, response, next, key),
    EditSingleUserActionKeysController
);

module.exports = router;