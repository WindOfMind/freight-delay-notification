import { Location } from "../routing/types";
import { GoogleMapsRoutingClient } from "../api-client/googleMapsRoutingClient";
import logger from "../logger/logger";
import { OpenAIClient } from "../api-client/openAiClient";

export const createActivities = (
    googleMapsRoutingClient: GoogleMapsRoutingClient,
    openAIClient: OpenAIClient
) => ({
    async calculateDelay(
        origin: Location,
        destination: Location
    ): Promise<number> {
        const routeInfo = await googleMapsRoutingClient.computeDelay(
            origin,
            destination
        );

        const delayInSec =
            routeInfo.trafficDurationSeconds - routeInfo.durationSeconds;

        logger.info("Calculated delay", {
            routeInfo,
            delayInSec: delayInSec,
        });

        return delayInSec;
    },

    async generateMessage(
        delayInSec: number,
        userName: string,
        orderId: string
    ): Promise<string> {
        const message = await openAIClient.getChatCompletion(
            delayInSec,
            userName,
            orderId
        );

        logger.info("Generated message", { message });

        return message;
    },
});
