import dotenv from "dotenv";

dotenv.config();

const config = {
    env: process.env.NODE_ENV ?? "development",
    host: process.env.HOST ?? "localhost",
    port: process.env.PORT ? Number(process.env.PORT) : 5500,
    logLevel: process.env.LOG_LEVEL ?? "info",
    db_conn_string: process.env.CONNECTION_STRING,
    jwtSecret: process.env.JWT_SECRET!,
    cronSecret: process.env.CRON_SECRET!,
};

export default config;
