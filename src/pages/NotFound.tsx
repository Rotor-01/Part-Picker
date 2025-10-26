import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Home } from "lucide-react";
import Navigation from "@/components/Navigation";

const NotFound = () => {
  return (
    <div className="min-h-screen">
      <Navigation />
      
      <main className="container py-20">
        <div className="text-center">
          <div className="mb-8">
            <h1 className="mb-4 text-8xl font-bold text-gradient">404</h1>
            <h2 className="mb-6 text-4xl font-bold">Page Not Found</h2>
            <p className="mx-auto mb-12 max-w-2xl text-xl text-muted-foreground">
              The page you're looking for doesn't exist or has been moved.
            </p>
          </div>
          
          <Card className="mx-auto max-w-md card-gradient border-border">
            <CardContent className="p-8 text-center">
              <div className="mb-6 inline-flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
                <Home className="h-10 w-10 text-primary" />
              </div>
              <h3 className="mb-4 text-2xl font-bold">Let's Get You Back</h3>
              <p className="mb-6 text-muted-foreground">
                Return to our homepage and explore our PC building tools.
              </p>
              <Button asChild className="w-full">
                <Link to="/">Go Home</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default NotFound;
