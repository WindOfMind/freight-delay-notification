import { proxyActivities } from "@temporalio/workflow";
import type { createActivities } from "./activity";
import { Location } from "../routing/types";

const { calculateDelay, generateMessage, sendNotification } = proxyActivities<
    ReturnType<typeof createActivities>
>({
    startToCloseTimeout: "1 minute",
});

export interface RouteDelayNotificationWorkflowResult {
    notificationSent: boolean;
    delayInSec: number;
    thresholdInSec: number;
}

export async function routeDelayNotificationWorkflow(
    origin: Location,
    destination: Location,
    orderId: string,
    userName: string,
    userEmail: string,
    thresholdInSec: number
): Promise<RouteDelayNotificationWorkflowResult> {
    const delay = await calculateDelay(origin, destination);

    if (delay < thresholdInSec) {
        return { notificationSent: false, delayInSec: delay, thresholdInSec };
    }

    const message = await generateMessage(delay, userName, orderId);

    await sendNotification(message, userEmail);

    return { notificationSent: true, delayInSec: delay, thresholdInSec };
}
