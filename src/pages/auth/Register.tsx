import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { toast } from 'sonner';

const Register = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        role: 'user', // Default role
        specialties: '', // Comma separated string for input
        certifications: '', // Comma separated string for input
    });

    const { name, email, password, role, specialties, certifications } = formData;

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
        <div className="flex items-center justify-center min-h-screen bg-gray-100 py-10">
            <Card className="w-[400px]">
                <CardHeader>
                    <CardTitle>Register</CardTitle>
                    <CardDescription>Create a new account.</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={onSubmit}>
                        <div className="grid w-full items-center gap-4">
                            <div className="flex flex-col space-y-1.5">
                                <Label htmlFor="name">Name</Label>
                                <Input id="name" name="name" placeholder="John Doe" value={name} onChange={onChange} required />
                            </div>
                            <div className="flex flex-col space-y-1.5">
                                <Label htmlFor="email">Email</Label>
                                <Input id="email" name="email" type="email" placeholder="name@example.com" value={email} onChange={onChange} required />
                            </div>
                            <div className="flex flex-col space-y-1.5">
                                <Label htmlFor="password">Password</Label>
                                <Input id="password" name="password" type="password" placeholder="******" value={password} onChange={onChange} required minLength={6} />
                            </div>

                            <div className="flex flex-col space-y-3 pt-2">
                                <Label>I am a...</Label>
                                <RadioGroup defaultValue="user" onValueChange={onRoleChange} className="flex space-x-4">
                                    <div className="flex items-center space-x-2">
                                        <RadioGroupItem value="user" id="r1" />
                                        <Label htmlFor="r1">User</Label>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <RadioGroupItem value="mechanic" id="r2" />
                                        <Label htmlFor="r2">Mechanic</Label>
                                    </div>
                                </RadioGroup>
                            </div>

                            {role === 'mechanic' && (
                                <>
                                    <div className="flex flex-col space-y-1.5">
                                        <Label htmlFor="specialties">Specialties (comma separated)</Label>
                                        <Input id="specialties" name="specialties" placeholder="Engine, Tires, Electrical" value={specialties} onChange={onChange} />
                                    </div>
                                    <div className="flex flex-col space-y-1.5">
                                        <Label htmlFor="certifications">Certifications (comma separated)</Label>
                                        <Input id="certifications" name="certifications" placeholder="ASE, Manufacturer Certified" value={certifications} onChange={onChange} />
                                    </div>
                                </>
                            )}

                        </div>
                        <Button className="w-full mt-6" type="submit" disabled={loading}>
                            {loading ? 'Registering...' : 'Register'}
                        </Button>
                    </form>
                </CardContent>
                <CardFooter className="flex justify-center">
                    <p className="text-sm text-gray-500">Already have an account? <Link to="/login" className="text-blue-500 hover:underline">Login</Link></p>
                </CardFooter>
            </Card>
        </div>
    );
};

export default Register;
