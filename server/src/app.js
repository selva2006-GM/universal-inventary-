
import express from "express";
import cors from "cors";
import helmet from "helmet";

import { env } from "./config/env.js";
import { checkDatabaseConnection } from "./config/database.js";

const app = express();

app.disable("x-powered-by");

app.use(helmet());

app.use(cors({
    origin: env.FRONTEND_URL,
    credentials: true
}));

app.use(express.json({ limit: "1mb" }));

app.use(express.urlencoded({
    extended: true,
    limit: "1mb"
}));

app.get("/", (req, res) => {
    res.json({
        name: "Inventory Management API",
        version: "2.0.0",
        status: "running"
    });
});

app.get("/api/v1/health/live", (req, res) => {
    res.status(200).json({
        status: "alive"
    });
});

app.get("/api/v1/health/ready", async (req, res) => {
    try {
        const database = await checkDatabaseConnection();

        res.status(200).json({
            status: "ready",
            database: "connected",
            timestamp: database.database_time
        });
    } catch (error) {
        console.error("Database readiness failed:", error.message);

        res.status(503).json({
            status: "not_ready",
            database: "disconnected"
        });
    }
});

app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: "API endpoint not found."
    });
});

app.use((error, req, res, next) => {
    console.error("Application error:", error);

    if (res.headersSent) {
        return next(error);
    }

    res.status(error.statusCode || 500).json({
        success: false,
        message:
            env.NODE_ENV === "production"
                ? "Internal server error."
                : error.message
    });
});

export default app;
