import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { Menu, X, ShoppingBag } from "lucide-react";

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
    { path: "/ai-build", label: "AI Architect" },
    { path: "/manual-build", label: "Manual Studio" },
    { path: "/browse-parts", label: "Catalog" },
    { path: "/saved-builds", label: "Saved" }
  ];

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${scrolled
          ? "bg-background/80 backdrop-blur-md border-b border-border/50"
          : "bg-background border-b border-transparent"
        }`}
    >
      <div className="container flex h-20 items-center justify-between">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 bg-black text-white flex items-center justify-center font-bold text-lg rounded-sm group-hover:bg-primary transition-colors duration-300">
            T
          </div>
          <span className="text-xl font-bold tracking-tight text-foreground">
            TRINITY
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`text-sm font-medium transition-colors hover:text-primary ${isActive(item.path) ? "text-foreground font-semibold" : "text-muted-foreground"
                }`}
            >
              {item.label}
            </Link>
          ))}

          <div className="flex items-center gap-4 pl-8 border-l border-border">
            <Button asChild size="sm" className="rounded-full px-6 font-medium">
              <Link to="/ai-build">Start Building</Link>
            </Button>
          </div>
        </nav>

        {/* Mobile Menu Button */}
        <div className="flex items-center gap-2 md:hidden">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="rounded-full"
          >
            {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-20 left-0 w-full bg-background border-b border-border animate-in slide-in-from-top-5 z-40 shadow-large">
          <nav className="container py-8 flex flex-col gap-4">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`text-lg font-medium hover:text-primary transition-colors ${isActive(item.path) ? "text-foreground" : "text-muted-foreground"
                  }`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {item.label}
              </Link>
            ))}
            <div className="pt-4 mt-4 border-t border-border">
              <Button asChild className="w-full rounded-full">
                <Link to="/ai-build" onClick={() => setIsMobileMenuOpen(false)}>Start Building</Link>
              </Button>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Navigation;
