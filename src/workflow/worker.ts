import { NativeConnection, Worker } from "@temporalio/worker";
import { createActivities } from "./activity";
import { config } from "../config/config";
import { GoogleMapsRoutingClient } from "../api-client/googleMapsRoutingClient";
import { OpenAIClient } from "../api-client/openAiClient";
import { SendGridClient } from "../api-client/sendGridClient";

async function run() {
    // Step 1: Establish a connection with Temporal server.
    //
    // Worker code uses `@temporalio/worker.NativeConnection`.
    // (But in your application code it's `@temporalio/client.Connection`.)
    const connection = await NativeConnection.connect({
        address: "localhost:7233",
        // TLS and gRPC metadata configuration goes here.
    });

    // Initialize Google Maps Client
    const googleMapsApiKey = config.googleMapsApiKey;
    if (!googleMapsApiKey) {
        throw new Error("GOOGLE_MAPS_API_KEY is not set");
    }

    const googleMapsClient = new GoogleMapsRoutingClient(googleMapsApiKey);

    // Initialize OpenAI Client
    const openAiApiKey = config.openAiApiKey;
    if (!openAiApiKey) {
        throw new Error("OPEN_AI_API_KEY is not set");
    }
    const openAIClient = new OpenAIClient(openAiApiKey);

    // Initialize SendGrid Client
    const sendGridApiKey = config.sendGridApiKey;
    if (!sendGridApiKey) {
        throw new Error("SEND_GRID_API_KEY is not set");
    }
    const senderEmail = config.senderEmail;
    if (!senderEmail) {
        throw new Error("SENDER_EMAIL is not set");
    }
    const sendGridClient = new SendGridClient(sendGridApiKey, senderEmail);

    try {
        // Step 2: Register Workflows and Activities with the Worker.
        const worker = await Worker.create({
            connection,
            namespace: "default",
            taskQueue: "delay-notification",
            // Workflows are registered using a path as they run in a separate JS context.
            workflowsPath: require.resolve("./workflow"),
            activities: createActivities(
                googleMapsClient,
                openAIClient,
                sendGridClient
            ),
        });

        // Step 3: Start accepting tasks on the `hello-world` queue
        //
        // The worker runs until it encounters an unexpected error or the process receives a shutdown signal registered on
        // the SDK Runtime object.
        //
        // By default, worker logs are written via the Runtime logger to STDERR at INFO level.
        //
        // See https://typescript.temporal.io/api/classes/worker.Runtime#install to customize these defaults.
        await worker.run();
    } finally {
        // Close the connection once the worker has stopped
        await connection.close();
    }
}

run().catch((err) => {
    console.error(err);
    process.exit(1);
});
