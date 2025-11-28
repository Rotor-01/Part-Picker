import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Home } from "lucide-react";
import Navigation from "@/components/Navigation";

const NotFound = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />

      <main className="container py-12 sm:py-16 lg:py-20 flex-grow flex items-center justify-center">
        <div className="text-center w-full">
          <div className="mb-6 sm:mb-8">
            <h1 className="mb-3 sm:mb-4 text-6xl sm:text-7xl lg:text-8xl font-bold text-gradient animate-in fade-in slide-in-from-bottom-4 duration-1000">404</h1>
            <h2 className="mb-4 sm:mb-6 text-2xl sm:text-3xl lg:text-4xl font-bold animate-in fade-in slide-in-from-bottom-6 duration-1000 delay-100">Page Not Found</h2>
            <p className="mx-auto mb-8 sm:mb-12 max-w-2xl text-base sm:text-lg lg:text-xl text-muted-foreground px-4 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-200">
              The page you're looking for doesn't exist or has been moved.
            </p>
          </div>

          <Card className="mx-auto max-w-md glass-panel border-border animate-in fade-in zoom-in duration-500 delay-300">
            <CardContent className="p-6 sm:p-8 text-center">
              <div className="mb-4 sm:mb-6 inline-flex h-16 w-16 sm:h-20 sm:w-20 items-center justify-center rounded-full bg-primary/10">
                <Home className="h-8 w-8 sm:h-10 sm:w-10 text-primary" />
              </div>
              <h3 className="mb-3 sm:mb-4 text-xl sm:text-2xl font-bold">Let's Get You Back</h3>
              <p className="mb-4 sm:mb-6 text-sm sm:text-base text-muted-foreground">
                Return to our homepage and explore our PC building tools.
              </p>
              <Button asChild className="w-full bg-primary hover:bg-primary/90 shadow-lg shadow-primary/25">
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
