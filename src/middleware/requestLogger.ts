import { Request, Response, NextFunction } from "express";
import logger from "../logger/logger";

interface LoggedRequest extends Request {
    startTime?: number;
}

export const requestLogger = (
    req: LoggedRequest,
    res: Response,
    next: NextFunction
): void => {
    // Record the start time
    req.startTime = Date.now();

    // Log the incoming request
    const requestInfo = {
        method: req.method,
        url: req.originalUrl || req.url,
        ip: req.ip || req.connection.remoteAddress,
        userAgent: req.get("User-Agent"),
        contentLength: req.get("Content-Length"),
        timestamp: new Date().toISOString(),
    };

    logger.info(`📨 ${req.method} ${req.originalUrl || req.url}`, requestInfo);

    // Override res.end to log response details
    const originalEnd = res.end.bind(res);
    res.end = function (chunk?: any, encoding?: any, cb?: any) {
        // Calculate response time
        const responseTime = Date.now() - (req.startTime || Date.now());

        // Log the response
        const responseInfo = {
            method: req.method,
            url: req.originalUrl || req.url,
            statusCode: res.statusCode,
            responseTime: `${responseTime}ms`,
            contentLength: res.get("Content-Length"),
            ip: req.ip || req.socket.remoteAddress,
            timestamp: new Date().toISOString(),
        };

        // Choose log level based on status code
        if (res.statusCode >= 500) {
            logger.error(
                `❌ ${req.method} ${req.originalUrl || req.url} - ${
                    res.statusCode
                } - ${responseTime}ms`,
                responseInfo
            );
        } else if (res.statusCode >= 400) {
            logger.warn(
                `⚠️  ${req.method} ${req.originalUrl || req.url} - ${
                    res.statusCode
                } - ${responseTime}ms`,
                responseInfo
            );
        } else {
            logger.info(
                `✅ ${req.method} ${req.originalUrl || req.url} - ${
                    res.statusCode
                } - ${responseTime}ms`,
                responseInfo
            );
        }

        // Call the original end method and return its result
        return originalEnd(chunk, encoding, cb);
    } as typeof res.end;

    next();
};
