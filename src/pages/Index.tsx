
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';

const Index = () => {
  const { user } = useAuth();

  return (
    <div className="flex flex-col min-h-screen">
      <header className="bg-background border-b">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2 font-bold text-xl text-primary">
            <span>LectureHub</span>
          </div>
          <Button asChild>
            <Link to={user ? "/dashboard" : "/auth"}>
              {user ? "Go to Dashboard" : "Sign In"}
            </Link>
          </Button>
        </div>
      </header>
      <main className="flex-1 grid place-items-center">
        <div className="container mx-auto px-4 text-center space-y-8 py-16">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
            Welcome to LectureHub
          </h1>
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
            Access live and recorded lectures from your educational courses
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button asChild size="lg">
              <Link to={user ? "/dashboard" : "/auth"}>
                {user ? "Go to Dashboard" : "Get Started"}
              </Link>
            </Button>
            {!user && (
              <Button asChild variant="outline" size="lg">
                <Link to="/auth?tab=signup">Create Account</Link>
              </Button>
            )}
          </div>
        </div>
      </main>
      <footer className="border-t py-6 md:py-8">
        <div className="container text-center text-sm text-muted-foreground">
          LectureHub &copy; {new Date().getFullYear()}
        </div>
      </footer>
    </div>
  );
};

export default Index;
