
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { BookOpen, Video, Users } from 'lucide-react';
import MainLayout from '@/components/layout/MainLayout';
import { useApi } from '@/contexts/ApiContext';

const Index = () => {
  const { isAuthenticated } = useApi();

  return (
    <MainLayout>
      <div className="flex flex-col items-center justify-center py-10 text-center">
        <div className="space-y-3 max-w-3xl">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl text-education-primary">
            Online Coaching Lecture Platform
          </h1>
          <p className="text-lg text-muted-foreground mb-8">
            Securely access live and recorded lectures for your courses
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 my-12 w-full max-w-5xl">
          <Card className="border-2 border-education-primary/10">
            <CardContent className="p-6 flex flex-col items-center text-center space-y-4">
              <div className="p-3 rounded-full bg-education-light text-education-primary">
                <BookOpen className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-semibold">Structured Courses</h3>
              <p className="text-muted-foreground">
                Organized by weeks with clear progression to help you master the material
              </p>
            </CardContent>
          </Card>
          
          <Card className="border-2 border-education-primary/10">
            <CardContent className="p-6 flex flex-col items-center text-center space-y-4">
              <div className="p-3 rounded-full bg-education-light text-education-secondary">
                <Video className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-semibold">Live & Recorded Lectures</h3>
              <p className="text-muted-foreground">
                Attend live sessions with real-time chat or watch recordings at your convenience
              </p>
            </CardContent>
          </Card>
          
          <Card className="border-2 border-education-primary/10">
            <CardContent className="p-6 flex flex-col items-center text-center space-y-4">
              <div className="p-3 rounded-full bg-education-light text-education-accent">
                <Users className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-semibold">Interactive Learning</h3>
              <p className="text-muted-foreground">
                Engage directly with instructors through YouTube Live Chat during sessions
              </p>
            </CardContent>
          </Card>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 mt-4">
          {isAuthenticated ? (
            <Button asChild size="lg" className="text-lg py-6 px-8">
              <Link to="/dashboard">Go to Dashboard</Link>
            </Button>
          ) : (
            <Button asChild size="lg" className="text-lg py-6 px-8">
              <Link to="/login">Get Started</Link>
            </Button>
          )}
        </div>
      </div>
    </MainLayout>
  );
};

export default Index;
