const express = require("express");
const router = express.Router();

const SanitizeRequest = require("@/validators/main/sanitize/sanitizeRequest");

const CreateSportValidator = require("@/validators/organisation/createSport.validator");
const CreateSportController = require("@/controllers/organisation/sport/create/createSport.controller");

const GetAllSportsController = require("@/controllers/organisation/sport/read/getAllSports.controller");
const GetSportByIdController = require("@/controllers/organisation/sport/read/getSportById.controller");

const UpdateSportValidator = require("@/validators/organisation/updateSport.validator");
const UpdateSportController = require("@/controllers/organisation/sport/update/updateSport.controller");

const DeleteSportController = require("@/controllers/organisation/sport/delete/deleteSport.controller");

// CREATE
router.post(
    "/create",
    SanitizeRequest,
    CreateSportValidator,
    CreateSportController
);

// READ
router.get(
    "/",
    SanitizeRequest,
    GetAllSportsController
);

router.get(
    "/:sportId",
    SanitizeRequest,
    GetSportByIdController
);

// UPDATE
router.patch(
    "/:sportId",
    SanitizeRequest,
    UpdateSportValidator,
    UpdateSportController
);

// DELETE
router.delete(
    "/:sportId",
    SanitizeRequest,
    DeleteSportController
);

module.exports = router;
