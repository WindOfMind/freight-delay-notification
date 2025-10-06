import { proxyActivities } from "@temporalio/workflow";
// Only import the activity types
import type { createActivities } from "./activity";
import { Location } from "../routes/types";

const { calculateDelay } = proxyActivities<ReturnType<typeof createActivities>>(
    {
        startToCloseTimeout: "1 minute",
    }
);

export async function routeDelayNotificationWorkflow(
    origin: Location,
    destination: Location
): Promise<number> {
    return await calculateDelay(origin, destination);
}
