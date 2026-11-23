
import dotenv from "dotenv";
import { z } from "zod";

dotenv.config();

const envSchema = z.object({
    NODE_ENV: z.enum([
        "development",
        "production",
        "test"
    ]).default("development"),

    PORT: z.coerce.number().int().min(1).max(65535).default(5000),

    FRONTEND_URL: z.url().default("http://localhost:5173"),

    DATABASE_URL: z.string().min(1, "DATABASE_URL is required"),

    DB_POOL_MAX: z.coerce.number().int().min(1).max(100).default(10),

    DB_IDLE_TIMEOUT_MS: z.coerce.number().int().positive().default(30000),

    DB_CONNECTION_TIMEOUT_MS: z.coerce.number().int().positive().default(5000)
});

const result = envSchema.safeParse(process.env);

if (!result.success) {
    console.error("Invalid environment configuration:");
    console.error(z.treeifyError(result.error));
    process.exit(1);
}

// Named export used by database.js and app.js
export const env = Object.freeze(result.data);
