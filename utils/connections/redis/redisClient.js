const redis = require("redis");
const client = redis.createClient({
    url: `${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`
    // socket: { host: process.env.REDIS_HOST, port: 6379 },
});

client.connect().catch((err) => {
    console.error("Redis connection error:", err);
})

client.on('connect', () => {
    console.log('Redis client connected');
});

client.on('error', (err) => {
    console.error('Redis error:', err);
});

async function getFromCache(key) {
    try {
        if (!client.isOpen) {
            await client.connect();
        }
        const value = await client.get(key);
        return value;
    } catch (error) {
        console.error('Redis GET error for key ' + key + ':', error.message);
        return null;
    }
}

async function setInCache(key, value, ttlSeconds) {
    try {
        if (!client.isOpen) {
            await client.connect();
        }
        if (ttlSeconds) {
            await client.setEx(key, ttlSeconds, value);
        } else {
            await client.set(key, value);
        }
        return true;
    } catch (error) {
        console.error('Redis SET error for key ' + key + ':', error.message);
        return false;
    }
}

async function deleteFromCache(key) {
    try {
        if (!client.isOpen) {
            await client.connect();
        }

        await client.del(key);

        return true;
    } catch (error) {
        console.error('Redis SET error for key ' + key + ':', error.message);
        return false;
    }
}


module.exports = {
    client,
    getFromCache,
    setInCache,
    deleteFromCache
};