const express = require("express");
const router = express.Router();

const SanitizeRequest = require("@/validators/main/sanitize/sanitizeRequest");

const CreateOrgValidator = require("@/validators/organisation/createOrg.validator");
const CreateOrgController = require("@/controllers/organisation/org/create/createOrg.controller");

const GetAllOrgsController = require("@/controllers/organisation/org/read/getAllOrgs.controller");
const GetOrgByIdController = require("@/controllers/organisation/org/read/getOrgById.controller");

const UpdateOrgValidator = require("@/validators/organisation/updateOrg.validator");
const UpdateOrgController = require("@/controllers/organisation/org/update/updateOrg.controller");

const DeleteOrgController = require("@/controllers/organisation/org/delete/deleteOrg.controller");

// CREATE
router.post(
    "/create",
    SanitizeRequest,
    CreateOrgValidator,
    CreateOrgController
);

// READ
router.get(
    "/",
    SanitizeRequest,
    GetAllOrgsController
);

router.get(
    "/:orgId",
    SanitizeRequest,
    GetOrgByIdController
);

// UPDATE
router.patch(
    "/:orgId",
    SanitizeRequest,
    UpdateOrgValidator,
    UpdateOrgController
);

// DELETE
router.delete(
    "/:orgId",
    SanitizeRequest,
    DeleteOrgController
);

module.exports = router;
