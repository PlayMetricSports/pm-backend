
const express = require('express');
const cors = require('cors');
const compression = require("compression");
// const errorHandler = require('@/utils/middleware/errorHandler.middleware');
// const { initializeApp, applicationDefault } = require('firebase-admin/app');

const v1Routes = require('@/routes/index');

const clientInfoMiddleware = require("@/utils/middleware/clientInfo.middleware")
const requestMetrics = require("@/utils/middleware/requestMetrics");

const app = express();
app.set('trust proxy', 1);

// initializeApp({
//     credential: applicationDefault(),
//     projectId: 'k12schools-f437f',
// });

app.use(compression({
    level: 6,
    threshold: 0
}));

// CORS Policy
app.use(cors({
    origin: process.env.CORS_ORIGIN || '*',
    credentials: true,
}));

// Body parsing middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging
app.use(clientInfoMiddleware);
app.use(requestMetrics);

// Health check
app.get('/health', (req, res) => {
    res.json({
        success: true,
        message: 'Server is running',
        timestamp: new Date().toISOString(),
    });
});
const swaggerUi = require("swagger-ui-express");
const swaggerFile = require('@/swagger/swagger.json');

// Routes
app.use('/api/v1', v1Routes);

app.use("/api-docs/v1", swaggerUi.serve, swaggerUi.setup(swaggerFile));

// 404 handler
app.use((req, res) => {
    res.status(404).json({
        success: false,
        error: 'ROUTE_NOT_FOUND',
        path: req.path,
    });
});

// Error handler (must be last)
// app.use(errorHandler);

module.exports = app;
