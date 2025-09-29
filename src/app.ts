import express, { Express, Request, Response } from "express";
import { config } from "./config/config";
import logger from "./logger/logger";
import { errorHandler } from "./middleware/errorHandler";
import { requestLogger } from "./middleware/requestLogger";

// Import routes
import healthRoutes from "./routes/health";

class App {
    public app: Express;
    private readonly port: number;

    constructor() {
        this.app = express();
        this.port = config.port;

        this.initializeMiddlewares();
        this.initializeRoutes();
        this.initializeErrorHandling();
    }

    private initializeMiddlewares(): void {
        // Request logging middleware (should be first to capture all requests)
        this.app.use(requestLogger);

        // Body parsing middleware
        this.app.use(express.json({ limit: "10mb" }));
        this.app.use(express.urlencoded({ extended: true, limit: "10mb" }));
    }

    private initializeRoutes(): void {
        // Health check routes
        this.app.use("/health", healthRoutes);

        // Root endpoint
        this.app.get("/", (_req: Request, res: Response) => {
            res.json({
                message: "Freight Delay Notification Service",
                version: "1.0.0",
                status: "running",
            });
        });

        // 404 handler
        this.app.use("*", (req: Request, res: Response) => {
            res.status(404).json({
                error: "Route not found",
                path: req.originalUrl,
            });
        });
    }

    private initializeErrorHandling(): void {
        this.app.use(errorHandler);
    }

    public listen(): void {
        this.app.listen(this.port, () => {
            logger.info(`🚀 Server running on port ${this.port}`);
            logger.info(`📊 Environment: ${config.nodeEnv}`);
            logger.info(`🌐 CORS Origin: ${config.corsOrigin}`);
        });
    }
}

export default App;
