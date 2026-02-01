import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const BookingHistory = () => {
    // Mock data for history
    const bookings = [
        {
            id: 1,
            date: '2023-10-25',
            service: 'Flat Tire',
            mechanic: 'John Smith',
            status: 'Completed',
            cost: '$50.00',
            notes: 'Replaced front left tire.'
        },
        {
            id: 2,
            date: '2023-11-12',
            service: 'Battery Jump',
            mechanic: 'Auto Fixer Inc.',
            status: 'Completed',
            cost: '$35.00',
            notes: 'Battery health plausible.'
        },
        {
            id: 3,
            date: '2024-01-05',
            service: 'Diagnostic',
            mechanic: 'Speedy Repairs',
            status: 'Pending',
            cost: 'TBD',
            notes: 'Engine light tracking.'
        }
    ];

    return (
        <div className="container mx-auto p-6">
            <h1 className="text-3xl font-bold mb-6">Booking History</h1>
            <div className="grid gap-4">
                {bookings.map((booking) => (
                    <Card key={booking.id}>
                        <CardHeader>
                            <div className="flex justify-between items-start">
                                <div>
                                    <CardTitle>{booking.service}</CardTitle>
                                    <CardDescription>{booking.date} • {booking.mechanic}</CardDescription>
                                </div>
                                <Badge variant={booking.status === 'Completed' ? 'default' : 'secondary'}>
                                    {booking.status}
                                </Badge>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-2 gap-4 text-sm">
                                <div>
                                    <span className="font-semibold">Cost:</span> {booking.cost}
                                </div>
                                <div>
                                    <span className="font-semibold">Notes:</span> {booking.notes}
                                </div>
                            </div>
                        </CardContent>
                        <CardFooter>
                            <Button variant="outline" size="sm">View Receipt</Button>
                        </CardFooter>
                    </Card>
                ))}
            </div>
        </div>
    );
};

export default BookingHistory;
