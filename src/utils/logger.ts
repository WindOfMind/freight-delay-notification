import winston from "winston";
import DailyRotateFile from "winston-daily-rotate-file";
import { config } from "../config/config";
import path from "path";

// Define log levels
const levels = {
    error: 0,
    warn: 1,
    info: 2,
    http: 3,
    debug: 4,
};

// Define colors for each level
const colors = {
    error: "red",
    warn: "yellow",
    info: "green",
    http: "magenta",
    debug: "white",
};

// Tell winston that you want to link the colors
winston.addColors(colors);

// Define which logs to print based on environment
const level = (): string => {
    const env = config.nodeEnv || "development";
    const isDevelopment = env === "development";
    return isDevelopment ? "debug" : config.logLevel;
};

// Define different log format for console and file
const consoleFormat = winston.format.combine(
    winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss:ms" }),
    winston.format.colorize({ all: true }),
    winston.format.printf(
        (info: any) => `${info.timestamp} ${info.level}: ${info.message}`
    )
);

const fileFormat = winston.format.combine(
    winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss:ms" }),
    winston.format.errors({ stack: true }),
    winston.format.json()
);

// Define transports based on environment
const createTransports = (): winston.transport[] => {
    const isDevelopment = config.nodeEnv === "development";

    const transports: winston.transport[] = [
        // Console transport (always included)
        new winston.transports.Console({
            format: consoleFormat,
        }),
    ];

    // Only add file transports in non-development environments
    if (!isDevelopment) {
        transports.push(
            // Error log file transport with daily rotation
            new DailyRotateFile({
                filename: path.join(config.logDir, "error-%DATE%.log"),
                datePattern: "YYYY-MM-DD",
                level: "error",
                format: fileFormat,
                maxSize: "20m",
                maxFiles: "14d",
            }),

            // Combined log file transport with daily rotation
            new DailyRotateFile({
                filename: path.join(config.logDir, "combined-%DATE%.log"),
                datePattern: "YYYY-MM-DD",
                format: fileFormat,
                maxSize: "20m",
                maxFiles: "14d",
            })
        );
    }

    return transports;
};

// Create exception and rejection handlers based on environment
const createExceptionHandlers = (): winston.transport[] => {
    const isDevelopment = config.nodeEnv === "development";

    if (isDevelopment) {
        return [
            new winston.transports.Console({
                format: consoleFormat,
            }),
        ];
    }

    return [
        new DailyRotateFile({
            filename: path.join(config.logDir, "exceptions-%DATE%.log"),
            datePattern: "YYYY-MM-DD",
            format: fileFormat,
            maxSize: "20m",
            maxFiles: "14d",
        }),
    ];
};

const createRejectionHandlers = (): winston.transport[] => {
    const isDevelopment = config.nodeEnv === "development";

    if (isDevelopment) {
        return [
            new winston.transports.Console({
                format: consoleFormat,
            }),
        ];
    }

    return [
        new DailyRotateFile({
            filename: path.join(config.logDir, "rejections-%DATE%.log"),
            datePattern: "YYYY-MM-DD",
            format: fileFormat,
            maxSize: "20m",
            maxFiles: "14d",
        }),
    ];
};

// Create the logger
const logger = winston.createLogger({
    level: level(),
    levels,
    transports: createTransports(),
    exceptionHandlers: createExceptionHandlers(),
    rejectionHandlers: createRejectionHandlers(),
});

export { logger };
