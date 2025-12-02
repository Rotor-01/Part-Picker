import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { Menu, X, Cpu, Moon, Sun } from "lucide-react";

// BEFORE: Dark, transparent navigation with glow effects
// AFTER: Clean, light navigation with sticky behavior and professional spacing
// KEY CHANGES:
// - Switched to light background with subtle border/shadow on scroll
// - Added Theme Toggle (Dark Mode support)
// - Refined mobile menu with clean slide-in animation
// - Updated logo and button styles to match new aesthetic

const Navigation = () => {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isDark, setIsDark] = useState(false);

  const isActive = (path: string) => location.pathname === path;

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);

    // Check initial theme
    if (document.documentElement.classList.contains('dark')) {
      setIsDark(true);
    }

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleTheme = () => {
    const newIsDark = !isDark;
    setIsDark(newIsDark);
    if (newIsDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  };

  const navItems = [
    { path: "/", label: "Home" },
    { path: "/ai-build", label: "AI Build" },
    { path: "/manual-build", label: "Manual Build" },
    { path: "/browse-parts", label: "Browse Parts" },
    { path: "/saved-builds", label: "Saved Builds" }
  ];

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${scrolled
          ? "bg-background/95 backdrop-blur-md border-b border-border shadow-sm"
          : "bg-background border-b border-transparent"
        }`}
    >
      <div className="container flex h-20 items-center justify-between">
        <Link to="/" className="flex items-center space-x-3 group">
          <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-primary text-primary-foreground transition-transform group-hover:scale-105 shadow-sm">
            <Cpu className="w-6 h-6" />
          </div>
          <span className="text-xl font-bold tracking-tight text-foreground">
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
              className={`text-sm font-medium transition-all hover:text-primary hover:bg-primary/5 ${isActive(item.path) ? "text-primary bg-primary/10 font-semibold" : "text-muted-foreground"
                }`}
            >
              <Link to={item.path}>{item.label}</Link>
            </Button>
          ))}

          <div className="ml-4 pl-4 border-l border-border flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              className="text-muted-foreground hover:text-primary"
            >
              {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </Button>

            <Button asChild className="bg-primary hover:bg-primary/90 text-white shadow-sm hover:shadow-md transition-all">
              <Link to="/ai-build">Start Building</Link>
            </Button>
          </div>
        </nav>

        {/* Mobile Menu Button */}
        <div className="flex items-center gap-2 md:hidden">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            className="text-muted-foreground"
          >
            {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </Button>

          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-20 left-0 w-full border-b border-border bg-background shadow-lg animate-in slide-in-from-top-5">
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
              <Button asChild className="w-full bg-primary hover:bg-primary/90 text-white h-12 text-lg shadow-sm">
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
