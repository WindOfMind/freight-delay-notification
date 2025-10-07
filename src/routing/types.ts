export interface Location {
    latitude: number;
    longitude: number;
}

export interface RouteInfo {
    distanceMeters: number;
    durationSeconds: number;
    trafficDurationSeconds: number;
}

export interface CheckDelayRequest {
    origin: Location;
    destination: Location;
}
