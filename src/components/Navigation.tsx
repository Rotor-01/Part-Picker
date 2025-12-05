import { Link } from 'react-router-dom';
import { Menu, X, Cpu } from 'lucide-react';
import { useState } from 'react';

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 bg-background border-b-2 border-foreground">
      <div className="max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="bg-foreground text-background p-1">
              <Cpu className="w-8 h-8" />
            </div>
            <span className="text-2xl font-bold text-foreground tracking-tighter uppercase">
              Trinity
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <NavLink to="/ai-build">AI Architect</NavLink>
            <NavLink to="/manual-build">Manual Studio</NavLink>
            <NavLink to="/browse-parts">Catalog</NavLink>
            <NavLink to="/saved-builds">Saved</NavLink>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 text-foreground hover:bg-foreground hover:text-background transition-colors border-2 border-transparent hover:border-foreground"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <div className="md:hidden border-b-2 border-foreground bg-background">
          <div className="flex flex-col">
            <MobileNavLink to="/ai-build" onClick={() => setIsOpen(false)}>
              AI Architect
            </MobileNavLink>
            <MobileNavLink to="/manual-build" onClick={() => setIsOpen(false)}>
              Manual Studio
            </MobileNavLink>
            <MobileNavLink to="/browse-parts" onClick={() => setIsOpen(false)}>
              Catalog
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
      className="text-sm font-bold uppercase tracking-widest hover:text-primary transition-colors relative group"
    >
      {children}
      <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all group-hover:w-full"></span>
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
      className="block px-6 py-4 text-xl font-bold uppercase tracking-wider border-t border-foreground/10 hover:bg-foreground hover:text-background transition-colors"
    >
      {children}
    </Link>
  );
}
