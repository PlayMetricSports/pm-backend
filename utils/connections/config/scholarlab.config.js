const scholarlabConfig = {
    baseUrl: process.env.SCHOLARLAB_API_BASE_URL || 'https://api.scholarlab.in',
    clientKey: process.env.SCHOLARLAB_CLIENT_KEY,
    
    tokenTTL: 50 * 60,
    simulationsTTL: 24 * 60 * 60,
    
    redisKeys: {
        token: 'scholarlab:token',
        simulations: 'scholarlab:sims'
    },
    
    endpoints: {
        getToken: '/ClientSimulations/GetToken',
        getClientSimulations: '/ClientSimulations/GetClientSimulations'
    }
};

module.exports = scholarlabConfig;