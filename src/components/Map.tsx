import { MapContainer, TileLayer, Marker, Popup, useMap, useMapEvents, Polyline } from 'react-leaflet';
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

// Helper to create an SVG string icon
const createSvgIcon = (svgContent: string, bgColor: string, borderColor: string = 'white') => {
    return new L.DivIcon({
        className: 'custom-svg-icon',
        html: `<div style="
            background-color: ${bgColor};
            width: 36px;
            height: 36px;
            border-radius: 50%;
            border: 3px solid ${borderColor};
            box-shadow: 0 4px 6px rgba(0,0,0,0.3);
            display: flex;
            align-items: center;
            justify-content: center;
            position: relative;
        ">
            ${svgContent}
            <div style="
                position: absolute;
                bottom: -8px;
                left: 50%;
                transform: translateX(-50%);
                width: 0;
                height: 0;
                border-left: 6px solid transparent;
                border-right: 6px solid transparent;
                border-top: 8px solid ${borderColor};
            "></div>
            <div style="
                position: absolute;
                bottom: -4px;
                left: 50%;
                transform: translateX(-50%);
                width: 0;
                height: 0;
                border-left: 4px solid transparent;
                border-right: 4px solid transparent;
                border-top: 6px solid ${bgColor};
            "></div>
        </div>`,
        iconSize: [36, 36],
        iconAnchor: [18, 42],
        popupAnchor: [0, -42],
    });
};

// SVG Content
const mechanicSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>`;
const userSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>`;
const meSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="3"/></svg>`;

// Icons
const userIcon = createSvgIcon(userSvg, '#ff9800'); // Orange for Users/Requestors
const mechanicIcon = createSvgIcon(mechanicSvg, '#2196f3'); // Blue for Mechanics
const meIcon = createSvgIcon(meSvg, '#4caf50'); // Green for "Me"
const activeMechanicIcon = createSvgIcon(mechanicSvg, '#f44336'); // Red for Active Mechanic

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
            icon={meIcon}
        >
            <Popup>
                <div className="font-semibold text-center text-sm">
                    Current Location<br />
                    <span className="text-xs text-muted-foreground">(Drag to adjust)</span>
                </div>
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
    route?: [number, number][]; // Array of [lat, lng]
}

const Map = ({ center, markers, onLocationSelect, enableLocationSelection = false, onMarkerClick, route }: MapProps) => {

    const getIcon = (type?: string) => {
        switch (type) {
            case 'mechanic':
            case 'available':
                return mechanicIcon;
            case 'user':
                return userIcon;
            case 'me':
                return meIcon;
            case 'booking':
                return activeMechanicIcon;
            default:
                return userIcon;
        }
    };

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

            {markers && markers.map(marker => {
                // Skip rendering markers that are practically the same as "center"/me if typed "me"
                if (marker.type === 'me') return null;

                return (
                    <Marker
                        key={marker.id}
                        position={[marker.lat, marker.lng]}
                        icon={getIcon(marker.type)}
                        eventHandlers={{
                            click: () => {
                                if (onMarkerClick) onMarkerClick(marker.id);
                            }
                        }}
                    >
                        <Popup>
                            <div className="font-semibold text-sm">
                                {marker.title}
                            </div>
                            {onMarkerClick && marker.type === 'available' && (
                                <div className="mt-2 text-center">
                                    <span className="text-xs text-blue-600 font-bold cursor-pointer hover:underline">Click to Select</span>
                                </div>
                            )}
                        </Popup>
                    </Marker>
                )
            })}
            {route && <Polyline positions={route} pathOptions={{ color: 'blue', weight: 4, dashArray: '10, 10', dashOffset: '0' }} />}
            <MapUpdater center={center} />
        </MapContainer>
    );
};

export default Map;
