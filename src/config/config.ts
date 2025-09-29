import dotenv from "dotenv";

// Load environment variables
dotenv.config();

interface Config {
    nodeEnv: string;
    port: number;
    corsOrigin: string;
    logLevel: string;
    logDir: string;
}

const config: Config = {
    nodeEnv: process.env["NODE_ENV"] || "development",
    port: parseInt(process.env["PORT"] || "3000", 10),
    corsOrigin: process.env["CORS_ORIGIN"] || "*",
    logLevel: process.env["LOG_LEVEL"] || "info",
    logDir: process.env["LOG_DIR"] || "logs",
};

export { config };
