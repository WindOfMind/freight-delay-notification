import { Location } from "../routes/types";
import { GoogleMapsRoutingClient } from "../api-client/googleMapsRoutingClient";
import logger from "../logger/logger";

export const createActivities = (
    googleMapsRoutingClient: GoogleMapsRoutingClient
) => ({
    async calculateDelay(
        origin: Location,
        destination: Location
    ): Promise<number> {
        // Call the Google Maps API to get the route information
        const routeInfo = await googleMapsRoutingClient.computeDelay(
            origin,
            destination
        );

        // Calculate the delay based on the route information
        const delayInSec =
            routeInfo.trafficDurationSeconds - routeInfo.durationSeconds;

        logger.info("Calculated delay", {
            origin,
            destination,
            delayInSec: delayInSec,
            routeInfo,
        });

        return delayInSec;
    },
});
