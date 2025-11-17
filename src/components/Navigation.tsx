import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Menu, X } from "lucide-react";

const Navigation = () => {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  const isActive = (path: string) => location.pathname === path;
  
  const navItems = [
    { path: "/", label: "Home" },
    { path: "/ai-build", label: "AI Build" },
    { path: "/manual-build", label: "Manual Build" },
    { path: "/browse-parts", label: "Browse Parts" },
    { path: "/saved-builds", label: "Saved Builds" }
  ];
  
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/80 backdrop-blur-md">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center space-x-2 hover:opacity-80 transition-opacity">
          <img src="/logo.png" alt="Trinity Logo" className="h-8 w-8 sm:h-10 sm:w-10 object-contain" />
          <h1 className="text-xl sm:text-2xl font-bold text-gradient">THE TRINITY</h1>
        </Link>
        
        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-2">
          {navItems.map((item) => (
            <Button
              key={item.path}
              variant={isActive(item.path) ? "secondary" : "ghost"}
              asChild
              className="text-sm"
            >
              <Link to={item.path}>{item.label}</Link>
            </Button>
          ))}
        </nav>

        {/* Mobile Menu Button */}
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
      </div>

      {/* Mobile Navigation Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-border bg-background/95 backdrop-blur-md">
          <nav className="container py-4 space-y-2">
            {navItems.map((item) => (
              <Button
                key={item.path}
                variant={isActive(item.path) ? "secondary" : "ghost"}
                asChild
                className="w-full justify-start"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <Link to={item.path}>{item.label}</Link>
              </Button>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
};

export default Navigation;
