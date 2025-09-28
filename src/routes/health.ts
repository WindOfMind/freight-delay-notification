import { Router, Request, Response } from "express";

const router = Router();

// Basic health check
router.get("/", (_req: Request, res: Response) => {
    res.status(200).json({
        status: "OK",
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        service: "freight-delay-notification",
    });
});

// Detailed health check
router.get("/detailed", (_req: Request, res: Response) => {
    const healthCheck = {
        status: "OK",
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        service: "freight-delay-notification",
        version: "1.0.0",
        environment: process.env.NODE_ENV || "development",
        memory: process.memoryUsage(),
        // Add more detailed checks here as needed
        // database: 'connected',
        // redis: 'connected',
    };

    res.status(200).json(healthCheck);
});

export default router;
