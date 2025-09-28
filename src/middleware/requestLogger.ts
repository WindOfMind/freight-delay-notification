import { Request, Response, NextFunction } from "express";
import { logger } from "../utils/logger";

export const requestLogger = (
    req: Request,
    res: Response,
    next: NextFunction
): void => {
    const start = Date.now();

    // Log the incoming request
    logger.http(`${req.method} ${req.originalUrl} - ${req.ip}`, {
        method: req.method,
        url: req.originalUrl,
        ip: req.ip,
        userAgent: req.get("User-Agent"),
    });

    // Override the end method to log response
    const originalEnd = res.end;
    res.end = function (...args: any[]): Response {
        const duration = Date.now() - start;

        logger.http(
            `${req.method} ${req.originalUrl} - ${res.statusCode} - ${duration}ms`,
            {
                method: req.method,
                url: req.originalUrl,
                statusCode: res.statusCode,
                duration: `${duration}ms`,
                ip: req.ip,
            }
        );

        return originalEnd.apply(this, args);
    };

    next();
};
