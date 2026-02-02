import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";
import api from "@/lib/api";
import { toast } from "sonner";

interface EditProfileModalProps {
    isOpen: boolean;
    onClose: () => void;
    onProfileUpdate: () => void;
    user: any;
}

const EditProfileModal = ({ isOpen, onClose, onProfileUpdate, user }: EditProfileModalProps) => {
    const [name, setName] = useState("");
    const [phone, setPhone] = useState("");
    const [specialties, setSpecialties] = useState<string[]>([]);
    const [certifications, setCertifications] = useState<string[]>([]);
    const [newSpecialty, setNewSpecialty] = useState("");
    const [newCertification, setNewCertification] = useState("");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (user) {
            setName(user.name || "");
            setPhone(user.phone || "");
            setSpecialties(user.specialties || []);
            setCertifications(user.certifications || []);
        }
    }, [user]);

    const handleSave = async () => {
        setLoading(true);
        try {
            await api.put('/users/profile', {
                name,
                phone,
                specialties: user.role === 'mechanic' ? specialties : undefined,
                certifications: user.role === 'mechanic' ? certifications : undefined
            });
            toast.success("Profile updated successfully");
            onProfileUpdate();
            onClose();
        } catch (err) {
            console.error(err);
            toast.error("Failed to update profile");
        } finally {
            setLoading(false);
        }
    };

    const addSpecialty = () => {
        if (newSpecialty && !specialties.includes(newSpecialty)) {
            setSpecialties([...specialties, newSpecialty]);
            setNewSpecialty("");
        }
    };

    const removeSpecialty = (s: string) => {
        setSpecialties(specialties.filter(item => item !== s));
    };

    const addCertification = () => {
        if (newCertification && !certifications.includes(newCertification)) {
            setCertifications([...certifications, newCertification]);
            setNewCertification("");
        }
    };

    const removeCertification = (c: string) => {
        setCertifications(certifications.filter(item => item !== c));
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Edit Profile</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                        <Label htmlFor="name">Name</Label>
                        <Input id="name" value={name} onChange={(e) => setName(e.target.value)} />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="phone">Phone Number</Label>
                        <Input id="phone" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+1234567890" />
                    </div>

                    {user?.role === 'mechanic' && (
                        <>
                            <div className="grid gap-2">
                                <Label>Specialties</Label>
                                <div className="flex gap-2">
                                    <Input
                                        value={newSpecialty}
                                        onChange={(e) => setNewSpecialty(e.target.value)}
                                        placeholder="Add specialty"
                                        onKeyDown={(e) => e.key === 'Enter' && addSpecialty()}
                                    />
                                    <Button type="button" onClick={addSpecialty}>Add</Button>
                                </div>
                                <div className="flex flex-wrap gap-1 mt-2">
                                    {specialties.map(s => (
                                        <Badge key={s} variant="secondary" className="gap-1 pr-1">
                                            {s}
                                            <X className="h-3 w-3 cursor-pointer hover:text-destructive" onClick={() => removeSpecialty(s)} />
                                        </Badge>
                                    ))}
                                </div>
                            </div>

                            <div className="grid gap-2">
                                <Label>Certifications</Label>
                                <div className="flex gap-2">
                                    <Input
                                        value={newCertification}
                                        onChange={(e) => setNewCertification(e.target.value)}
                                        placeholder="Add certification"
                                        onKeyDown={(e) => e.key === 'Enter' && addCertification()}
                                    />
                                    <Button type="button" onClick={addCertification}>Add</Button>
                                </div>
                                <div className="flex flex-wrap gap-1 mt-2">
                                    {certifications.map(c => (
                                        <Badge key={c} variant="outline" className="gap-1 pr-1">
                                            {c}
                                            <X className="h-3 w-3 cursor-pointer hover:text-destructive" onClick={() => removeCertification(c)} />
                                        </Badge>
                                    ))}
                                </div>
                            </div>
                        </>
                    )}
                </div>
                <div className="flex justify-end gap-2">
                    <Button variant="outline" onClick={onClose}>Cancel</Button>
                    <Button onClick={handleSave} disabled={loading}>{loading ? "Saving..." : "Save Changes"}</Button>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default EditProfileModal;
