import { Request, Response, NextFunction } from "express";
import { logger } from "../utils/logger";

interface Error {
    status?: number;
    statusCode?: number;
    message: string;
    stack?: string;
}

export const errorHandler = (
    error: Error,
    req: Request,
    res: Response,
    next: NextFunction
): void => {
    const status = error.status || error.statusCode || 500;
    const message = error.message || "Internal Server Error";

    // Log the error
    logger.error(
        `${status} - ${message} - ${req.originalUrl} - ${req.method} - ${req.ip}`,
        {
            error: error.stack,
            url: req.originalUrl,
            method: req.method,
            ip: req.ip,
            userAgent: req.get("User-Agent"),
        }
    );

    // Send error response
    res.status(status).json({
        success: false,
        error: {
            status,
            message,
            ...(process.env.NODE_ENV === "development" && {
                stack: error.stack,
            }),
        },
    });
};
