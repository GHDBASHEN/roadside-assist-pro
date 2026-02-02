import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useState, useEffect, useMemo } from "react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import api from "@/lib/api";
import { toast } from "sonner";
import GPSImporter from "@/components/GPSImporter";
import Map from "@/components/Map";

const MechanicDashboard = () => {
    const navigate = useNavigate();
    const [isAvailable, setIsAvailable] = useState(false);
    const [mechanicData, setMechanicData] = useState<any>(null);
    const [requests, setRequests] = useState<any[]>([]);
    const [center, setCenter] = useState<[number, number]>([40.7128, -74.0060]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [profileRes, bookingsRes] = await Promise.all([
                    api.get('/auth'),
                    api.get('/bookings')
                ]);

                setMechanicData(profileRes.data);
                setIsAvailable(profileRes.data.isAvailable);
                setRequests(bookingsRes.data);

                // Initialize center if mechanic has location
                if (profileRes.data.location?.coordinates) {
                    setCenter([profileRes.data.location.coordinates[1], profileRes.data.location.coordinates[0]]);
                }
            } catch (err) {
                console.error(err);
                toast.error("Failed to load dashboard data");
            }
        };
        fetchData();
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate("/login");
    };

    const toggleAvailability = async () => {
        try {
            const res = await api.put('/mechanics/availability');
            const newState = res.data.isAvailable;
            setIsAvailable(newState);
            toast.success(newState ? "You are now ONLINE" : "You are now OFFLINE");
        } catch (err) {
            console.error(err);
            toast.error("Failed to update availability");
        }
    };

    const handleLocationUpdate = async (location: { latitude: number; longitude: number }) => {
        try {
            await api.put('/mechanics/location', location);
            setCenter([location.latitude, location.longitude]);
        } catch (err) {
            console.error(err);
            toast.error("Failed to update location on server");
        }
    };

    const acceptRequest = async (bookingId: string) => {
        try {
            const res = await api.put(`/bookings/${bookingId}/accept`);
            toast.success("Booking accepted!");
            // Update local state
            setRequests(requests.map(req =>
                req._id === bookingId ? { ...req, status: 'accepted', mechanic: res.data.mechanic } : req
            ));
        } catch (err) {
            console.error(err);
            toast.error("Failed to accept booking");
        }
    }

    const completeRequest = async (bookingId: string) => {
        try {
            await api.put(`/bookings/${bookingId}/status`, { status: 'completed' });
            toast.success("Job completed!");
            setRequests(requests.map(req =>
                req._id === bookingId ? { ...req, status: 'completed' } : req
            ));
        } catch (err) {
            console.error(err);
            toast.error("Failed to complete booking");
        }
    }

    // Prepare markers for the map
    const mapMarkers = useMemo(() => {
        const markers: any[] = [];

        // Add active request user locations
        requests.forEach(req => {
            if ((req.status === 'accepted' || req.status === 'pending') && req.user && req.user.location) {
                markers.push({
                    id: req.user._id,
                    lat: req.user.location.coordinates[1],
                    lng: req.user.location.coordinates[0],
                    title: `User: ${req.user.name} (${req.serviceType})`,
                    type: 'user'
                });
            }
        });

        return markers;
    }, [requests]);


    return (
        <div className="min-h-screen bg-gray-100 p-8">
            <div className="mb-6">
                <GPSImporter
                    onLocationUpdate={handleLocationUpdate}
                    currentLocation={{ latitude: center[0], longitude: center[1] }}
                />
            </div>

            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 bg-white p-4 rounded-lg shadow gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Mechanic Dashboard</h1>
                    <p className="text-gray-500">Welcome back, {mechanicData?.name}</p>
                </div>
                <div className="flex items-center gap-4">
                    <div className="flex items-center space-x-2 bg-gray-50 px-4 py-2 rounded-full border">
                        <Switch id="availability" checked={isAvailable} onCheckedChange={toggleAvailability} />
                        <Label htmlFor="availability" className={`font-medium ${isAvailable ? "text-green-600" : "text-gray-500"}`}>
                            {isAvailable ? "Online & Available" : "Offline"}
                        </Label>
                    </div>
                    <Button onClick={handleLogout} variant="outline">Logout</Button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="md:col-span-2">
                    <CardHeader>
                        <CardTitle>Active Service Requests</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {requests.length === 0 ? (
                            <div className="flex flex-col items-center justify-center h-64 text-gray-400 border-2 border-dashed rounded-lg">
                                <p>No active requests. Stay online to receive jobs.</p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {requests.map(req => (
                                    <div key={req._id} className="p-4 border rounded-lg bg-white shadow-sm flex justify-between items-center">
                                        <div>
                                            <div className="flex items-center gap-2">
                                                <h3 className="font-semibold text-lg">{req.serviceType}</h3>
                                                <Badge>{req.status}</Badge>
                                            </div>
                                            <p className="text-sm text-gray-500">User: {req.user?.name || 'Unknown'}</p>
                                            <p className="text-xs text-gray-400">Date: {new Date(req.date).toLocaleString()}</p>
                                        </div>
                                        <div className="flex gap-2">
                                            {req.status === 'pending' && (
                                                <Button size="sm" onClick={() => acceptRequest(req._id)}>Accept</Button>
                                            )}
                                            {req.status === 'accepted' && (
                                                <Button size="sm" variant="secondary" onClick={() => completeRequest(req._id)}>Complete</Button>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>

                <div className="md:col-span-1 space-y-6">
                    {/* Map for Tracking */}
                    <Card className="h-96 overflow-hidden flex flex-col">
                        <CardHeader className="py-3">
                            <CardTitle className="text-sm uppercase text-gray-500">Live Tracking</CardTitle>
                        </CardHeader>
                        <div className="flex-1 relative">
                            <Map center={center} markers={mapMarkers} />
                        </div>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>My Profile</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <Label className="text-xs text-gray-500 uppercase">Specialties</Label>
                                <div className="flex flex-wrap gap-2 mt-1">
                                    {mechanicData?.specialties?.map((s: string, i: number) => (
                                        <Badge key={i} variant="secondary">{s}</Badge>
                                    ))}
                                    {!mechanicData?.specialties?.length && <span className="text-sm text-gray-500">None listed</span>}
                                </div>
                            </div>
                            <div>
                                <Label className="text-xs text-gray-500 uppercase">Certifications</Label>
                                <div className="flex flex-wrap gap-2 mt-1">
                                    {mechanicData?.certifications?.map((c: string, i: number) => (
                                        <Badge key={i} variant="outline" className="border-blue-200 text-blue-700 bg-blue-50">{c}</Badge>
                                    ))}
                                    {!mechanicData?.certifications?.length && <span className="text-sm text-gray-500">None listed</span>}
                                </div>
                            </div>
                            <Button variant="outline" className="w-full text-xs">Edit Profile</Button>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default MechanicDashboard;
