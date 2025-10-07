import * as Routing from "@googlemaps/routing";

import Waypoint = Routing.protos.google.maps.routing.v2.Waypoint;
import logger from "../logger/logger";
import { Location, RouteInfo } from "../routing/types";

export class GoogleMapsRoutingClient {
    private client: Routing.v2.RoutesClient;

    constructor(apiKey: string) {
        this.client = new Routing.v2.RoutesClient({
            apiKey,
        });
    }

    // Accept only location waypoints for simplicity
    public async computeDelay(
        origin: Location,
        destination: Location
    ): Promise<RouteInfo> {
        const originWaypoint: Waypoint = Waypoint.create({
            location: {
                latLng: {
                    latitude: origin.latitude,
                    longitude: origin.longitude,
                },
            },
        });

        const destinationWaypoint: Waypoint = Waypoint.create({
            location: {
                latLng: {
                    latitude: destination.latitude,
                    longitude: destination.longitude,
                },
            },
        });

        const request = {
            origin: originWaypoint,
            destination: destinationWaypoint,
            travelMode:
                Routing.protos.google.maps.routing.v2.RouteTravelMode.DRIVE,
            routingPreference:
                Routing.protos.google.maps.routing.v2.RoutingPreference
                    .TRAFFIC_AWARE_OPTIMAL,
            computeAlternativeRoutes: false,
            languageCode: "en-US",
            units: Routing.protos.google.maps.routing.v2.Units.METRIC,
        };

        const [response] = await this.client.computeRoutes(request, {
            otherArgs: {
                headers: {
                    "X-Goog-FieldMask":
                        "routes.distanceMeters,routes.duration,routes.distanceMeters,routes.staticDuration",
                },
            },
        });

        if (!response.routes?.[0]) {
            logger.error("No route found", { request });

            throw new Error("No route found");
        }

        const route = response.routes[0];
        const distanceMeters = route.distanceMeters;
        const durationSeconds = Number(route.staticDuration?.seconds) || 0;
        const trafficDurationSeconds = Number(route.duration?.seconds) || 0;

        if (distanceMeters === undefined) {
            logger.error("Route has no distance", { route });

            throw new Error("Route has no distance");
        }

        if (durationSeconds === 0 || trafficDurationSeconds === 0) {
            logger.error("Route has no duration", { route });

            throw new Error("Route has no duration");
        }

        logger.info("Route computed", {
            distanceMeters,
            durationSeconds,
            trafficDurationSeconds,
        });

        return {
            distanceMeters: distanceMeters || 0,
            durationSeconds: durationSeconds || 0,
            trafficDurationSeconds: trafficDurationSeconds || 0,
        };
    }
}
