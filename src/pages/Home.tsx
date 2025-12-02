import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Bot, Wrench, Search, ArrowRight, Cpu, Zap, ShieldCheck } from "lucide-react";
import Navigation from "@/components/Navigation";

// BEFORE: Dark, gradient-heavy hero with glassmorphism cards
// AFTER: Clean, white hero with large typography and professional feature grid
// KEY CHANGES:
// - Updated Hero section to use light background and clean typography
// - Redesigned feature cards to be white with subtle shadows
// - Improved spacing and layout for better readability
// - Added professional value proposition section

const Home = () => {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navigation />

      <main className="flex-grow">
        {/* Hero Section */}
        <section className="relative overflow-hidden py-20 sm:py-32 lg:py-40 bg-background">
          {/* Subtle background pattern/gradient */}
          <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] opacity-30 pointer-events-none" />
          <div className="absolute inset-0 bg-gradient-to-b from-background via-transparent to-background pointer-events-none" />

          <div className="container relative z-10 text-center max-w-5xl mx-auto">
            <div className="inline-flex items-center rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-sm font-medium text-primary mb-8 animate-fade-in">
              <span className="flex h-2 w-2 rounded-full bg-primary mr-2 animate-pulse-subtle"></span>
              Next-Gen PC Building
            </div>

            <h1 className="mb-8 text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-foreground animate-slide-up" style={{ animationDelay: '0.1s' }}>
              Build Your <span className="text-primary">Dream Machine</span>
            </h1>

            <p className="mx-auto mb-12 max-w-2xl text-xl text-muted-foreground leading-relaxed animate-slide-up" style={{ animationDelay: '0.2s' }}>
              Experience the future of PC building. Whether you want AI-powered recommendations or granular manual control, we ensure perfect compatibility and performance.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-slide-up" style={{ animationDelay: '0.3s' }}>
              <Button asChild size="lg" className="h-14 px-8 text-lg bg-primary hover:bg-primary/90 shadow-lg hover:shadow-xl transition-all rounded-full">
                <Link to="/ai-build">
                  Start AI Build <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="h-14 px-8 text-lg border-2 hover:bg-secondary/50 rounded-full">
                <Link to="/manual-build">Manual Mode</Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Features Grid */}
        <section className="container py-24 relative z-10">
          <div className="grid gap-8 md:grid-cols-3">
            <Link to="/ai-build" className="group">
              <div className="h-full bg-card rounded-2xl p-8 border border-border shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 relative overflow-hidden">
                <div className="mb-6 inline-flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10 text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                  <Bot className="h-7 w-7" />
                </div>
                <h3 className="mb-3 text-2xl font-bold text-foreground">AI Build Assistant</h3>
                <p className="text-muted-foreground mb-6 leading-relaxed">
                  Let our advanced AI analyze your needs and budget to craft the perfect specification for you instantly.
                </p>
                <span className="text-primary font-medium flex items-center group-hover:translate-x-2 transition-transform">
                  Try AI Builder <ArrowRight className="ml-2 h-4 w-4" />
                </span>
              </div>
            </Link>

            <Link to="/manual-build" className="group">
              <div className="h-full bg-card rounded-2xl p-8 border border-border shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 relative overflow-hidden">
                <div className="mb-6 inline-flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10 text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                  <Wrench className="h-7 w-7" />
                </div>
                <h3 className="mb-3 text-2xl font-bold text-foreground">Manual Builder</h3>
                <p className="text-muted-foreground mb-6 leading-relaxed">
                  Take full control. Hand-pick every component with our real-time compatibility engine guarding your build.
                </p>
                <span className="text-primary font-medium flex items-center group-hover:translate-x-2 transition-transform">
                  Start Manual Build <ArrowRight className="ml-2 h-4 w-4" />
                </span>
              </div>
            </Link>

            <Link to="/browse-parts" className="group">
              <div className="h-full bg-card rounded-2xl p-8 border border-border shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 relative overflow-hidden">
                <div className="mb-6 inline-flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10 text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                  <Search className="h-7 w-7" />
                </div>
                <h3 className="mb-3 text-2xl font-bold text-foreground">Browse Parts</h3>
                <p className="text-muted-foreground mb-6 leading-relaxed">
                  Explore our massive database of the latest components. Compare specs, prices, and reviews.
                </p>
                <span className="text-primary font-medium flex items-center group-hover:translate-x-2 transition-transform">
                  View Catalog <ArrowRight className="ml-2 h-4 w-4" />
                </span>
              </div>
            </Link>
          </div>
        </section>

        {/* Value Props */}
        <section className="container py-24 bg-secondary/30 border-t border-border">
          <div className="text-center mb-16 max-w-3xl mx-auto">
            <h2 className="text-3xl sm:text-4xl font-bold mb-6 text-foreground">Why Choose PartPicker?</h2>
            <p className="text-lg text-muted-foreground">
              We combine cutting-edge technology with deep hardware knowledge to make PC building accessible to everyone.
            </p>
          </div>

          <div className="grid gap-8 sm:grid-cols-3">
            <div className="text-center p-8 rounded-2xl bg-background border border-border shadow-sm">
              <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">
                <Zap className="h-8 w-8" />
              </div>
              <h3 className="mb-3 text-xl font-bold text-foreground">Lightning Fast</h3>
              <p className="text-muted-foreground leading-relaxed">
                Get build recommendations in seconds, not hours. Our AI processes thousands of combinations instantly.
              </p>
            </div>
            <div className="text-center p-8 rounded-2xl bg-background border border-border shadow-sm">
              <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">
                <ShieldCheck className="h-8 w-8" />
              </div>
              <h3 className="mb-3 text-xl font-bold text-foreground">100% Compatible</h3>
              <p className="text-muted-foreground leading-relaxed">
                Never worry about incompatible parts. Our engine validates every single connection and dimension.
              </p>
            </div>
            <div className="text-center p-8 rounded-2xl bg-background border border-border shadow-sm">
              <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">
                <Cpu className="h-8 w-8" />
              </div>
              <h3 className="mb-3 text-xl font-bold text-foreground">Latest Hardware</h3>
              <p className="text-muted-foreground leading-relaxed">
                Our database is constantly updated with the newest releases from all major manufacturers.
              </p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Home;
