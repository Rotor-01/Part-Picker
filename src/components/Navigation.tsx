import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Cpu, Search, Save } from 'lucide-react';
import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      {/* Dynamic Island / Floating Dock */}
      <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 w-full max-w-5xl px-4">
        <nav className={cn(
          "rounded-[2.5rem] px-6 py-3 transition-all duration-500 ease-out flex items-center justify-between overflow-hidden",
          scrolled
            ? "bg-[#1a1a1a]/80 backdrop-blur-2xl border border-white/5 shadow-2xl"
            : "bg-[#1a1a1a]/60 border border-white/5 backdrop-blur-xl"
        )}>
          {/* Logo Section */}
          <Link to="/" className="flex items-center space-x-4 group mr-8 -ml-10">
            <div className="relative w-64 h-16 group-hover:scale-105 transition-transform duration-300">
              <img
                src="/logo-trinity.png"
                alt="Trinity Logo"
                className="w-full h-full object-contain drop-shadow-glow"
              />
            </div>
          </Link>

          {/* Desktop Navigation - Centered Items */}
          <div className="hidden md:flex items-center justify-end flex-1 gap-1">
            <NavLink
              to="/"
              icon={<img src="/icons/home.png" alt="Home" className="w-5 h-5 object-contain invert brightness-0" />}
              label="Home"
              active={location.pathname === '/'}
              glowColor="bg-cyan-500"
            />
            <NavLink
              to="/ai-build"
              icon={<Cpu className="w-5 h-5" />}
              label="AI Architect"
              active={location.pathname === '/ai-build'}
              glowColor="bg-purple-500"
            />
            <NavLink
              to="/manual-build"
              icon={<img src="/icons/manual.png" alt="Manual" className="w-5 h-5 object-contain invert brightness-0" />}
              label="Manual"
              active={location.pathname === '/manual-build'}
              glowColor="bg-orange-500"
            />
            <NavLink
              to="/browse-parts"
              icon={<Search className="w-5 h-5" />}
              label="Catalog"
              active={location.pathname === '/browse-parts'}
              glowColor="bg-emerald-500"
            />
            <NavLink
              to="/saved-builds"
              icon={<Save className="w-5 h-5" />}
              label="Saved"
              active={location.pathname === '/saved-builds'}
              glowColor="bg-rose-500"
            />
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden pl-4">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 text-white/80 hover:text-white hover:bg-white/10 rounded-full transition-colors"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </nav>
      </div>

      {/* Mobile Navigation Overlay */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm md:hidden animate-in fade-in duration-300"
            onClick={() => setIsOpen(false)}
          />

          {/* Bottom Sheet Drawer */}
          <div className="fixed bottom-0 left-0 right-0 z-50 bg-[#1a1a1a]/90 backdrop-blur-3xl md:hidden rounded-t-[2.5rem] border-t border-white/10 p-6 pb-10 animate-in slide-in-from-bottom duration-300 shadow-[0_-10px_40px_rgba(0,0,0,0.5)]">
            {/* Handle Bar */}
            <div className="w-12 h-1.5 bg-white/20 rounded-full mx-auto mb-8" />

            <div className="flex flex-col space-y-2">
              <MobileNavLink
                to="/"
                onClick={() => setIsOpen(false)}
                icon={<img src="/icons/home.png" alt="Home" className="w-6 h-6 object-contain invert brightness-0" />}
                glowColor="bg-cyan-500"
              >
                Home
              </MobileNavLink>
              <MobileNavLink
                to="/ai-build"
                onClick={() => setIsOpen(false)}
                icon={<Cpu className="w-6 h-6" />}
                glowColor="bg-purple-500"
              >
                AI Architect
              </MobileNavLink>
              <MobileNavLink
                to="/manual-build"
                onClick={() => setIsOpen(false)}
                icon={<img src="/icons/manual.png" alt="Manual" className="w-6 h-6 object-contain invert brightness-0" />}
                glowColor="bg-orange-500"
              >
                Manual Studio
              </MobileNavLink>
              <MobileNavLink
                to="/browse-parts"
                onClick={() => setIsOpen(false)}
                icon={<Search className="w-6 h-6" />}
                glowColor="bg-emerald-500"
              >
                Catalog
              </MobileNavLink>
              <MobileNavLink
                to="/saved-builds"
                onClick={() => setIsOpen(false)}
                icon={<Save className="w-6 h-6" />}
                glowColor="bg-rose-500"
              >
                Saved Builds
              </MobileNavLink>
            </div>
          </div>
        </>
      )}
    </>
  );
}

function NavLink({ to, icon, label, active, glowColor }: { to: string; icon: React.ReactNode; label: string; active: boolean; glowColor: string }) {
  return (
    <Link
      to={to}
      className="relative flex flex-col items-center justify-center w-24 py-3 group"
    >
      {/* Icon and Label Container */}
      <div className={cn(
        "relative z-10 flex flex-col items-center transition-opacity duration-300",
        active ? "opacity-100" : "opacity-60 group-hover:opacity-100"
      )}>
        <div className="mb-1.5 drop-shadow-md">
          {icon}
        </div>
        <span className="text-[9px] font-bold tracking-widest uppercase text-white/90">
          {label}
        </span>
      </div>

      {/* Contained Spotlight Glow Effect */}
      <div className={cn(
        "absolute -bottom-4 left-1/2 -translate-x-1/2 w-8 h-8 rounded-full blur-lg transition-all duration-500 opacity-0 group-hover:opacity-40",
        glowColor,
        active && "opacity-40"
      )} />
    </Link>
  );
}

function MobileNavLink({
  to,
  children,
  onClick,
  icon,
  glowColor
}: {
  to: string;
  children: React.ReactNode;
  onClick: () => void;
  icon: React.ReactNode;
  glowColor: string;
}) {
  const location = useLocation();
  const active = location.pathname === to;

  return (
    <Link
      to={to}
      onClick={onClick}
      className={cn(
        "relative flex items-center space-x-4 p-4 rounded-2xl transition-all duration-300 overflow-hidden group",
        active ? "bg-white/10" : "hover:bg-white/5"
      )}
    >
      {/* Glow Background for Active State */}
      {active && (
        <div className={cn(
          "absolute inset-0 opacity-20 blur-xl",
          glowColor
        )} />
      )}

      <div className={cn(
        "relative z-10 p-2 rounded-xl bg-white/5 border border-white/10",
        active ? "text-white" : "text-white/60"
      )}>
        {icon}
      </div>

      <span className={cn(
        "relative z-10 text-lg font-bold tracking-wide",
        active ? "text-white" : "text-white/60"
      )}>
        {children}
      </span>

      {/* Right Arrow Indicator */}
      {active && (
        <div className={cn(
          "absolute right-4 w-2 h-2 rounded-full",
          glowColor.replace('bg-', 'bg-') // Just using the color class
        )} />
      )}
    </Link>
  );
}
