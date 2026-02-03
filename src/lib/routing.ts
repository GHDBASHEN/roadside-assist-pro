import axios from 'axios';

/**
 * Fetches the driving route between two points using OSRM.
 * @param start [lat, lng]
 * @param end [lat, lng]
 * @returns Array of [lat, lng] coordinates representing the route
 */
export const getRoute = async (start: [number, number], end: [number, number]): Promise<[number, number][]> => {
    try {
        // OSRM expects {longitude},{latitude}
        const startStr = `${start[1]},${start[0]}`;
        const endStr = `${end[1]},${end[0]}`;

        const url = `https://router.project-osrm.org/route/v1/driving/${startStr};${endStr}?overview=full&geometries=geojson`;

        const res = await axios.get(url);

        if (res.data.routes && res.data.routes.length > 0) {
            const coordinates = res.data.routes[0].geometry.coordinates;
            // OSRM returns [lon, lat], Leaflet needs [lat, lon]
            return coordinates.map((coord: [number, number]) => [coord[1], coord[0]]);
        }
        return [];
    } catch (error) {
        console.error("Failed to fetch route", error);
        return [];
    }
};
