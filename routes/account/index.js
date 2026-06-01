const express = require('express');
const profileRoutes = require('./profile.route');
const authenticationRoutes = require('./authentication.route');
const userRoleRoutes = require('./userRole.route');
const actionRoutes = require('./action.route');
const Middleware = require("@/utils/middleware/middleware");


const router = express.Router();

router.use("/user", profileRoutes);
router.use("/authentication", authenticationRoutes);

router.use(Middleware)

router.use("/user-role", userRoleRoutes);
router.use("/actions", actionRoutes);


module.exports = router;