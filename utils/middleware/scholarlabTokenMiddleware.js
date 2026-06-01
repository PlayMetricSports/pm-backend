const axios = require('axios');
const scholarlabConfig = require('@/utils/connections/config/scholarlab.config');
const redisUtil = require('@/utils/connections/redis/redisClient');
const User = require('@/models/account/user.model');

async function fetchToken() {
    const url = scholarlabConfig.baseUrl + scholarlabConfig.endpoints.getToken;
    
    const resp = await axios.get(url, {
        params: { client_Key: scholarlabConfig.clientKey },
        timeout: 10000
    });
    
    if (!resp.data || !resp.data.token) {
        throw new Error('Invalid token response');
    }
    
    return resp.data.token;
}

async function fetchSimulations(token, email) {
    const url = scholarlabConfig.baseUrl + scholarlabConfig.endpoints.getClientSimulations;
    
    const resp = await axios.post(url, {
        token: token,
        userName: email
    }, {
        headers: { 'Content-Type': 'application/json' },
        timeout: 30000
    });
    
    if (!resp.data) {
        throw new Error('Empty simulations response');
    }
    
    let simulations = resp.data.simulations || resp.data.Simulations || resp.data || [];
    
    if (!Array.isArray(simulations)) {
        simulations = [];
    }
    
    return simulations;
}

async function ensureScholarlabToken(req, res, next) {
    try {
        const tokenKey = scholarlabConfig.redisKeys.token;
        let token = await redisUtil.getFromCache(tokenKey);
        
        if (!token) {
            token = await fetchToken();
            await redisUtil.setInCache(tokenKey, token, scholarlabConfig.tokenTTL);
        }
        
        req.scholarlabToken = token;
        next();
        
    } catch (err) {
        console.error('Token middleware error:', err.message);
        return res.status(502).json({
            success: false,
            message: 'Failed to connect to simulation service'
        });
    }
}

async function ensureSimulationsCache(req, res, next) {
    try {
        const simsKey = scholarlabConfig.redisKeys.simulations;
        let cached = await redisUtil.getFromCache(simsKey);
        
        if (cached) {
            req.scholarlabSimulations = JSON.parse(cached);
            return next();
        }
        
        const userId = req.user._id || req.user.id;
        const userData = await User.findById(userId).select('email').lean();
        
        if (!userData || !userData.email || !userData.email.address) {
            return res.status(400).json({
                success: false,
                message: 'User email not available'
            });
        }
        
        const email = userData.email.address;
        const token = req.scholarlabToken;
        
        const simulations = await fetchSimulations(token, email);
        
        if (simulations.length > 0) {
            await redisUtil.setInCache(simsKey, JSON.stringify(simulations), scholarlabConfig.simulationsTTL);
        }
        
        req.scholarlabSimulations = simulations;
        next();
        
    } catch (err) {
        console.error('Simulations middleware error:', err.message);
        return res.status(502).json({
            success: false,
            message: 'Failed to fetch simulations from provider'
        });
    }
}

module.exports = {
    ensureScholarlabToken,
    ensureSimulationsCache
};