import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { toast } from 'sonner';

interface GPSImporterProps {
    onLocationUpdate: (location: { latitude: number; longitude: number }) => void;
    currentLocation?: { latitude: number; longitude: number };
}

const GPSImporter = ({ onLocationUpdate, currentLocation }: GPSImporterProps) => {
    const [latitude, setLatitude] = useState(currentLocation?.latitude?.toString() || '');
    const [longitude, setLongitude] = useState(currentLocation?.longitude?.toString() || '');

    useEffect(() => {
        if (currentLocation) {
            setLatitude(currentLocation.latitude.toString());
            setLongitude(currentLocation.longitude.toString());
        }
    }, [currentLocation]);

    const handleImport = () => {
        const lat = parseFloat(latitude);
        const lng = parseFloat(longitude);

        if (isNaN(lat) || isNaN(lng)) {
            toast.error('Invalid coordinates');
            return;
        }

        onLocationUpdate({ latitude: lat, longitude: lng });
        toast.success('GPS Data Imported/Updated');
    };

    const useCurrentLocation = () => {
        if (!navigator.geolocation) {
            toast.error('Geolocation is not supported by your browser');
            return;
        }

        navigator.geolocation.getCurrentPosition(
            (position) => {
                setLatitude(position.coords.latitude.toString());
                setLongitude(position.coords.longitude.toString());
                onLocationUpdate({
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude
                });
                toast.success('Fetched current location');
            },
            () => {
                toast.error('Unable to retrieve your location');
            }
        );
    };

    return (
        <Card className="w-full mb-4 bg-card/80 backdrop-blur border-border/50 shadow-lg">
            <CardHeader className="py-3">
                <CardTitle className="text-sm font-medium">GPS Data Import</CardTitle>
            </CardHeader>
            <CardContent className="flex gap-2 items-end">
                <div className="grid gap-1 flex-1">
                    <label className="text-xs text-muted-foreground">Latitude</label>
                    <Input
                        placeholder="40.7128"
                        value={latitude}
                        onChange={(e) => setLatitude(e.target.value)}
                    />
                </div>
                <div className="grid gap-1 flex-1">
                    <label className="text-xs text-muted-foreground">Longitude</label>
                    <Input
                        placeholder="-74.0060"
                        value={longitude}
                        onChange={(e) => setLongitude(e.target.value)}
                    />
                </div>
                <Button variant="outline" onClick={handleImport}>Set</Button>
                <Button variant="secondary" onClick={useCurrentLocation}>Get Current</Button>
            </CardContent>
        </Card>
    );
};

export default GPSImporter;
