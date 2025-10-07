import dotenv from "dotenv";

// Load environment variables
dotenv.config();

interface Config {
    nodeEnv: string;
    port: number;
    corsOrigin: string;
    logLevel: string;
    logDir: string;
    googleMapsApiKey: string;
    openAiApiKey: string;
    sendGridApiKey: string;
    senderEmail: string;
}

const config: Config = {
    nodeEnv: process.env["NODE_ENV"] || "development",
    port: parseInt(process.env["PORT"] || "3000", 10),
    corsOrigin: process.env["CORS_ORIGIN"] || "*",
    logLevel: process.env["LOG_LEVEL"] || "info",
    logDir: process.env["LOG_DIR"] || "logs",
    googleMapsApiKey: process.env["GOOGLE_MAPS_API_KEY"] || "",
    openAiApiKey: process.env["OPEN_AI_API_KEY"] || "",
    sendGridApiKey: process.env["SEND_GRID_API_KEY"] || "",
    senderEmail: process.env["SENDER_EMAIL"] || "",
};

export { config };
