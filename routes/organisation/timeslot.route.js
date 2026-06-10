const express = require("express");
const router = express.Router();

const SanitizeRequest = require("@/validators/main/sanitize/sanitizeRequest");

const CreateTimeslotValidator = require("@/validators/organisation/createTimeslot.validator");
const CreateTimeslotController = require("@/controllers/organisation/timeslot/create/createTimeslot.controller");

const GetAllTimeslotsController = require("@/controllers/organisation/timeslot/read/getAllTimeslots.controller");
const GetTimeslotByIdController = require("@/controllers/organisation/timeslot/read/getTimeslotById.controller");

const UpdateTimeslotValidator = require("@/validators/organisation/updateTimeslot.validator");
const UpdateTimeslotController = require("@/controllers/organisation/timeslot/update/updateTimeslot.controller");

const DeleteTimeslotController = require("@/controllers/organisation/timeslot/delete/deleteTimeslot.controller");

// CREATE
router.post(
    "/create",
    SanitizeRequest,
    CreateTimeslotValidator,
    CreateTimeslotController
);

// READ
router.get(
    "/",
    SanitizeRequest,
    GetAllTimeslotsController
);

router.get(
    "/:timeslotId",
    SanitizeRequest,
    GetTimeslotByIdController
);

// UPDATE
router.patch(
    "/:timeslotId",
    SanitizeRequest,
    UpdateTimeslotValidator,
    UpdateTimeslotController
);

// DELETE
router.delete(
    "/:timeslotId",
    SanitizeRequest,
    DeleteTimeslotController
);

module.exports = router;
