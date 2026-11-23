
import app from "./app.js";

import { env } from "./config/env.js";

import {
    checkDatabaseConnection,
    closeDatabaseConnection
} from "./config/database.js";

let server;
let shuttingDown = false;

async function startServer() {
    try {
        // Verify database before accepting traffic.
        await checkDatabaseConnection();

        console.log("PostgreSQL connected successfully.");

        server = app.listen(env.PORT, "0.0.0.0", () => {
            console.log("--------------------------------");
            console.log("Inventory V2 API");
            console.log(`Environment: ${env.NODE_ENV}`);
            console.log(`Port: ${env.PORT}`);
            console.log("--------------------------------");
        });

        server.on("error", (error) => {
            console.error("HTTP server error:", error);
            process.exitCode = 1;
        });

    } catch (error) {
        console.error("Application startup failed:", error);
        process.exitCode = 1;

        await closeDatabaseConnection();
    }
}

async function shutdown(signal) {
    if (shuttingDown) return;

    shuttingDown = true;

    console.log(`${signal} received. Shutting down...`);

    if (server) {
        await new Promise((resolve) => {
            server.close(resolve);
        });
    }

    try {
        await closeDatabaseConnection();

        console.log("Database connections closed.");
        console.log("Server shutdown complete.");

    } catch (error) {
        console.error("Shutdown error:", error);
        process.exitCode = 1;
    }
}

process.on("SIGTERM", () => shutdown("SIGTERM"));
process.on("SIGINT", () => shutdown("SIGINT"));

startServer();
