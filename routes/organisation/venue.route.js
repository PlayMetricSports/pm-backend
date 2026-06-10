const express = require("express");
const router = express.Router();

const SanitizeRequest = require("@/validators/main/sanitize/sanitizeRequest");

const CreateVenueValidator = require("@/validators/organisation/createVenue.validator");
const CreateVenueController = require("@/controllers/organisation/venue/create/createVenue.controller");

const GetAllVenuesController = require("@/controllers/organisation/venue/read/getAllVenues.controller");
const GetVenueByIdController = require("@/controllers/organisation/venue/read/getVenueById.controller");

const UpdateVenueValidator = require("@/validators/organisation/updateVenue.validator");
const UpdateVenueController = require("@/controllers/organisation/venue/update/updateVenue.controller");

const DeleteVenueController = require("@/controllers/organisation/venue/delete/deleteVenue.controller");

// CREATE
router.post(
    "/create",
    SanitizeRequest,
    CreateVenueValidator,
    CreateVenueController
);

// READ
router.get(
    "/",
    SanitizeRequest,
    GetAllVenuesController
);

router.get(
    "/:venueId",
    SanitizeRequest,
    GetVenueByIdController
);

// UPDATE
router.patch(
    "/:venueId",
    SanitizeRequest,
    UpdateVenueValidator,
    UpdateVenueController
);

// DELETE
router.delete(
    "/:venueId",
    SanitizeRequest,
    DeleteVenueController
);

module.exports = router;
