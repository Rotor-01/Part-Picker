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
    { path: "/ai-build", label: "Creative Assistant" },
    { path: "/manual-build", label: "Manual Build" },
    { path: "/browse-parts", label: "Browse Parts" },
    { path: "/saved-builds", label: "Saved Builds" }
  ];

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${scrolled
        ? "bg-white/90 backdrop-blur-md border-b border-slate-100 shadow-sm"
        : "bg-white border-b border-transparent"
        }`}
    >
      <div className="container flex h-20 items-center justify-between">
        <Link to="/" className="flex items-center space-x-3 group">
          <div className="relative flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-orange-500 to-red-500 text-white transition-transform group-hover:scale-105 shadow-lg shadow-orange-500/20">
            <Cpu className="w-5 h-5" />
          </div>
          <span className="text-xl font-bold tracking-tight text-slate-900">
            PART<span className="text-orange-500">PICKER</span>
            <span className="ml-1 inline-block w-1.5 h-1.5 rounded-full bg-orange-500 mb-1"></span>
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-1">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`relative px-4 py-2 text-sm font-medium transition-colors hover:text-orange-600 ${isActive(item.path) ? "text-orange-600" : "text-slate-600"
                }`}
            >
              {item.label}
              {isActive(item.path) && (
                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-orange-500 rounded-full animate-fade-in" />
              )}
            </Link>
          ))}

          <div className="ml-6 pl-6 border-l border-slate-200 flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              className="text-slate-400 hover:text-orange-500 hover:bg-orange-50 rounded-full"
            >
              {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </Button>

            <Button asChild className="rounded-full bg-slate-900 hover:bg-slate-800 text-white shadow-lg shadow-slate-900/20 hover:shadow-slate-900/30 transition-all">
              <Link to="/ai-build">Get Started</Link>
            </Button>
          </div>
        </nav>

        {/* Mobile Menu Button */}
        <div className="flex items-center gap-2 md:hidden">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            className="text-slate-500"
          >
            {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </Button>

          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="text-slate-900"
          >
            {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-20 left-0 w-full border-b border-slate-100 bg-white shadow-xl animate-in slide-in-from-top-5">
          <nav className="container py-6 space-y-2 flex flex-col">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center w-full px-4 py-3 text-lg font-medium rounded-xl transition-colors ${isActive(item.path)
                    ? "bg-orange-50 text-orange-600"
                    : "text-slate-600 hover:bg-slate-50"
                  }`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {item.label}
              </Link>
            ))}
            <div className="pt-4 mt-4 border-t border-slate-100 px-4">
              <Button asChild className="w-full rounded-full bg-orange-500 hover:bg-orange-600 text-white h-12 text-lg shadow-lg shadow-orange-500/20">
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
