import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Home } from "lucide-react";
import Navigation from "@/components/Navigation";

const NotFound = () => {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navigation />

      <main className="container py-12 sm:py-16 lg:py-20 flex-grow flex items-center justify-center">
        <div className="text-center w-full animate-fade-in-up">
          <div className="mb-6 sm:mb-8">
            <h1 className="mb-3 sm:mb-4 text-6xl sm:text-7xl lg:text-8xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-red-500">404</h1>
            <h2 className="mb-4 sm:mb-6 text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-900">Page Not Found</h2>
            <p className="mx-auto mb-8 sm:mb-12 max-w-2xl text-base sm:text-lg lg:text-xl text-slate-500 px-4">
              The page you're looking for doesn't exist or has been moved.
            </p>
          </div>

          <Card className="mx-auto max-w-md border-0 shadow-2xl shadow-slate-200/50 bg-white/80 backdrop-blur-sm">
            <CardContent className="p-6 sm:p-8 text-center">
              <div className="mb-4 sm:mb-6 inline-flex h-16 w-16 sm:h-20 sm:w-20 items-center justify-center rounded-full bg-orange-100 text-orange-600">
                <Home className="h-8 w-8 sm:h-10 sm:w-10" />
              </div>
              <h3 className="mb-3 sm:mb-4 text-xl sm:text-2xl font-bold text-slate-900">Let's Get You Back</h3>
              <p className="mb-4 sm:mb-6 text-sm sm:text-base text-slate-500">
                Return to our homepage and explore our PC building tools.
              </p>
              <Button asChild className="w-full h-12 text-base shadow-lg shadow-orange-500/25 hover:shadow-orange-500/40">
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
