const express = require("express");
const router = express.Router();

const SanitizeRequest = require("@/validators/main/sanitize/sanitizeRequest");

const CreateCourtValidator = require("@/validators/organisation/createCourt.validator");
const CreateCourtController = require("@/controllers/organisation/court/create/createCourt.controller");

const GetAllCourtsController = require("@/controllers/organisation/court/read/getAllCourts.controller");
const GetCourtByIdController = require("@/controllers/organisation/court/read/getCourtById.controller");

const UpdateCourtValidator = require("@/validators/organisation/updateCourt.validator");
const UpdateCourtController = require("@/controllers/organisation/court/update/updateCourt.controller");

const DeleteCourtController = require("@/controllers/organisation/court/delete/deleteCourt.controller");

// CREATE
router.post(
    "/create",
    SanitizeRequest,
    CreateCourtValidator,
    CreateCourtController
);

// READ
router.get(
    "/",
    SanitizeRequest,
    GetAllCourtsController
);

router.get(
    "/:courtId",
    SanitizeRequest,
    GetCourtByIdController
);

// UPDATE
router.patch(
    "/:courtId",
    SanitizeRequest,
    UpdateCourtValidator,
    UpdateCourtController
);

// DELETE
router.delete(
    "/:courtId",
    SanitizeRequest,
    DeleteCourtController
);

module.exports = router;
