import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Star } from "lucide-react";
import { Progress } from "@/components/ui/progress";

const Reviews = ({ reviews }: { reviews: { id: number, user: string, rating: number, comment: string }[] }) => {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Ratings & Reviews</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {reviews.map((review) => (
                        <div key={review.id} className="border-b pb-4 last:border-0">
                            <div className="flex justify-between items-center mb-1">
                                <span className="font-semibold">{review.user}</span>
                                <div className="flex items-center text-yellow-500">
                                    <span className="mr-1 text-sm font-bold">{review.rating}</span>
                                    <Star className="fill-current w-4 h-4" />
                                </div>
                            </div>
                            <p className="text-sm text-gray-600">"{review.comment}"</p>
                        </div>
                    ))}
                    {reviews.length === 0 && <p className="text-gray-500">No reviews yet.</p>}
                </div>
            </CardContent>
        </Card>
    );
};

export default Reviews;
