require("module-alias/register");
require("dotenv").config();
const express = require("express");

const { connectDB, disconnectDB } = require("@/utils/connections/database/connectDB");
const cluster = require("cluster");

//////////server Socket Setup ////////
const http = require("http");
// const redisAdapter = require("socket.io-redis");

const { initializeSocket } = require("./utils/connections/database/socket");

//////////////////////////////////////

const PORT = process.env.BACKEND_PORT || 5000;


// Limit workers
const numCPUs = process.env.NUMBER_OF_CPUS || 1;

async function startSocket() {

    const socketApp = express();
    const socketServer = http.createServer(socketApp);
    initializeSocket(socketServer)

    // Start the Socket Server
    const SOCKET_PORT = process.env.SOCKET_PORT || 5052;
    socketServer.listen(SOCKET_PORT, () => {
        console.warn(`Socket.IO server running on port ${SOCKET_PORT} : Worker ${process.pid}`);
    });
}

// Connect to Database and Start Server
async function startV2Server() {
    const v2app = require('@/app');

    try {
        await connectDB();
        // await startSocket()
        // Start the server
        const server = v2app.listen(PORT, () => {
            console.warn(`🚀 Worker ${process.pid} is running on port: ${PORT}`);
        });

        // ✅ graceful shutdown handlers
        process.on("SIGINT", shutdown);
        process.on("SIGTERM", shutdown);

        // eslint-disable-next-line no-inner-declarations
        async function shutdown() {
            console.warn(`Worker ${process.pid} shutting down...`);
            server.close(() => {
                console.log("HTTP server closed.");
            });
        }

    } catch (error) {
        console.error("Failed to connect to the database:", error);
        process.exit(1);
    }
}
if (cluster.isPrimary) {
    for (let i = 0; i < numCPUs; i++) {
        cluster.fork();
    }
    cluster.on("exit", (worker) => {
        console.warn(`Worker ${worker.process.pid} died. Restarting...`);
        cluster.fork();
    });
} else {
    startV2Server()
}