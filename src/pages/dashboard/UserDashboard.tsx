import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import Map from "@/components/Map";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { useState, useEffect, useMemo } from "react";
import { toast } from "sonner";
import Chat from "@/components/Chat";
import GPSImporter from "@/components/GPSImporter";
import api from "@/lib/api";
import { Badge } from "@/components/ui/badge";
import { getDistance } from 'geolib';
import ErrorBoundary from "@/components/ErrorBoundary";
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Menu } from "lucide-react";

const UserDashboard = () => {
    const navigate = useNavigate();
    const [userData, setUserData] = useState<any>(null);
    const [serviceType, setServiceType] = useState("");
    const [center, setCenter] = useState<[number, number]>([40.7128, -74.0060]);
    const [availableMechanics, setAvailableMechanics] = useState<any[]>([]);
    const [selectedMechanic, setSelectedMechanic] = useState<string | null>(null);
    const [bookings, setBookings] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isEditingLocation, setIsEditingLocation] = useState(false); // Map lock state
    const [showChat, setShowChat] = useState(false);

    useEffect(() => {
        const fetchInitialData = async () => {
            try {
                // Fetch User Profile for Location
                const userRes = await api.get('/auth');
                setUserData(userRes.data);
                if (userRes.data?.location?.coordinates) {
                    setCenter([userRes.data.location.coordinates[1], userRes.data.location.coordinates[0]]);
                }

                // Fetch Bookings
                fetchBookings();
            } catch (err) {
                console.error("Failed to fetch initial data", err);
            }
        };

        fetchInitialData();
    }, []);

    useEffect(() => {
        if (center) {
            fetchMechanics();
        }
    }, [center]);

    const fetchMechanics = async () => {
        try {
            const res = await api.get('/mechanics', {
                params: {
                    lat: center[0],
                    lng: center[1],
                    dist: 50 // 50km radius
                }
            });
            setAvailableMechanics(res.data);
        } catch (err) {
            console.error("Failed to fetch mechanics", err);
        }
    };

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
                description: `Need help with ${serviceType}`,
                mechanicId: selectedMechanic // Optional: target specific mechanic
            });
            toast.success(selectedMechanic ? "Request sent to mechanic!" : `Request for ${serviceType} sent!`);
            setSelectedMechanic(null);
            fetchBookings();
            setIsMobileMenuOpen(false); // Close menu on mobile after request
        } catch (err: any) {
            console.error(err);
            if (err.response && err.response.status === 429) {
                alert(err.response.data.msg);
            } else {
                toast.error("Failed to submit request");
            }
        } finally {
            setLoading(false);
        }
    };

    const handleLocationUpdate = async (location: { latitude: number; longitude: number }) => {
        setCenter([location.latitude, location.longitude]);

        // Push location to server for tracking
        try {
            await api.put('/users/location', {
                latitude: location.latitude,
                longitude: location.longitude
            });
        } catch (err) {
            console.error("Failed to update location on server", err);
        }
    };

    // Poll for booking updates every 5 seconds
    useEffect(() => {
        const interval = setInterval(() => {
            fetchBookings();
        }, 5000);
        return () => clearInterval(interval);
    }, []);

    // Combine booking markers (tracking) and available mechanics markers (discovery)
    const mapMarkers = useMemo(() => {
        const bookingMarkers = Array.isArray(bookings) ? bookings
            .filter(b => b.mechanic && b.mechanic.location && (b.status === 'accepted' || b.status === 'pending'))
            .map(b => ({
                id: b._id,
                lat: b.mechanic.location.coordinates[1],
                lng: b.mechanic.location.coordinates[0],
                title: `Mechanic: ${b.mechanic.name} (${b.status})`,
                type: 'booking'
            })) : [];

        const mechanicMarkers = availableMechanics.map(m => ({
            id: m._id,
            lat: m.location.coordinates[1],
            lng: m.location.coordinates[0],
            title: `Available: ${m.name}`,
            type: 'available'
        }));

        return [...bookingMarkers, ...mechanicMarkers];
    }, [bookings, availableMechanics]);

    const selectedMechanicData = useMemo(() =>
        availableMechanics.find(m => m._id === selectedMechanic),
        [availableMechanics, selectedMechanic]
    );

    // Reusable Sidebar Content
    const SidebarContent = () => (
        <div className="flex flex-col gap-4 h-full">
            <div className="bg-card/80 backdrop-blur border-border/50 shadow-lg p-3 rounded-lg flex flex-col gap-2">
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
                        Drag the map marker or click on the map to set your location.
                    </p>
                )}
            </div>

            <GPSImporter
                onLocationUpdate={handleLocationUpdate}
                currentLocation={{ latitude: center[0], longitude: center[1] }}
            />

            {/* Nearby Mechanics List */}
            <Card className="bg-card/80 backdrop-blur border-border/50 shadow-lg flex-shrink-0">
                <CardHeader className="pb-2">
                    <CardTitle className="text-lg text-foreground flex justify-between items-center">
                        Nearby Mechanics
                        <Badge variant="secondary" className="text-xs">{availableMechanics.length} found</Badge>
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 max-h-48 overflow-y-auto px-2 custom-scrollbar">
                    {availableMechanics.length === 0 ? (
                        <p className="text-sm text-muted-foreground text-center py-4">No mechanics found nearby.</p>
                    ) : (
                        availableMechanics
                            .map(m => ({
                                ...m,
                                distance: getDistance(
                                    { latitude: center[0], longitude: center[1] },
                                    { latitude: m.location.coordinates[1], longitude: m.location.coordinates[0] }
                                )
                            }))
                            .sort((a: any, b: any) => a.distance - b.distance)
                            .map((mech: any) => (
                                <div
                                    key={mech._id}
                                    onClick={() => {
                                        setSelectedMechanic(mech._id);
                                        toast.success(`Selected ${mech.name}`);
                                    }}
                                    className={`p-3 rounded-lg border cursor-pointer transition-all hover:bg-primary/5 ${selectedMechanic === mech._id ? 'border-primary bg-primary/10 shadow-[0_0_10px_rgba(var(--primary),0.3)]' : 'border-border/40 bg-card/50'}`}
                                >
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h4 className="font-semibold text-sm text-foreground">{mech.name}</h4>
                                            <p className="text-xs text-muted-foreground">{mech.specialties?.join(', ') || 'General'}</p>
                                        </div>
                                        <Badge variant="outline" className="text-[10px] whitespace-nowrap bg-background/50">
                                            {(mech.distance / 1000).toFixed(1)} km
                                        </Badge>
                                    </div>
                                </div>
                            ))
                    )}
                </CardContent>
            </Card>

            <Card className="bg-card/80 backdrop-blur border-border/50 shadow-lg flex-shrink-0">
                <CardHeader>
                    <CardTitle className="text-foreground">Request Assistance</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    {selectedMechanicData && (
                        <div className="bg-secondary/50 p-4 rounded-xl border border-primary/20 mb-4 space-y-3">
                            <div className="flex justify-between items-start">
                                <div>
                                    <h4 className="font-bold text-foreground">{selectedMechanicData.name}</h4>
                                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                        <span className="text-yellow-500">★ 4.8</span>
                                        <span>•</span>
                                        <span>{selectedMechanicData.specialties?.join(', ') || 'General Mechanic'}</span>
                                    </div>
                                </div>
                                <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => setSelectedMechanic(null)}>
                                    <span className="sr-only">Close</span>
                                    <span className="text-lg">×</span>
                                </Button>
                            </div>

                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <span>📞 {selectedMechanicData.phone || 'No phone number'}</span>
                            </div>

                            <div className="flex gap-2 pt-1">
                                <Button
                                    size="sm"
                                    className="flex-1 bg-green-600 hover:bg-green-700 text-white border-none"
                                    onClick={() => {
                                        if (selectedMechanicData.phone) {
                                            window.location.href = `tel:${selectedMechanicData.phone}`;
                                        } else {
                                            toast.error("No phone number available");
                                        }
                                    }}
                                >
                                    Call
                                </Button>
                                <Button
                                    size="sm"
                                    variant="outline"
                                    className="flex-1"
                                    onClick={() => setShowChat(true)}
                                >
                                    Chat
                                </Button>
                            </div>
                        </div>
                    )}

                    <div className="space-y-2">
                        <Label className="text-muted-foreground">Service Type</Label>
                        <Select onValueChange={setServiceType}>
                            <SelectTrigger className="bg-background/50 border-input">
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
                        <Button className="w-full bg-gradient-primary hover:opacity-90 transition-opacity text-primary-foreground font-semibold shadow-glow" size="lg" onClick={handleRequest} disabled={loading}>
                            {loading ? 'Requesting...' : (selectedMechanic ? 'Request This Mechanic' : 'Request Help Now')}
                        </Button>
                    </div>
                </CardContent>
            </Card>

            <div className="mt-auto flex-1 overflow-y-auto">
                <h3 className="font-semibold mb-3 text-foreground flex items-center gap-2">
                    <span className="w-1 h-4 bg-primary rounded-full"></span>
                    Booking History
                </h3>
                {bookings.length === 0 ? (
                    <div className="text-sm text-muted-foreground bg-card/50 p-4 rounded-lg border border-border/50 text-center">
                        No active bookings.
                    </div>
                ) : (
                    <div className="space-y-3">
                        {bookings.map(b => (
                            <div key={b._id} className="bg-card/90 p-4 rounded-xl border border-border/50 shadow-sm hover:border-primary/30 transition-colors">
                                <div className="flex justify-between font-semibold mb-1">
                                    <span className="text-foreground">{b.serviceType}</span>
                                    <Badge variant={b.status === 'completed' ? 'secondary' : 'default'} className="text-xs uppercase tracking-wider">{b.status}</Badge>
                                </div>
                                <div className="text-muted-foreground text-xs flex flex-col gap-1">
                                    <span>{new Date(b.date).toLocaleDateString()}</span>
                                    {b.mechanic && <span className="text-primary/90 font-medium"> • Mechanic: {b.mechanic.name}</span>}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );

    return (
        <div className="flex h-screen flex-col bg-background text-foreground">
            <header className="flex justify-between items-center p-4 border-b border-border bg-card/80 backdrop-blur-sm z-10 sticky top-0">
                <div className="flex items-center gap-2">
                    <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
                        <SheetTrigger asChild>
                            <Button variant="ghost" size="icon" className="md:hidden">
                                <Menu className="h-6 w-6" />
                            </Button>
                        </SheetTrigger>
                        <SheetContent side="left" className="w-[85%] sm:w-[350px] overflow-y-auto pt-10">
                            <SheetHeader>
                                <SheetTitle className="text-left text-lg font-bold bg-gradient-to-r from-primary to-orange-400 bg-clip-text text-transparent">AutoMIG</SheetTitle>
                                <div className="text-sm font-medium text-muted-foreground text-left mt-1">
                                    Welcome, <span className="text-foreground">{userData?.name || 'User'}</span>
                                </div>
                            </SheetHeader>
                            <div className="mt-4 pb-10">
                                <SidebarContent />
                            </div>
                        </SheetContent>
                    </Sheet>

                    <div className="flex items-center gap-2">
                        <img src="/AutoMIG.png" alt="AutoMIG Logo" className="h-12 w-auto" />
                        <h1 className="text-xl md:text-2xl font-bold bg-gradient-to-r from-primary to-orange-400 bg-clip-text text-transparent">AutoMIG</h1>
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    <span className="text-sm text-muted-foreground hidden sm:inline-block">Welcome, {userData?.name || 'User'}</span>
                    <Button onClick={handleLogout} variant="outline" size="sm" className="border-primary/20 hover:bg-primary/10 hover:text-primary">Logout</Button>
                </div>
            </header>

            <div className="flex flex-1 overflow-hidden relative">
                {/* Background Effects */}
                <div className="absolute inset-0 pointer-events-none z-0">
                    <div className="absolute inset-0 bg-gradient-hero opacity-50" />
                    <div className="absolute top-0 left-0 w-full h-[500px] bg-primary/5 blur-[100px] opacity-20" />
                </div>

                {/* Sidebar Controls (Desktop) */}
                <aside className="hidden md:flex w-96 p-4 bg-card/50 backdrop-blur-sm border-r border-border/50 overflow-y-auto z-10 flex-col gap-4 shadow-xl">
                    <SidebarContent />
                </aside>

                {/* Map Area */}
                <main className="flex-1 relative flex flex-col z-0">
                    <div className="flex-1 relative shadow-inner">
                        <ErrorBoundary>
                            <Map
                                center={center}
                                markers={mapMarkers}
                                onLocationSelect={(lat, lng) => handleLocationUpdate({ latitude: lat, longitude: lng })}
                                enableLocationSelection={isEditingLocation}
                                onMarkerClick={(id) => {
                                    // Check if it's an available mechanic
                                    const mechanic = availableMechanics.find(m => m._id === id);
                                    if (mechanic) {
                                        setSelectedMechanic(mechanic._id);
                                        toast.info(`Selected mechanic: ${mechanic.name}`);
                                        // On mobile, maybe open the sheet?
                                        if (window.innerWidth < 768) {
                                            setIsMobileMenuOpen(true);
                                        }
                                    }
                                }}
                            />
                        </ErrorBoundary>
                    </div>
                </main>
            </div>
            {/* Chat overlay */}
            {showChat && selectedMechanic && userData?._id && (
                <Chat
                    userId={userData._id}
                    receiverId={selectedMechanic}
                    onClose={() => setShowChat(false)}
                />
            )}
        </div>
    );
};

export default UserDashboard;
