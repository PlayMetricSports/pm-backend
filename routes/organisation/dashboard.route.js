const express = require("express");
const router = express.Router();

const SanitizeRequest = require("@/validators/main/sanitize/sanitizeRequest");

const GetDashboardDataController = require("@/controllers/organisation/dashboard/read/getDashboardData.controller");


const Middleware = require("@/utils/middleware/middleware");


router.get(
    "/details",
    SanitizeRequest,
    Middleware,
    GetDashboardDataController
);


module.exports = router;
