import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

const NotFound = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background font-sans text-center p-4">
      <h1 className="text-9xl font-bold text-primary/10 font-display mb-4">404</h1>
      <h2 className="text-4xl font-bold tracking-tight mb-4">Page not found</h2>
      <p className="text-lg text-muted-foreground max-w-md mb-8">
        The component you are looking for seems to be missing from our inventory.
      </p>
      <Button asChild size="lg" className="rounded-full px-8 shadow-medium hover:shadow-large transition-all">
        <Link to="/">
          <ArrowLeft className="mr-2 h-5 w-5" /> Return Home
        </Link>
      </Button>
    </div>
  );
};

export default NotFound;
