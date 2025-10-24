import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";

const Navigation = () => {
  const location = useLocation();
  
  const isActive = (path: string) => location.pathname === path;
  
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/80 backdrop-blur-md">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center space-x-2">
          <h1 className="text-2xl font-bold text-gradient">THE TRINITY</h1>
        </Link>
        
        <nav className="flex items-center gap-2">
          <Button
            variant={isActive("/") ? "secondary" : "ghost"}
            asChild
            className="text-sm"
          >
            <Link to="/">Home</Link>
          </Button>
          <Button
            variant={isActive("/ai-build") ? "secondary" : "ghost"}
            asChild
            className="text-sm"
          >
            <Link to="/ai-build">AI Build</Link>
          </Button>
          <Button
            variant={isActive("/manual-build") ? "secondary" : "ghost"}
            asChild
            className="text-sm"
          >
            <Link to="/manual-build">Manual Build</Link>
          </Button>
          <Button
            variant={isActive("/browse-parts") ? "secondary" : "ghost"}
            asChild
            className="text-sm"
          >
            <Link to="/browse-parts">Browse Parts</Link>
          </Button>
        </nav>
      </div>
    </header>
  );
};

export default Navigation;
