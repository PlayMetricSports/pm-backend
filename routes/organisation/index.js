const express = require('express');
const orgRoutes = require('./org.route');
const sportRoutes = require('./sport.route');
const venueRoutes = require('./venue.route');
const calendarRoutes = require('./calendar.route');
const timeslotRoutes = require('./timeslot.route');
const bookingRoutes = require('./booking.route');
const dashboardRoutes = require('./dashboard.route');
const courtRoutes = require('./court.route');

const router = express.Router();

router.use("/org", orgRoutes);
router.use("/sport", sportRoutes);
router.use("/venue", venueRoutes);
router.use("/calender", calendarRoutes);
router.use("/timeslot", timeslotRoutes);
router.use("/booking", bookingRoutes);
router.use("/court", courtRoutes);
router.use("/dashboard", dashboardRoutes);

module.exports = router;
