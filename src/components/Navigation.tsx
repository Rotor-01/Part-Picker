import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { Menu, X, Sun, Moon } from "lucide-react";

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
    { path: "/", label: "HOME" },
    { path: "/ai-build", label: "AI BUILDER" },
    { path: "/manual-build", label: "MANUAL" },
    { path: "/browse-parts", label: "PARTS" },
    { path: "/saved-builds", label: "SAVED" }
  ];

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-300 border-b ${scrolled
          ? "bg-background/95 backdrop-blur-sm border-border"
          : "bg-background border-transparent"
        }`}
    >
      <div className="container flex h-20 items-center justify-between">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 bg-primary text-primary-foreground flex items-center justify-center font-bold text-xl rounded-none group-hover:bg-accent transition-colors">
            T
          </div>
          <span className="text-2xl font-bold tracking-tighter uppercase font-display">
            TRINITY
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`text-sm font-bold uppercase tracking-wider transition-colors hover:text-accent ${isActive(item.path) ? "text-accent" : "text-muted-foreground"
                }`}
            >
              {item.label}
            </Link>
          ))}

          <div className="flex items-center gap-4 pl-8 border-l border-border">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              className="rounded-none hover:bg-accent hover:text-accent-foreground"
            >
              {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </Button>

            <Button asChild className="rounded-none bg-primary text-primary-foreground hover:bg-accent hover:text-accent-foreground font-bold uppercase tracking-wider shadow-none border-2 border-transparent hover:border-primary transition-all">
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
            className="rounded-none"
          >
            {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </Button>

          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="rounded-none"
          >
            {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-20 left-0 w-full bg-background border-b border-border animate-in slide-in-from-top-5 z-40">
          <nav className="container py-8 flex flex-col gap-4">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`text-2xl font-bold uppercase tracking-tighter hover:text-accent transition-colors ${isActive(item.path) ? "text-accent" : "text-foreground"
                  }`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {item.label}
              </Link>
            ))}
            <div className="pt-4 mt-4 border-t border-border">
              <Button asChild className="w-full rounded-none bg-primary text-primary-foreground hover:bg-accent h-12 text-lg font-bold uppercase">
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
