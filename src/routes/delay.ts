import { Router, Request, Response } from "express";
import { Client, Connection } from "@temporalio/client";
import { nanoid } from "nanoid";
import { routeDelayNotificationWorkflow } from "../workflow/workflow";
import logger from "../logger/logger";

const router = Router();

// Basic health check
router.post("/check", async (req: Request, res: Response) => {
    const connection = await Connection.connect({ address: "localhost:7233" });
    // In production, pass options to configure TLS and other settings:
    // {
    //   address: 'foo.bar.tmprl.cloud',
    //   tls: {}
    // }

    const client = new Client({
        connection,
        // namespace: 'foo.bar', // connects to 'default' namespace if not specified
    });

    const { origin, destination } = req.body;

    if (!origin || !destination) {
        res.status(400).json({ error: "Missing origin or destination" });
        return;
    }

    logger.info("Received delay check request", { origin, destination });

    const handle = await client.workflow.start(routeDelayNotificationWorkflow, {
        taskQueue: "delay-notification",
        // type inference works! args: [name: string]
        args: [origin, destination],
        // in practice, use a meaningful business ID, like customerId or transactionId
        workflowId: "workflow-" + nanoid(),
    });

    logger.info("Started workflow", { workflowId: handle.workflowId });

    res.status(200).json({ status: "OK" });
});

export default router;
