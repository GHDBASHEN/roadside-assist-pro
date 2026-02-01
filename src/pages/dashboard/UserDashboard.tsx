import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import Map from "@/components/Map";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import Chat from "@/components/Chat";
import GPSImporter from "@/components/GPSImporter";
import api from "@/lib/api";
import { Badge } from "@/components/ui/badge";
import ErrorBoundary from "@/components/ErrorBoundary";

const UserDashboard = () => {
    const navigate = useNavigate();
    const [serviceType, setServiceType] = useState("");
    const [center, setCenter] = useState<[number, number]>([40.7128, -74.0060]);
    const [bookings, setBookings] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchBookings();
    }, []);

    const fetchBookings = async () => {
        try {
            const res = await api.get('/bookings');
            setBookings(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate("/login");
    };

    const handleRequest = async () => {
        if (!serviceType) {
            toast.error("Please select a service type");
            return;
        }

        setLoading(true);
        try {
            // Pass current center as location. In real app, this should be device GPS
            await api.post('/bookings', {
                serviceType,
                location: { latitude: center[0], longitude: center[1] },
                description: `Need help with ${serviceType}`
            });
            toast.success(`Request for ${serviceType} sent!`);
            fetchBookings();
        } catch (err) {
            console.error(err);
            toast.error("Failed to submit request");
        } finally {
            setLoading(false);
        }
    };

    const handleLocationUpdate = (location: { latitude: number; longitude: number }) => {
        setCenter([location.latitude, location.longitude]);
        // Ideally we would also update user profile location here via API if we want "User Tracking"
    };

    return (
        <div className="flex h-screen flex-col">
            <header className="flex justify-between items-center p-4 border-b bg-white shadow-sm z-10">
                <h1 className="text-2xl font-bold text-blue-600">Roadside Assist</h1>
                <div className="flex items-center gap-4">
                    <span className="text-sm text-gray-600">Welcome, User</span>
                    <Button onClick={handleLogout} variant="outline" size="sm">Logout</Button>
                </div>
            </header>

            <div className="flex flex-1 overflow-hidden">
                {/* Sidebar Controls */}
                <aside className="w-96 p-4 bg-gray-50 border-r overflow-y-auto z-10 flex flex-col gap-4">
                    <GPSImporter onLocationUpdate={handleLocationUpdate} />

                    <Card>
                        <CardHeader>
                            <CardTitle>Request Assistance</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label>Service Type</Label>
                                <Select onValueChange={setServiceType}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select issue" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Emergency">Emergency Roadside</SelectItem>
                                        <SelectItem value="Full Service">Full Service</SelectItem>
                                        <SelectItem value="Tires">Flat Tire</SelectItem>
                                        <SelectItem value="Battery">Dead Battery</SelectItem>
                                        <SelectItem value="Fuel">Out of Fuel</SelectItem>
                                        <SelectItem value="Lockout">Car Lockout</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="pt-2">
                                <Button className="w-full" size="lg" onClick={handleRequest} disabled={loading}>
                                    {loading ? 'Requesting...' : 'Request Help Now'}
                                </Button>
                            </div>
                        </CardContent>
                    </Card>

                    <div className="mt-2">
                        <h3 className="font-semibold mb-2">Booking History</h3>
                        {bookings.length === 0 ? (
                            <div className="text-sm text-gray-500">No active bookings.</div>
                        ) : (
                            <div className="space-y-2">
                                {bookings.map(b => (
                                    <div key={b._id} className="bg-white p-3 rounded border text-sm">
                                        <div className="flex justify-between font-semibold">
                                            <span>{b.serviceType}</span>
                                            <Badge variant={b.status === 'completed' ? 'secondary' : 'default'} className="text-xs">{b.status}</Badge>
                                        </div>
                                        <div className="text-gray-500 text-xs mt-1">
                                            {new Date(b.date).toLocaleDateString()}
                                            {b.mechanic && <span> • Mechanic: {b.mechanic.name}</span>}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </aside>

                {/* Map Area */}
                <main className="flex-1 relative flex flex-col">
                    <div className="flex-1 relative">
                        <ErrorBoundary>
                            <Map
                                center={center}
                                markers={Array.isArray(bookings) ? bookings
                                    .filter(b => b.mechanic && b.mechanic.location && (b.status === 'accepted' || b.status === 'pending'))
                                    .map(b => ({
                                        id: b.mechanic._id,
                                        lat: b.mechanic.location.coordinates[1],
                                        lng: b.mechanic.location.coordinates[0],
                                        title: `Mechanic: ${b.mechanic.name}`
                                    })) : []
                                }
                            />
                        </ErrorBoundary>
                    </div>
                </main>
            </div>
            {/* Chat overlay or component could go here */}
            {/* <Chat userId="user123" receiverId="mechanic123" /> */}
        </div>
    );
};

export default UserDashboard;
