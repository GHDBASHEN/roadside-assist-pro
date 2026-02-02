import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import Header from '@/components/landing/Header';

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
        <div className="flex flex-col min-h-screen bg-background relative overflow-hidden">
            <Header />

            <main className="flex-1 flex items-center justify-center relative pt-20">
                {/* Background Effects */}
                <div className="absolute inset-0 pointer-events-none z-0">
                    <div className="absolute inset-0 bg-gradient-hero opacity-80" />
                    <div className="absolute top-0 right-0 w-full h-[500px] bg-primary/5 blur-[100px] opacity-20" />
                    <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-500/5 blur-[120px] opacity-20" />
                </div>

                <Card className="w-[380px] z-10 bg-card/60 backdrop-blur-md border-border/50 shadow-2xl">
                    <CardHeader className="space-y-1">
                        <CardTitle className="text-2xl font-bold text-center bg-gradient-to-r from-primary to-orange-400 bg-clip-text text-transparent">Welcome Back</CardTitle>
                        <CardDescription className="text-center text-muted-foreground">Enter your credentials to access your account.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={onSubmit} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    name="email"
                                    type="email"
                                    placeholder="name@example.com"
                                    value={email}
                                    onChange={onChange}
                                    required
                                    className="bg-background/50 border-input focus:border-primary/50"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="password">Password</Label>
                                <Input
                                    id="password"
                                    name="password"
                                    type="password"
                                    placeholder="swodrow"
                                    value={password}
                                    onChange={onChange}
                                    required
                                    className="bg-background/50 border-input focus:border-primary/50"
                                />
                            </div>

                            <Button className="w-full mt-4 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold shadow-lg shadow-primary/20" type="submit" disabled={loading}>
                                {loading ? 'Logging in...' : 'Sign In'}
                            </Button>
                        </form>
                    </CardContent>
                    <CardFooter className="flex justify-center border-t border-border/30 pt-4">
                        <p className="text-sm text-muted-foreground">Don't have an account? <Link to="/register" className="text-primary hover:underline font-medium">Register</Link></p>
                    </CardFooter>
                </Card>
            </main>
        </div>
    );
};

export default Login;
