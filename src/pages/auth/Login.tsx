import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';

const Login = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });

    const { email, password } = formData;

    const onChange = (e: React.ChangeEvent<HTMLInputElement>) =>
        setFormData({ ...formData, [e.target.name]: e.target.value });

    const onSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        console.log('Login form submitted', formData);
        setLoading(true);
        try {
            const res = await api.post('/auth', formData);
            console.log('Login response:', res.data);
            localStorage.setItem('token', res.data.token);
            toast.success('Login successful!');

            // Fetch user data to know role and redirect accordingly
            const userRes = await api.get('/auth');
            const user = userRes.data;

            if (user.role === 'mechanic') {
                navigate('/mechanic-dashboard');
            } else {
                navigate('/dashboard');
            }

        } catch (err: any) {
            console.error('Login error:', err);
            const errors = err.response?.data?.errors;
            if (errors) {
                errors.forEach((error: any) => toast.error(error.msg));
            } else {
                toast.error(err.message || 'Login failed');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <Card className="w-[350px]">
                <CardHeader>
                    <CardTitle>Login</CardTitle>
                    <CardDescription>Enter your credentials to access your account.</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={onSubmit}>
                        <div className="grid w-full items-center gap-4">
                            <div className="flex flex-col space-y-1.5">
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    name="email"
                                    type="email"
                                    placeholder="name@example.com"
                                    value={email}
                                    onChange={onChange}
                                    required
                                />
                            </div>
                            <div className="flex flex-col space-y-1.5">
                                <Label htmlFor="password">Password</Label>
                                <Input
                                    id="password"
                                    name="password"
                                    type="password"
                                    placeholder="Your password"
                                    value={password}
                                    onChange={onChange}
                                    required
                                />
                            </div>
                        </div>
                        <Button className="w-full mt-6" type="submit" disabled={loading}>
                            {loading ? 'Logging in...' : 'Login'}
                        </Button>
                    </form>
                </CardContent>
                <CardFooter className="flex justify-center">
                    <p className="text-sm text-gray-500">Don't have an account? <Link to="/register" className="text-blue-500 hover:underline">Register</Link></p>
                </CardFooter>
            </Card>
        </div>
    );
};

export default Login;
