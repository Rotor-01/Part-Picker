import { Link } from 'react-router-dom';
import { Menu, X, Cpu } from 'lucide-react';
import { useState } from 'react';

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 group">
            <Cpu className="w-8 h-8 text-primary transition-transform group-hover:rotate-180 duration-500" />
            <span className="text-xl font-bold text-foreground tracking-tight">
              TRINITY
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            <NavLink to="/ai-build">AI Architect</NavLink>
            <NavLink to="/manual-build">Manual Studio</NavLink>
            <NavLink to="/browse-parts">Browse Parts</NavLink>
            <NavLink to="/saved-builds">Saved Builds</NavLink>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 rounded-md text-foreground hover:bg-secondary transition-colors"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <div className="md:hidden border-t border-border bg-white">
          <div className="px-4 pt-2 pb-4 space-y-1">
            <MobileNavLink to="/ai-build" onClick={() => setIsOpen(false)}>
              AI Architect
            </MobileNavLink>
            <MobileNavLink to="/manual-build" onClick={() => setIsOpen(false)}>
              Manual Studio
            </MobileNavLink>
            <MobileNavLink to="/browse-parts" onClick={() => setIsOpen(false)}>
              Browse Parts
            </MobileNavLink>
            <MobileNavLink to="/saved-builds" onClick={() => setIsOpen(false)}>
              Saved Builds
            </MobileNavLink>
          </div>
        </div>
      )}
    </nav>
  );
}

function NavLink({ to, children }: { to: string; children: React.ReactNode }) {
  return (
    <Link
      to={to}
      className="px-4 py-2 text-sm font-medium text-foreground/70 hover:text-foreground hover:bg-secondary rounded-md transition-all duration-200"
    >
      {children}
    </Link>
  );
}

function MobileNavLink({
  to,
  children,
  onClick,
}: {
  to: string;
  children: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <Link
      to={to}
      onClick={onClick}
      className="block px-4 py-3 text-base font-medium text-foreground/70 hover:text-foreground hover:bg-secondary rounded-md transition-colors"
    >
      {children}
    </Link>
  );
}
