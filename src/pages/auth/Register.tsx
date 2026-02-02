import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { toast } from 'sonner';
import Header from '@/components/landing/Header';

const Register = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        phone: '',
        role: 'user', // Default role
        specialties: '', // Comma separated string for input
        certifications: '', // Comma separated string for input
    });

    const { name, email, password, phone, role, specialties, certifications } = formData;

    const onChange = (e: React.ChangeEvent<HTMLInputElement>) =>
        setFormData({ ...formData, [e.target.name]: e.target.value });

    const onRoleChange = (value: string) => {
        setFormData({ ...formData, role: value });
    }

    const onSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        console.log('Registering user:', formData);
        try {
            // Parse specialties and certifications into arrays
            const payload = {
                ...formData,
                specialties: specialties ? specialties.split(',').map(s => s.trim()) : [],
                certifications: certifications ? certifications.split(',').map(c => c.trim()) : []
            };

            const res = await api.post('/users', payload);
            console.log('Registration success:', res.data);
            localStorage.setItem('token', res.data.token);
            toast.success('Registration successful!');
            // Fetch user data/or just redirect based on known role
            if (role === 'mechanic') {
                navigate('/mechanic-dashboard');
            } else {
                navigate('/dashboard');
            }
        } catch (err: any) {
            console.error('Registration error:', err);
            const errors = err.response?.data?.errors;
            if (errors) {
                errors.forEach((error: any) => toast.error(error.msg));
            } else {
                toast.error(err.message || 'Registration failed');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col min-h-screen bg-background relative overflow-hidden">
            <Header />

            <main className="flex-1 flex items-center justify-center relative pt-20 pb-10">
                {/* Background Effects */}
                <div className="absolute inset-0 pointer-events-none z-0">
                    <div className="absolute inset-0 bg-gradient-hero opacity-80" />
                    <div className="absolute top-0 right-0 w-full h-[500px] bg-primary/5 blur-[100px] opacity-20" />
                    <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-500/5 blur-[120px] opacity-20" />
                </div>

                <Card className="w-[450px] z-10 bg-card/60 backdrop-blur-md border-border/50 shadow-2xl">
                    <CardHeader>
                        <CardTitle className="text-2xl font-bold text-center bg-gradient-to-r from-primary to-orange-400 bg-clip-text text-transparent">Create Account</CardTitle>
                        <CardDescription className="text-center text-muted-foreground">Join our community of drivers and mechanics.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={onSubmit} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="name">Full Name</Label>
                                <Input id="name" name="name" placeholder="John Doe" value={name} onChange={onChange} required className="bg-background/50 border-input focus:border-primary/50" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="phone">Phone Number</Label>
                                <Input id="phone" name="phone" placeholder="123-456-7890" value={phone} onChange={onChange} required className="bg-background/50 border-input focus:border-primary/50" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="email">Email Address</Label>
                                <Input id="email" name="email" type="email" placeholder="name@example.com" value={email} onChange={onChange} required className="bg-background/50 border-input focus:border-primary/50" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="password">Password</Label>
                                <Input id="password" name="password" type="password" placeholder="******" value={password} onChange={onChange} required minLength={6} className="bg-background/50 border-input focus:border-primary/50" />
                            </div>

                            <div className="space-y-3 pt-2 bg-secondary/30 p-4 rounded-lg border border-border/50">
                                <Label className="text-muted-foreground">I am joining as a...</Label>
                                <RadioGroup defaultValue="user" onValueChange={onRoleChange} className="flex space-x-4">
                                    <div className="flex items-center space-x-2">
                                        <RadioGroupItem value="user" id="r1" className="text-primary border-primary/50" />
                                        <Label htmlFor="r1" className="cursor-pointer font-medium">User</Label>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <RadioGroupItem value="mechanic" id="r2" className="text-primary border-primary/50" />
                                        <Label htmlFor="r2" className="cursor-pointer font-medium">Mechanic</Label>
                                    </div>
                                </RadioGroup>
                            </div>

                            {role === 'mechanic' && (
                                <div className="space-y-4 pt-2 animate-in fade-in slide-in-from-top-2 duration-300">
                                    <div className="space-y-2">
                                        <Label htmlFor="specialties">Specialties (comma separated)</Label>
                                        <Input id="specialties" name="specialties" placeholder="Engine, Tires, Electrical" value={specialties} onChange={onChange} className="bg-background/50 border-input focus:border-primary/50" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="certifications">Certifications (comma separated)</Label>
                                        <Input id="certifications" name="certifications" placeholder="ASE, Manufacturer Certified" value={certifications} onChange={onChange} className="bg-background/50 border-input focus:border-primary/50" />
                                    </div>
                                </div>
                            )}

                            <Button className="w-full mt-6 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold shadow-lg shadow-primary/20" type="submit" disabled={loading}>
                                {loading ? 'Creating Account...' : 'Register'}
                            </Button>
                        </form>
                    </CardContent>
                    <CardFooter className="flex justify-center border-t border-border/30 pt-4">
                        <p className="text-sm text-muted-foreground">Already have an account? <Link to="/login" className="text-primary hover:underline font-medium">Login</Link></p>
                    </CardFooter>
                </Card>
            </main>
        </div>
    );
};

export default Register;
