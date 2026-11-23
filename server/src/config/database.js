
import pg from "pg";
import { env } from "./env.js";

const { Pool } = pg;

const pool = new Pool({
    connectionString: env.DATABASE_URL,

    // Neon requires encrypted PostgreSQL connections.
    // Keep certificate verification enabled.
    ssl: {
        rejectUnauthorized: true
    },

    max: env.DB_POOL_MAX,

    idleTimeoutMillis: env.DB_IDLE_TIMEOUT_MS,

    connectionTimeoutMillis: env.DB_CONNECTION_TIMEOUT_MS,

    application_name: "inventory-v2-api"
});

// Log unexpected errors on idle pooled connections.
pool.on("error", (error) => {
    console.error("Unexpected PostgreSQL pool error:", error);
});

export async function checkDatabaseConnection() {
    const result = await pool.query(
        "SELECT NOW() AS database_time"
    );

    return result.rows[0];
}

export async function closeDatabaseConnection() {
    await pool.end();
}

export default pool;
