// Express Router Setup
const express = require("express");
const router = express.Router();

// Middleware Controllers
const ActionMiddleware = require("@/utils/middleware/actionMiddleware");

// API Controllers Controllers
// const CreateSystemValidator = require("@/validators/permission/createSystem.validator");
// const CreateSystemController = require("@/controllers/permission/create/createSystem.controller");

// const UpdateSystemValidator = require("@/validators/permission/updateSystem.validator");
// const UpdateSystemController = require("@/controllers/permission/update/updateSystem.controller");

const CreateSubsystemValidator = require("@/validators/permission/createSubsystem.validator");
const CreateSubsystemController = require("@/controllers/permission/create/createSubsystem.controller");

const UpdateSubsystemValidator = require("@/validators/permission/updateSubsystem.validator");
const UpdateSubsystemController = require("@/controllers/permission/update/updateSubsystem.controller");

const CreateModuleValidator = require("@/validators/permission/createModule.validator");
const CreateModuleController = require("@/controllers/permission/create/createModule.controller");

const UpdateModuleValidator = require("@/validators/permission/updateModule.validator");
const UpdateModuleController = require("@/controllers/permission/update/updateModule.controller");

const CreateSubmoduleValidator = require("@/validators/permission/createSubmodule.validator");
const CreateSubmoduleController = require("@/controllers/permission/create/createSubmodule.controller");

const UpdateSubmoduleValidator = require("@/validators/permission/updateSubmodule.validator");
const UpdateSubmoduleController = require("@/controllers/permission/update/updateSubmodule.controller");

const ActionsController = require("@/controllers/permission/get/getAllActions.controller");
const SubmodulesController = require("@/controllers/permission/get/getAllSubModules.controller");
const ModulesController = require("@/controllers/permission/get/getAllModules.controller");
const SubSystemsController = require("@/controllers/permission/get/getAllSubSystems.controller");
// const SystemsController = require("@/controllers/permission/get/getAllSystems.controller");

const CreateActionValidator = require("@/validators/permission/createAction.validator");
const CreateActionController = require("@/controllers/permission/create/createAction.controller");

// JSON Body / Param Sanitization
const SanitizeRequest = require("@/validators/main/sanitize/sanitizeRequest");
const Middleware = require("@/utils/middleware/middleware");

const key = "actions";

// CREATE ALL PERMISSIONS

// router.post(
//     "/system/create",
//     SanitizeRequest,
//     Middleware,
//     (request, response, next) => ActionMiddleware(request, response, next, key),
//     CreateSystemValidator,
//     CreateSystemController
// );


router.post(
    "/subsystem/create",
    SanitizeRequest,
    Middleware,
    (request, response, next) => ActionMiddleware(request, response, next, key),
    CreateSubsystemValidator,
    CreateSubsystemController
);


router.post(
    "/module/create",
    SanitizeRequest,
    Middleware,
    (request, response, next) => ActionMiddleware(request, response, next, key),
    CreateModuleValidator,
    CreateModuleController
);


router.post(
    "/submodule/create",
    SanitizeRequest,
    Middleware,
    (request, response, next) => ActionMiddleware(request, response, next, key),
    CreateSubmoduleValidator,
    CreateSubmoduleController
);

router.post(
    "/action/create",
    SanitizeRequest,
    Middleware,
    (request, response, next) => ActionMiddleware(request, response, next, key),
    CreateActionValidator,
    CreateActionController
);

// UPDATE ALL PERMISSIONS


// router.patch(
//     "/system/update/:systemId",
//     SanitizeRequest,
//     Middleware,
//     (request, response, next) => ActionMiddleware(request, response, next, key),
//     UpdateSystemValidator,
//     UpdateSystemController
// );

router.patch(
    "/subsystem/update/:subSystemId",
    SanitizeRequest,
    Middleware,
    (request, response, next) => ActionMiddleware(request, response, next, key),
    UpdateSubsystemValidator,
    UpdateSubsystemController
);

router.patch(
    "/module/update/:moduleId",
    SanitizeRequest,
    Middleware,
    (request, response, next) => ActionMiddleware(request, response, next, key),
    UpdateModuleValidator,
    UpdateModuleController
);

router.patch(
    "/submodule/update/:submoduleId",
    SanitizeRequest,
    Middleware,
    (request, response, next) => ActionMiddleware(request, response, next, key),
    UpdateSubmoduleValidator,
    UpdateSubmoduleController
);


// GET ALL PERMISSIONS

router.get(
    "/actions",
    SanitizeRequest,
    Middleware,
    (request, response, next) => ActionMiddleware(request, response, next, key),
    ActionsController
);

router.get(
    "/submodules",
    SanitizeRequest,
    Middleware,
    (request, response, next) => ActionMiddleware(request, response, next, key),
    SubmodulesController
);

router.get(
    "/modules",
    SanitizeRequest,
    Middleware,
    (request, response, next) => ActionMiddleware(request, response, next, key),
    ModulesController
);

router.get(
    "/subsystems",
    SanitizeRequest,
    Middleware,
    (request, response, next) => ActionMiddleware(request, response, next, key),
    SubSystemsController
);

// router.get(
//     "/systems",
//     SanitizeRequest,
//     Middleware,
//    (request, response, next) => ActionMiddleware(request, response, next, key),
//     SystemsController
// );

module.exports = router;