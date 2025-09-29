import { Router, Request, Response } from "express";
import { Client, Connection } from "@temporalio/client";
import { nanoid } from "nanoid";
import { example } from "../workflow/workflow";

const router = Router();

// Basic health check
router.post("/check", async (_req: Request, res: Response) => {
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

    const handle = await client.workflow.start(example, {
        taskQueue: "hello-world",
        // type inference works! args: [name: string]
        args: ["Temporal"],
        // in practice, use a meaningful business ID, like customerId or transactionId
        workflowId: "workflow-" + nanoid(),
    });
    console.log(`Started workflow ${handle.workflowId}`);

    // optional: wait for client result
    const result = await handle.result();
    console.log(result); // Hello, Temporal!

    res.status(200).json({ status: "OK", workflowResult: result });
});

export default router;
