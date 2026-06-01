
const rateLimit = require('express-rate-limit');

const subjectPageLimiter = rateLimit({
    windowMs: 15 * 1000, // 15 seconds
    max: 5,
    message: {
        code: 429,
        success: false,
        error: [{ popup: 'RATE LIMITED', message: 'Too many requests from this IP, please try again later.' }],
    },
    standardHeaders: true,
    legacyHeaders: false,
    skipFailedRequests: false,
});

const loginLimiter = rateLimit({
    windowMs: 5 * 1000, // 15 minutes
    max: 5,
    message: {
        code: 429,
        success: false,
        error: [{ popup: 'RATE LIMITED', message: 'Too many login attempts. Please try again later.' }],
        message: '',
    },
    standardHeaders: true,
    legacyHeaders: false,
});

const passwordValidationLimiter = rateLimit({
    windowMs: 1 * 60 * 1000, // 1 minute
    max: 20,
    message: {
        success: false,
        error: 'RATE_LIMITED',
        message: 'Too many password validation requests.',
    },
    standardHeaders: true,
    legacyHeaders: false,
});

module.exports = {
    subjectPageLimiter,
    loginLimiter,
    passwordValidationLimiter,
};
