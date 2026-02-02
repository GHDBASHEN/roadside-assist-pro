import { MapContainer, TileLayer, Marker, Popup, useMap, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { useEffect, useState, useRef, useMemo } from 'react';
import L from 'leaflet';

// Fix for default marker icon in Leaflet with React
// @ts-ignore
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const MapUpdater = ({ center }: { center: [number, number] }) => {
    const map = useMap();
    useEffect(() => {
        map.flyTo(center, 13);
    }, [center, map]);
    return null;
};

const LocationMarker = ({ position, onLocationSelect, draggable }: { position: [number, number], onLocationSelect?: (lat: number, lng: number) => void, draggable?: boolean }) => {
    const markerRef = useRef<any>(null);

    useMapEvents({
        click(e) {
            if (draggable && onLocationSelect) {
                onLocationSelect(e.latlng.lat, e.latlng.lng);
            }
        },
    });

    const eventHandlers = useMemo(
        () => ({
            dragend() {
                const marker = markerRef.current;
                if (marker != null && onLocationSelect) {
                    const { lat, lng } = marker.getLatLng();
                    onLocationSelect(lat, lng);
                }
            },
        }),
        [onLocationSelect],
    );

    return (
        <Marker
            draggable={draggable}
            eventHandlers={eventHandlers}
            position={position}
            ref={markerRef}
        >
            <Popup>
                You are here
            </Popup>
        </Marker>
    );
};

interface MapProps {
    center: [number, number];
    markers?: { id: string, lat: number, lng: number, title: string, type?: string }[];
    onLocationSelect?: (lat: number, lng: number) => void;
    enableLocationSelection?: boolean;
    onMarkerClick?: (id: string) => void;
}

const Map = ({ center, markers, onLocationSelect, enableLocationSelection = false, onMarkerClick }: MapProps) => {
    return (
        <MapContainer center={center} zoom={13} style={{ height: '100%', width: '100%' }}>
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            <LocationMarker
                position={center}
                onLocationSelect={onLocationSelect}
                draggable={enableLocationSelection}
            />

            {markers && markers.map(marker => (
                <Marker
                    key={marker.id}
                    position={[marker.lat, marker.lng]}
                    eventHandlers={{
                        click: () => {
                            if (onMarkerClick) onMarkerClick(marker.id);
                        }
                    }}
                >
                    <Popup>
                        {marker.title}
                        {onMarkerClick && marker.type === 'available' && (
                            <div className="mt-2 text-center">
                                <span className="text-xs text-blue-600 font-semibold cursor-pointer">Click marker to select</span>
                            </div>
                        )}
                    </Popup>
                </Marker>
            ))}
            <MapUpdater center={center} />
        </MapContainer>
    );
};

export default Map;
