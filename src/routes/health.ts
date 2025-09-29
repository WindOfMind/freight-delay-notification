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

export default router;
