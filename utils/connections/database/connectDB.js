
const mongoose = require("mongoose");

const connectDB = async () => {
    // Use mongoose's built-in connection state - no manual flag needed
    if (mongoose.connection.readyState >= 1) {
        console.log("Already connected to MongoDB");
        return mongoose.connection;
    }

    // Validate environment variable
    if (!process.env.MONGODB_URI) {
        throw new Error("MONGODB_URI is not defined in environment variables");
    }

    try {
        // Set mongoose options globally to prevent multiple connection attempts
        mongoose.set('strictQuery', false);

        await mongoose.connect(process.env.MONGODB_URI, {
            maxPoolSize: 10,        // Reduced - you don't need 50+
            minPoolSize: 2,         // Keep some connections warm
            maxIdleTimeMS: 130000,   // Close idle connections after 50s
            serverSelectionTimeoutMS: 5000,
            socketTimeoutMS: 130000,
            family: 4               // Force IPv4 to avoid dual-stack issues
        });

        console.log("MongoDB connected successfully");

        // Set up one-time event listeners (important!)
        mongoose.connection.once('disconnected', () => {
            console.warn("MongoDB disconnected");
        });

        mongoose.connection.once('error', (err) => {
            console.error("MongoDB connection error:", err);
        });

        return mongoose.connection;

    } catch (error) {
        console.error("Failed to connect to MongoDB:", error.message);
        throw error;
    }
};

// Graceful shutdown handler
const disconnectDB = async () => {
    if (mongoose.connection.readyState !== 0) {
        await mongoose.connection.close();
        console.log("MongoDB connection closed");
    }
};

const cronConnect = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
    } catch (error) {
        console.error(error);
    }
}

module.exports = { connectDB, disconnectDB, cronConnect };