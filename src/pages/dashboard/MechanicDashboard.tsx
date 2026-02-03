import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useState, useEffect, useMemo } from "react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import api from "@/lib/api";
import { toast } from "sonner";
import GPSImporter from "@/components/GPSImporter";
import Map from "@/components/Map";
import EditProfileModal from "@/components/EditProfileModal";
import Chat from "@/components/Chat";

const MechanicDashboard = () => {
    const navigate = useNavigate();
    const [isAvailable, setIsAvailable] = useState(false);
    const [mechanicData, setMechanicData] = useState<any>(null);
    const [requests, setRequests] = useState<any[]>([]);
    const [center, setCenter] = useState<[number, number]>([40.7128, -74.0060]);
    const [isEditingLocation, setIsEditingLocation] = useState(false);
    const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
    const [showChat, setShowChat] = useState(false);
    const [chatReceiverId, setChatReceiverId] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [profileRes, bookingsRes] = await Promise.all([
                    api.get('/auth'),
                    api.get('/bookings')
                ]);

                setMechanicData(profileRes.data);
                // Ensure boolean
                setIsAvailable(!!profileRes.data.isAvailable);
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

        // Add mechanic's own location as a marker? 
        // Typically the map center pin is enough, but a marker helps.
        markers.push({
            id: 'me',
            lat: center[0],
            lng: center[1],
            title: 'My Location',
            type: 'me'
        });

        return markers;
    }, [requests, center]);


    return (
        <div className="min-h-screen bg-background text-foreground relative overflow-hidden">
            {/* Background Effects */}
            <div className="absolute inset-0 pointer-events-none z-0">
                <div className="absolute inset-0 bg-gradient-hero opacity-80" />
                <div className="absolute top-0 right-0 w-full h-[500px] bg-primary/5 blur-[100px] opacity-20" />
                <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-500/5 blur-[120px] opacity-20" />
            </div>

            <EditProfileModal
                isOpen={isProfileModalOpen}
                onClose={() => setIsProfileModalOpen(false)}
                user={mechanicData}
                onProfileUpdate={() => {
                    api.get('/auth').then(res => setMechanicData(res.data));
                }}
            />

            <div className="relative z-10 p-6 md:p-8 max-w-7xl mx-auto flex flex-col gap-6">

                {/* Header Section */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-card/60 backdrop-blur-md p-6 rounded-2xl border border-border/50 shadow-lg">
                    <div>
                        <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-orange-400 bg-clip-text text-transparent">AutoMIG Mechanic</h1>
                        <p className="text-muted-foreground mt-1">
                            Welcome back, <span className="text-foreground font-medium">{mechanicData?.name}</span>
                        </p>
                    </div>
                    <div className="flex items-center gap-4">

                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setIsProfileModalOpen(true)}
                            className="mr-2 hidden sm:flex"
                        >
                            Edit Profile
                        </Button>

                        <div className={`flex items-center space-x-3 px-5 py-2.5 rounded-full border transition-all duration-300 ${isAvailable ? "bg-green-500/10 border-green-500/30 shadow-[0_0_15px_rgba(34,197,94,0.2)]" : "bg-card border-border shadow-sm"}`}>
                            <Switch
                                id="availability"
                                checked={isAvailable}
                                onCheckedChange={toggleAvailability}
                                className="data-[state=checked]:bg-green-500"
                            />
                            <Label htmlFor="availability" className={`font-semibold cursor-pointer ${isAvailable ? "text-green-500" : "text-muted-foreground"}`}>
                                {isAvailable ? "ONLINE" : "OFFLINE"}
                            </Label>
                        </div>
                        <Button onClick={handleLogout} variant="outline" className="border-border/50 hover:bg-destructive/10 hover:text-destructive hover:border-destructive/30 transition-colors">
                            Logout
                        </Button>
                    </div>
                </div>

                {/* Main Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                    {/* Left Column: Active Requests */}
                    <Card className="lg:col-span-2 bg-card/60 backdrop-blur-md border-border/50 shadow-lg flex flex-col max-h-[800px]">
                        <CardHeader>
                            <CardTitle className="flex justify-between items-center text-xl">
                                Active Service Requests
                                <Badge variant="outline" className="text-xs bg-background/50">{requests.filter(r => r.status !== 'completed' && r.status !== 'cancelled').length} Active</Badge>
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="overflow-y-auto pr-2 custom-scrollbar flex-1">
                            {requests.length === 0 ? (
                                <div className="flex flex-col items-center justify-center h-64 text-muted-foreground border-2 border-dashed border-border/30 rounded-xl bg-background/20">
                                    <p>No active requests.</p>
                                    <p className="text-sm opacity-70">Stay online to receive jobs.</p>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {requests.filter(r => r.status !== 'completed' && r.status !== 'cancelled').length === 0 && (
                                        <div className="text-center py-10 text-muted-foreground">No pending or active jobs.</div>
                                    )}

                                    {requests.map(req => (
                                        <div key={req._id} className={`p-5 border rounded-xl transition-all duration-300 ${req.status === 'pending'
                                            ? 'bg-yellow-500/5 border-yellow-500/20 hover:border-yellow-500/40'
                                            : req.status === 'accepted'
                                                ? 'bg-primary/5 border-primary/20 hover:border-primary/40 shadow-[0_0_10px_rgba(var(--primary),0.1)]'
                                                : 'bg-card/40 border-border/40 opacity-70'
                                            }`}>
                                            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                                                <div>
                                                    <div className="flex items-center gap-3 mb-1">
                                                        <h3 className="font-bold text-lg text-foreground">{req.serviceType}</h3>
                                                        <Badge className={`${req.status === 'pending' ? 'bg-yellow-500 hover:bg-yellow-600 text-white' :
                                                            req.status === 'accepted' ? 'bg-green-600 hover:bg-green-700' :
                                                                'bg-secondary'
                                                            }`}>
                                                            {req.status.toUpperCase()}
                                                        </Badge>
                                                    </div>
                                                    <div className="space-y-1">
                                                        <p className="text-sm text-muted-foreground flex items-center gap-2">
                                                            <span className="w-4 h-4 inline-block opacity-70">👤</span>
                                                            {req.user?.name || 'Unknown User'}
                                                        </p>
                                                        {req.user?.phone && (
                                                            <p className="text-sm text-primary flex items-center gap-2">
                                                                <span className="w-4 h-4 inline-block opacity-70">📞</span>
                                                                <a href={`tel:${req.user.phone}`} className="hover:underline">{req.user.phone}</a>
                                                            </p>
                                                        )}
                                                        <p className="text-xs text-muted-foreground/70">
                                                            {new Date(req.date).toLocaleString()}
                                                        </p>
                                                    </div>
                                                </div>

                                                <div className="flex items-center gap-2 w-full sm:w-auto">
                                                    {req.status === 'pending' && (
                                                        <Button className="w-full sm:w-auto font-semibold shadow-lg shadow-green-900/20" onClick={() => acceptRequest(req._id)}>
                                                            Accept Job
                                                        </Button>
                                                    )}
                                                    {req.status === 'accepted' && (
                                                        <div className="flex gap-2 w-full sm:w-auto">
                                                            <Button
                                                                variant="outline"
                                                                size="sm"
                                                                className="flex-1 sm:flex-none border-primary/30 text-primary hover:bg-primary/10"
                                                                onClick={() => {
                                                                    setChatReceiverId(req.user._id);
                                                                    setShowChat(true);
                                                                }}
                                                            >
                                                                Chat
                                                            </Button>
                                                            <Button variant="secondary" size="sm" className="flex-1 sm:flex-none bg-green-600/20 text-green-500 hover:bg-green-600/30 border border-green-600/20" onClick={() => completeRequest(req._id)}>
                                                                Mark Complete
                                                            </Button>
                                                        </div>
                                                    )}
                                                    {req.status === 'completed' && (
                                                        <Badge variant="outline" className="border-green-500/50 text-green-500">Completed</Badge>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Right Column: Map & Tools */}
                    <div className="md:col-span-1 space-y-6 flex flex-col">


                        {/* GPS Tool */}
                        <div className="bg-card/60 backdrop-blur-md p-4 rounded-xl border border-border/50 shadow-lg space-y-4">
                            <div className="flex justify-between items-center">
                                <h3 className="text-sm font-medium">My Location</h3>
                                <Button
                                    variant={isEditingLocation ? "default" : "outline"}
                                    size="sm"
                                    onClick={() => setIsEditingLocation(!isEditingLocation)}
                                    className={isEditingLocation ? "bg-green-600 hover:bg-green-700" : ""}
                                >
                                    {isEditingLocation ? "Save Position" : "Adjust Location"}
                                </Button>
                            </div>
                            {isEditingLocation && (
                                <p className="text-xs text-muted-foreground animate-in fade-in">
                                    Drag the pin or click on the map to set your live location.
                                </p>
                            )}
                            <GPSImporter
                                onLocationUpdate={(loc) => {
                                    handleLocationUpdate(loc);
                                    // setCenter updated in wrapper
                                }}
                                currentLocation={{ latitude: center[0], longitude: center[1] }}
                            />
                        </div>

                        {/* Map */}
                        <Card className="flex-1 min-h-[400px] overflow-hidden flex flex-col bg-card/60 backdrop-blur-md border border-border/50 shadow-lg">
                            <CardHeader className="py-3 border-b border-border/30 bg-background/20">
                                <CardTitle className="text-sm uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                                    <span>📍</span> Live Tracking
                                </CardTitle>
                            </CardHeader>
                            <div className="flex-1 relative z-0">
                                <Map
                                    center={center}
                                    markers={mapMarkers}
                                    enableLocationSelection={isEditingLocation}
                                    onLocationSelect={(lat, lng) => {
                                        handleLocationUpdate({ latitude: lat, longitude: lng });
                                        toast.info("Location updated manually");
                                    }}
                                />
                            </div>
                        </Card>

                        {/* Profile Summary */}
                        <Card className="bg-card/60 backdrop-blur-md border border-border/50 shadow-lg">
                            <CardHeader>
                                <CardTitle className="text-lg">My Profile</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div>
                                    <Label className="text-xs text-muted-foreground uppercase tracking-wider">Specialties</Label>
                                    <div className="flex flex-wrap gap-2 mt-2">
                                        {mechanicData?.specialties?.map((s: string, i: number) => (
                                            <Badge key={i} variant="secondary" className="bg-secondary text-secondary-foreground border-border/50">{s}</Badge>
                                        ))}
                                        {!mechanicData?.specialties?.length && <span className="text-sm text-muted-foreground italic">None listed</span>}
                                    </div>
                                </div>
                                <div>
                                    <Label className="text-xs text-muted-foreground uppercase tracking-wider">Certifications</Label>
                                    <div className="flex flex-wrap gap-2 mt-2">
                                        {mechanicData?.certifications?.map((c: string, i: number) => (
                                            <Badge key={i} variant="outline" className="border-blue-500/30 text-blue-400 bg-blue-500/5">{c}</Badge>
                                        ))}
                                        {!mechanicData?.certifications?.length && <span className="text-sm text-muted-foreground italic">None listed</span>}
                                    </div>
                                </div>
                                <Button
                                    variant="ghost"
                                    className="w-full text-xs text-muted-foreground hover:text-foreground"
                                    onClick={() => setIsProfileModalOpen(true)}
                                >
                                    Edit Profile Settings
                                </Button>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>

            {/* Chat Overlay */}
            {showChat && chatReceiverId && mechanicData?._id && (
                <Chat
                    userId={mechanicData._id}
                    receiverId={chatReceiverId}
                    onClose={() => setShowChat(false)}
                />
            )}
        </div>
    );
};

export default MechanicDashboard;
