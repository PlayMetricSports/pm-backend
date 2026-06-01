const express = require('express');
const accountRoutes = require('./account');
const staffRoutes = require('./employee');


// JSON Body / Param Sanitization
const SanitizeRequest = require("@/validators/main/sanitize/sanitizeRequest");

// Request Body Decryption
const DecryptRequest = require("@/security/newDecryptRequest.security");

// Midlleware
const Middleware = require("@/utils/middleware/middleware");



const router = express.Router();
router.use(express.text())

// router.use(DecryptRequest)
router.use(SanitizeRequest)

// router.use("/public", publicRoutes);

router.use("/account", accountRoutes);
router.use(Middleware)

router.use("/staff", staffRoutes);

module.exports = router;
