import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { Menu, X, Cpu } from "lucide-react";

const Navigation = () => {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const isActive = (path: string) => location.pathname === path;

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navItems = [
    { path: "/", label: "Home" },
    { path: "/ai-build", label: "AI Build" },
    { path: "/manual-build", label: "Manual Build" },
    { path: "/browse-parts", label: "Browse Parts" },
    { path: "/saved-builds", label: "Saved Builds" }
  ];

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${scrolled ? "bg-background/80 backdrop-blur-md border-b border-border shadow-lg" : "bg-transparent border-transparent"
        }`}
    >
      <div className="container flex h-20 items-center justify-between">
        <Link to="/" className="flex items-center space-x-3 group">
          <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-primary/10 group-hover:bg-primary/20 transition-colors">
            <Cpu className="w-6 h-6 text-primary" />
          </div>
          <span className="text-xl font-bold tracking-tight">
            PART<span className="text-primary">PICKER</span>
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-1">
          {navItems.map((item) => (
            <Button
              key={item.path}
              variant="ghost"
              asChild
              className={`text-sm font-medium transition-all hover:text-primary hover:bg-primary/5 ${isActive(item.path) ? "text-primary bg-primary/10" : "text-muted-foreground"
                }`}
            >
              <Link to={item.path}>{item.label}</Link>
            </Button>
          ))}
          <div className="ml-4 pl-4 border-l border-border">
            <Button asChild className="bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/25">
              <Link to="/ai-build">Start Building</Link>
            </Button>
          </div>
        </nav>

        {/* Mobile Menu Button */}
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </Button>
      </div>

      {/* Mobile Navigation Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-20 left-0 w-full border-b border-border bg-background/95 backdrop-blur-md animate-in slide-in-from-top-5">
          <nav className="container py-6 space-y-2 flex flex-col">
            {navItems.map((item) => (
              <Button
                key={item.path}
                variant={isActive(item.path) ? "secondary" : "ghost"}
                asChild
                className="w-full justify-start text-lg h-12"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <Link to={item.path}>{item.label}</Link>
              </Button>
            ))}
            <div className="pt-4 mt-4 border-t border-border">
              <Button asChild className="w-full bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/25 h-12 text-lg">
                <Link to="/ai-build" onClick={() => setIsMobileMenuOpen(false)}>Start Building Now</Link>
              </Button>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Navigation;
