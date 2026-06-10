const express = require("express");
const router = express.Router();

const SanitizeRequest = require("@/validators/main/sanitize/sanitizeRequest");

const CreateCalendarValidator = require("@/validators/organisation/createCalendar.validator");
const CreateCalendarController = require("@/controllers/organisation/calendar/create/createCalendar.controller");

const GetAllCalendarsController = require("@/controllers/organisation/calendar/read/getAllCalendars.controller");
const GetCalendarByIdController = require("@/controllers/organisation/calendar/read/getCalendarById.controller");

const UpdateCalendarValidator = require("@/validators/organisation/updateCalendar.validator");
const UpdateCalendarController = require("@/controllers/organisation/calendar/update/updateCalendar.controller");

const DeleteCalendarController = require("@/controllers/organisation/calendar/delete/deleteCalendar.controller");

// CREATE
router.post(
    "/create",
    SanitizeRequest,
    CreateCalendarValidator,
    CreateCalendarController
);

// READ
router.get(
    "/",
    SanitizeRequest,
    GetAllCalendarsController
);

router.get(
    "/:calendarId",
    SanitizeRequest,
    GetCalendarByIdController
);

// UPDATE
router.patch(
    "/:calendarId",
    SanitizeRequest,
    UpdateCalendarValidator,
    UpdateCalendarController
);

// DELETE
router.delete(
    "/:calendarId",
    SanitizeRequest,
    DeleteCalendarController
);

module.exports = router;
