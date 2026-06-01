const express = require('express');
const employeeRoutes = require('./employee.route');
const userRoutes = require('./user.route');


const router = express.Router();

router.use("/employee", employeeRoutes);
router.use("/user", userRoutes);


module.exports = router;