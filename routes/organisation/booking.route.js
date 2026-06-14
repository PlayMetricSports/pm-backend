const express = require("express");
const router = express.Router();

const SanitizeRequest = require("@/validators/main/sanitize/sanitizeRequest");

const CreateBookingController = require("@/controllers/organisation/booking/create/createBooking.controller");
const CreateBookingValidator = require("@/validators/organisation/createBooking.validator");

const GetAllBookingsController = require("@/controllers/organisation/booking/read/getAllBooking.controller");
const GetAllFilterDetailsController = require("@/controllers/organisation/booking/read/getAllFilterDetails.controller");

const GetBookingByIdController = require("@/controllers/organisation/booking/read/getBookingById.controller");

const UpdateBookingController = require("@/controllers/organisation/booking/update/updateBooking.controller");
const UpdateBookingValidator = require("@/validators/organisation/updateBooking.validator");

const DeleteBookingController = require("@/controllers/organisation/booking/delete/deleteBooking.controller");

// CREATE
router.post(
    "/create",
    SanitizeRequest,
    CreateBookingValidator,
    CreateBookingController
);

// READ
router.get(
    "/",
    SanitizeRequest,
    GetAllBookingsController
);
router.get(
    "/filter-details",
    SanitizeRequest,
    GetAllFilterDetailsController
);

// GET SINGLE 
router.get(
    "/:bookingId",
    SanitizeRequest,
    GetBookingByIdController
);

// UPDATE
router.patch(
    "/:bookingId",
    SanitizeRequest,
    UpdateBookingValidator,
    UpdateBookingController
);

// DELETE
router.delete(
    "/:bookingId",
    SanitizeRequest,
    DeleteBookingController
);

module.exports = router;
