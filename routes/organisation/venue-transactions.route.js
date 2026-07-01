const express = require("express");
const router = express.Router();

const SanitizeRequest = require("@/validators/main/sanitize/sanitizeRequest");

const GetRevenueDataController = require("@/controllers/organisation/venueTransactions/read/getRevenueData.controller");

const Middleware = require("@/utils/middleware/middleware");

// GET /api/v1/organisation/venue-transactions/details
router.get(
    "/details",
    SanitizeRequest,
    Middleware,
    GetRevenueDataController
);


module.exports = router;
