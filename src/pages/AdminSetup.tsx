
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import MainLayout from '@/components/layout/MainLayout';

const AdminSetup = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSetAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Call the set-admin edge function
      const { data, error } = await supabase.functions.invoke('set-admin', {
        body: { email },
      });

      if (error) {
        throw new Error(error.message);
      }

      toast.success('User has been set as admin successfully');
      setEmail('');
    } catch (error: any) {
      toast.error(error.message || 'Failed to set user as admin');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <MainLayout>
      <div className="flex justify-center items-center min-h-[calc(100vh-4rem)]">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-2xl font-bold">Admin Setup</CardTitle>
            <CardDescription>
              Use this form to set a user as an admin
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleSetAdmin}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter user's email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <p className="text-xs text-muted-foreground">
                This will grant admin privileges to the user with this email
              </p>
            </CardContent>
            <CardFooter>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? 'Setting admin...' : 'Set as Admin'}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </MainLayout>
  );
};

export default AdminSetup;
