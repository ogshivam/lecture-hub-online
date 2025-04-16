
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useApi } from '@/contexts/ApiContext';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

const LoginForm: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [referralCode, setReferralCode] = useState('');
  const { login } = useApi();
  const navigate = useNavigate();
  const location = useLocation();

  // Extract referral code from URL if present
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const rm_id = params.get('rm_id');
    if (rm_id) {
      setReferralCode(rm_id);
      setIsRegistering(true); // Auto switch to registration mode if they came from a referral link
    }
  }, [location]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    if (isRegistering) {
      // Handle registration with referral code
      try {
        await supabase.auth.signUp({
          email: username,
          password: password,
          options: {
            data: {
              full_name: fullName,
              phone: phone,
              referral_code: referralCode
            }
          }
        });
        
        toast.success('Registration successful! Please check your email to verify your account.');
        setTimeout(() => {
          navigate('/dashboard');
        }, 1500);
      } catch (error) {
        console.error('Registration error:', error);
        toast.error('Registration failed. Please try again.');
      } finally {
        setIsLoading(false);
      }
    } else {
      // Handle regular login
      if (login(username, password)) {
        toast.success('Login successful!');
        setTimeout(() => {
          navigate('/dashboard');
        }, 500);
      } else {
        toast.error('Invalid username or password');
        setIsLoading(false);
      }
    }
  };

  const toggleMode = () => {
    setIsRegistering(!isRegistering);
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold text-center">
          {isRegistering ? 'Register' : 'Login'}
        </CardTitle>
        <CardDescription className="text-center">
          {isRegistering 
            ? 'Create an account to access financial courses' 
            : 'Enter your credentials to access your account'}
        </CardDescription>
        {referralCode && (
          <CardDescription className="text-center text-green-600">
            You were invited by a Relationship Manager
          </CardDescription>
        )}
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          {isRegistering && (
            <div className="space-y-2">
              <Label htmlFor="fullName">Full Name</Label>
              <Input
                id="fullName"
                placeholder="John Doe"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
              />
            </div>
          )}
          
          <div className="space-y-2">
            <Label htmlFor="username">Email</Label>
            <Input
              id="username"
              type="email"
              placeholder="you@example.com"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          
          {isRegistering && (
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                placeholder="+1234567890"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>
          )}
          
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          
          {referralCode && (
            <div className="space-y-2">
              <Label htmlFor="referralCode">Referral Code</Label>
              <Input
                id="referralCode"
                value={referralCode}
                readOnly
                className="bg-gray-100"
              />
            </div>
          )}
          
          {!isRegistering && (
            <p className="text-xs text-muted-foreground">
              Hint: Use "admin" / "admin" for admin access or "user" / "user" for student access
            </p>
          )}
        </CardContent>
        <CardFooter className="flex flex-col space-y-3">
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading 
              ? (isRegistering ? 'Creating account...' : 'Logging in...') 
              : (isRegistering ? 'Register' : 'Login')}
          </Button>
          <Button type="button" variant="link" onClick={toggleMode} className="w-full">
            {isRegistering 
              ? 'Already have an account? Login' 
              : 'Don\'t have an account? Register'}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default LoginForm;
