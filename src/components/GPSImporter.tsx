import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { toast } from 'sonner';
import { Crosshair } from 'lucide-react';

interface GPSImporterProps {
    onLocationUpdate: (location: { latitude: number; longitude: number }) => void;
    currentLocation?: { latitude: number; longitude: number };
}

const GPSImporter = ({ onLocationUpdate }: GPSImporterProps) => {

    const useCurrentLocation = () => {
        if (!navigator.geolocation) {
            toast.error('Geolocation is not supported by your browser');
            return;
        }

        const toastId = toast.loading("Fetching location...");

        navigator.geolocation.getCurrentPosition(
            (position) => {
                toast.dismiss(toastId);
                onLocationUpdate({
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude
                });
                toast.success('Location updated');
            },
            (error) => {
                toast.dismiss(toastId);
                console.error("Geolocation error:", error);
                toast.error('Unable to retrieve your location. Enable GPS.');
            },
            { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
        );
    };

    return (
        <Card className="w-full bg-card/60 backdrop-blur border-border/50 shadow-sm">
            <CardContent className="p-2 flex items-center justify-between">
                <span className="text-sm font-medium text-muted-foreground ml-2">Current GPS</span>
                <Button
                    variant="secondary"
                    size="sm"
                    onClick={useCurrentLocation}
                    className="flex items-center gap-2 bg-primary/10 hover:bg-primary/20 text-primary border border-primary/20"
                >
                    <Crosshair className="w-4 h-4" />
                    <span className="hidden sm:inline">Get Live Location</span>
                    <span className="sm:hidden">Locate Me</span>
                </Button>
            </CardContent>
        </Card>
    );
};

export default GPSImporter;
