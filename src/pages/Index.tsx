
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { BookOpen, TrendingUp, Users } from 'lucide-react';
import MainLayout from '@/components/layout/MainLayout';
import { useApi } from '@/contexts/ApiContext';

const Index = () => {
  const { isAuthenticated } = useApi();

  return (
    <MainLayout>
      <div className="flex flex-col items-center justify-center py-10 text-center">
        <div className="space-y-3 max-w-3xl">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl text-primary">
            Financial Market Insights Platform
          </h1>
          <p className="text-lg text-muted-foreground mb-8">
            Access exclusive financial market analysis and investment strategy sessions
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 my-12 w-full max-w-5xl">
          <Card className="border-2 border-primary/10">
            <CardContent className="p-6 flex flex-col items-center text-center space-y-4">
              <div className="p-3 rounded-full bg-primary/10 text-primary">
                <BookOpen className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-semibold">Market Education</h3>
              <p className="text-muted-foreground">
                Learn stock market fundamentals and advanced trading strategies from industry experts
              </p>
            </CardContent>
          </Card>
          
          <Card className="border-2 border-primary/10">
            <CardContent className="p-6 flex flex-col items-center text-center space-y-4">
              <div className="p-3 rounded-full bg-primary/10 text-secondary">
                <TrendingUp className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-semibold">Investment Analysis</h3>
              <p className="text-muted-foreground">
                Gain insights on market trends, mutual funds, and portfolio optimization techniques
              </p>
            </CardContent>
          </Card>
          
          <Card className="border-2 border-primary/10">
            <CardContent className="p-6 flex flex-col items-center text-center space-y-4">
              <div className="p-3 rounded-full bg-primary/10 text-accent">
                <Users className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-semibold">Expert Guidance</h3>
              <p className="text-muted-foreground">
                Connect with dedicated relationship managers who provide personalized investment advice
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
