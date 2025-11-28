import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Bot, Wrench, Search, ArrowRight, Cpu, Zap, ShieldCheck } from "lucide-react";
import Navigation from "@/components/Navigation";

const Home = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />

      <main className="flex-grow">
        {/* Hero Section */}
        <section className="relative overflow-hidden py-20 sm:py-32 lg:py-40">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary/20 via-background to-background z-0" />
          <div className="container relative z-10 text-center">
            <div className="inline-flex items-center rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-sm font-medium text-primary mb-8 backdrop-blur-sm animate-in fade-in slide-in-from-bottom-4 duration-1000">
              <span className="flex h-2 w-2 rounded-full bg-primary mr-2 animate-pulse"></span>
              Next-Gen PC Building
            </div>
            <h1 className="mb-6 text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-white animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-100">
              Build Your <span className="text-gradient">Dream Machine</span>
            </h1>
            <p className="mx-auto mb-10 max-w-2xl text-lg sm:text-xl text-muted-foreground animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-200">
              Experience the future of PC building. Whether you want AI-powered recommendations or granular manual control, we ensure perfect compatibility and performance.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-300">
              <Button asChild size="lg" className="h-12 px-8 text-lg bg-primary hover:bg-primary/90 shadow-lg shadow-primary/25">
                <Link to="/ai-build">
                  Start AI Build <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="h-12 px-8 text-lg border-primary/20 hover:bg-primary/5 hover:text-primary">
                <Link to="/manual-build">Manual Mode</Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Features Grid */}
        <section className="container py-20 relative z-10">
          <div className="grid gap-8 md:grid-cols-3">
            <Link to="/ai-build" className="group">
              <div className="h-full glass-panel rounded-2xl p-8 transition-all duration-300 hover:-translate-y-2 hover:shadow-glow hover:border-primary/50 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                  <Bot className="h-32 w-32 text-primary" />
                </div>
                <div className="relative z-10">
                  <div className="mb-6 inline-flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10 text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                    <Bot className="h-7 w-7" />
                  </div>
                  <h3 className="mb-3 text-2xl font-bold">AI Build Assistant</h3>
                  <p className="text-muted-foreground mb-6">
                    Let our advanced AI analyze your needs and budget to craft the perfect specification for you instantly.
                  </p>
                  <span className="text-primary font-medium flex items-center group-hover:translate-x-2 transition-transform">
                    Try AI Builder <ArrowRight className="ml-2 h-4 w-4" />
                  </span>
                </div>
              </div>
            </Link>

            <Link to="/manual-build" className="group">
              <div className="h-full glass-panel rounded-2xl p-8 transition-all duration-300 hover:-translate-y-2 hover:shadow-glow hover:border-primary/50 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                  <Wrench className="h-32 w-32 text-primary" />
                </div>
                <div className="relative z-10">
                  <div className="mb-6 inline-flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10 text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                    <Wrench className="h-7 w-7" />
                  </div>
                  <h3 className="mb-3 text-2xl font-bold">Manual Builder</h3>
                  <p className="text-muted-foreground mb-6">
                    Take full control. Hand-pick every component with our real-time compatibility engine guarding your build.
                  </p>
                  <span className="text-primary font-medium flex items-center group-hover:translate-x-2 transition-transform">
                    Start Manual Build <ArrowRight className="ml-2 h-4 w-4" />
                  </span>
                </div>
              </div>
            </Link>

            <Link to="/browse-parts" className="group">
              <div className="h-full glass-panel rounded-2xl p-8 transition-all duration-300 hover:-translate-y-2 hover:shadow-glow hover:border-primary/50 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                  <Search className="h-32 w-32 text-primary" />
                </div>
                <div className="relative z-10">
                  <div className="mb-6 inline-flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10 text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                    <Search className="h-7 w-7" />
                  </div>
                  <h3 className="mb-3 text-2xl font-bold">Browse Parts</h3>
                  <p className="text-muted-foreground mb-6">
                    Explore our massive database of the latest components. Compare specs, prices, and reviews.
                  </p>
                  <span className="text-primary font-medium flex items-center group-hover:translate-x-2 transition-transform">
                    View Catalog <ArrowRight className="ml-2 h-4 w-4" />
                  </span>
                </div>
              </div>
            </Link>
          </div>
        </section>

        {/* Value Props */}
        <section className="container py-20 border-t border-white/5">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">Why Choose PartPicker?</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              We combine cutting-edge technology with deep hardware knowledge to make PC building accessible to everyone.
            </p>
          </div>

          <div className="grid gap-8 sm:grid-cols-3">
            <div className="text-center p-6 rounded-2xl bg-secondary/30 border border-white/5">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                <Zap className="h-6 w-6" />
              </div>
              <h3 className="mb-2 text-xl font-bold">Lightning Fast</h3>
              <p className="text-sm text-muted-foreground">
                Get build recommendations in seconds, not hours. Our AI processes thousands of combinations instantly.
              </p>
            </div>
            <div className="text-center p-6 rounded-2xl bg-secondary/30 border border-white/5">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                <ShieldCheck className="h-6 w-6" />
              </div>
              <h3 className="mb-2 text-xl font-bold">100% Compatible</h3>
              <p className="text-sm text-muted-foreground">
                Never worry about incompatible parts. Our engine validates every single connection and dimension.
              </p>
            </div>
            <div className="text-center p-6 rounded-2xl bg-secondary/30 border border-white/5">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                <Cpu className="h-6 w-6" />
              </div>
              <h3 className="mb-2 text-xl font-bold">Latest Hardware</h3>
              <p className="text-sm text-muted-foreground">
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
