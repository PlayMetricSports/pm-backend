const slowDown = require("express-slow-down");

const speedLimiterMiddleware = slowDown({
    windowMs: 60 * 1000, // 1 minute window
    delayAfter: 3, // Allow 3 requests per minute without delay
    delayMs: () => 3000, // Add 5 second delay per request after the limit is reached
});

module.exports = speedLimiterMiddleware;