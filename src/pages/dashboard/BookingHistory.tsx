import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import api from "@/lib/api";

const BookingHistory = () => {
    const [bookings, setBookings] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchBookings = async () => {
            try {
                const res = await api.get('/bookings');
                setBookings(res.data);
            } catch (err) {
                console.error("Failed to fetch bookings", err);
            } finally {
                setLoading(false);
            }
        };

        fetchBookings();
    }, []);

    if (loading) {
        return <div className="p-6 text-center">Loading history...</div>;
    }

    return (
        <div className="container mx-auto p-6">
            <h1 className="text-3xl font-bold mb-6">Booking History</h1>
            {bookings.length === 0 ? (
                <div className="text-center text-muted-foreground p-10 bg-card rounded-lg border">
                    No booking history found.
                </div>
            ) : (
                <div className="grid gap-4">
                    {bookings.map((booking) => (
                        <Card key={booking._id} className="overflow-hidden">
                            <CardHeader className="pb-3">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <CardTitle>{booking.serviceType}</CardTitle>
                                        <CardDescription>{new Date(booking.date).toLocaleDateString()} at {new Date(booking.date).toLocaleTimeString()} • {booking.mechanic ? booking.mechanic.name : 'Pending Assignment'}</CardDescription>
                                    </div>
                                    <Badge variant={booking.status === 'completed' ? 'default' : booking.status === 'cancelled' ? 'destructive' : 'secondary'}>
                                        {booking.status}
                                    </Badge>
                                </div>
                            </CardHeader>
                            <CardContent className="grid gap-4">
                                {booking.description && (
                                    <div className="bg-muted/50 p-3 rounded-md text-sm italic">
                                        "{booking.description}"
                                    </div>
                                )}

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                                    {booking.vehicle && (
                                        <div className="flex flex-col gap-1">
                                            <span className="font-semibold text-muted-foreground">Vehicle</span>
                                            <span>{booking.vehicle.year} {booking.vehicle.make} {booking.vehicle.model}</span>
                                            <span className="text-xs text-muted-foreground font-mono">{booking.vehicle.licensePlate}</span>
                                        </div>
                                    )}

                                    <div className="flex flex-col gap-1">
                                        <span className="font-semibold text-muted-foreground">Location</span>
                                        {booking.location?.coordinates ? (
                                            <a
                                                href={`https://www.google.com/maps/search/?api=1&query=${booking.location.coordinates[1]},${booking.location.coordinates[0]}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-primary hover:underline"
                                            >
                                                View on Map ↗
                                            </a>
                                        ) : (
                                            <span>Location not available</span>
                                        )}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
};

export default BookingHistory;
