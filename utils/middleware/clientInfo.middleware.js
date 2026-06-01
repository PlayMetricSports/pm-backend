module.exports = function clientInfoMiddleware(req, res, next) {
    const headers = req.headers;
    const userAgent = headers['user-agent'] || '';

    // --------------------
    // IP Address
    // --------------------
    const ip =
        headers['x-forwarded-for']?.split(',')[0]?.trim() ||
        headers['x-real-ip'] ||
        req.socket?.remoteAddress ||
        null;

    // --------------------
    // Language
    // --------------------
    const acceptLanguage = headers['accept-language'] || '';
    const language = acceptLanguage.split(',')[0] || null;

    // --------------------
    // Device Type
    // --------------------
    const isMobile = /mobile|android|iphone|ipad|ipod/i.test(userAgent);
    const deviceType = isMobile ? 'mobile' : 'desktop';

    // --------------------
    // Operating System
    // --------------------
    let os = null;
    if (/windows nt/i.test(userAgent)) os = 'Windows';
    else if (/mac os x/i.test(userAgent)) os = 'macOS';
    else if (/android/i.test(userAgent)) os = 'Android';
    else if (/iphone|ipad|ipod/i.test(userAgent)) os = 'iOS';
    else if (/linux/i.test(userAgent)) os = 'Linux';

    // --------------------
    // Browser
    // --------------------
    let browser = null;
    if (/edg/i.test(userAgent)) browser = 'Edge';
    else if (/chrome|crios/i.test(userAgent)) browser = 'Chrome';
    else if (/firefox|fxios/i.test(userAgent)) browser = 'Firefox';
    else if (/safari/i.test(userAgent)) browser = 'Safari';

    // --------------------
    // Client Hints (if present)
    // --------------------
    const platform = headers['sec-ch-ua-platform']
        ? headers['sec-ch-ua-platform'].replace(/"/g, '')
        : null;

    // --------------------
    // Attach to request
    // --------------------
    req.clientInfo = {
        ip,
        deviceType,
        os,
        browser,
        platform,
        language,
        referrer: headers['referer'] || null,
        origin: headers['origin'] || null,
        request: {
            method: req.method,
            path: req.originalUrl,
        },
        timestamp: new Date().toISOString(),
    };

    next();
}
