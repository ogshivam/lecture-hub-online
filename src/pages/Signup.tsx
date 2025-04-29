import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { useApi } from '@/contexts/ApiContext';
import { storeReferralCode, validateReferralCode, getLectureIdFromCode } from '@/utils/referralUtils';

export default function Signup() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { createUser } = useApi();
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [mobile, setMobile] = useState('');
  const [referralCode, setReferralCode] = useState<string | null>(null);
  const [lectureId, setLectureId] = useState<string | null>(null);

  useEffect(() => {
    // Check for referral code in URL
    const ref = searchParams.get('ref');
    if (ref && validateReferralCode(ref)) {
      storeReferralCode(ref);
      setReferralCode(ref);
      const lectureId = getLectureIdFromCode(ref);
      if (lectureId) {
        setLectureId(lectureId);
        console.log('Setting lecture ID:', lectureId); // Debug log
      }
      toast.info('Referral code detected');
    }
  }, [searchParams]);

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();

    if (!name || !email || !mobile) {
      toast.error('Please fill in all fields');
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error('Please enter a valid email address');
      return;
    }

    // Validate mobile number (10 digits)
    const mobileRegex = /^\d{10}$/;
    if (!mobileRegex.test(mobile)) {
      toast.error('Please enter a valid 10-digit mobile number');
      return;
    }

    // Create new user
    const success = createUser({
      name,
      email,
      mobile,
      referralCode: referralCode || undefined,
    });
    
    if (success) {
      toast.success('Account created successfully');
      
      // Redirect to the specific lecture if there's a referral
      if (lectureId) {
        console.log('Redirecting to lecture:', lectureId); // Debug log
        navigate(`/lectures/${lectureId}`);
      } else {
        navigate('/dashboard');
      }
    } else {
      toast.error('Error creating account');
    }
  };

  return (
    <div className="container max-w-md mx-auto py-12">
      <Card>
        <CardHeader>
          <CardTitle>Create an Account</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSignup} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your full name"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="mobile">Mobile Number</Label>
              <Input
                id="mobile"
                type="tel"
                value={mobile}
                onChange={(e) => setMobile(e.target.value)}
                placeholder="Enter your mobile number"
                required
              />
            </div>
            {referralCode && (
              <div className="text-sm text-muted-foreground">
                You were referred to join this lecture. After signing up, you'll be redirected to the lecture.
              </div>
            )}
            <Button type="submit" className="w-full">
              Sign Up
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
} 