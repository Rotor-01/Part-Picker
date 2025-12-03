import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Bot, Wrench, Search, ArrowRight, Cpu, Zap, ShieldCheck } from "lucide-react";
import Navigation from "@/components/Navigation";

const Home = () => {
  return (
    <div className="min-h-screen flex flex-col bg-background font-sans selection:bg-primary/10 selection:text-primary">
      <Navigation />

      <main className="flex-grow">
        {/* Hero Section */}
        <section className="relative pt-20 pb-32 md:pt-32 md:pb-48 overflow-hidden">
          <div className="container relative z-10">
            <div className="flex flex-col items-center text-center max-w-5xl mx-auto animate-fade-in">
              <div className="inline-flex items-center px-3 py-1 rounded-full bg-secondary text-secondary-foreground text-xs font-medium tracking-wide mb-8">
                The Future of PC Building
              </div>

              <h1 className="text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-bold tracking-tighter text-foreground leading-[0.9] mb-8 font-display">
                BUILD YOUR <br />
                <span className="text-primary">PERFECT</span> MACHINE.
              </h1>

              <p className="text-xl sm:text-2xl text-muted-foreground max-w-2xl mb-12 font-light leading-relaxed">
                Crafting a PC shouldn't be a puzzle. It should be a statement.
                Let our AI assistant guide you to the ultimate build.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
                <Button asChild size="lg" className="h-14 px-8 text-lg rounded-full shadow-medium hover:shadow-large transition-all duration-300">
                  <Link to="/ai-build">
                    Start Building <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="h-14 px-8 text-lg rounded-full border-border hover:bg-secondary transition-all duration-300">
                  <Link to="/manual-build">Manual Studio</Link>
                </Button>
              </div>
            </div>
          </div>

          {/* Subtle Background Element */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-3xl -z-10 pointer-events-none"></div>
        </section>

        {/* Features Grid */}
        <section className="py-24 bg-secondary/30 border-y border-border/50">
          <div className="container">
            <div className="grid md:grid-cols-3 gap-8">
              <Link to="/ai-build" className="group relative bg-background p-10 rounded-2xl border border-border/50 shadow-subtle hover:shadow-medium hover:-translate-y-1 transition-all duration-300">
                <div className="mb-6 inline-flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10 text-primary group-hover:bg-primary group-hover:text-white transition-colors duration-300">
                  <Bot className="h-7 w-7" />
                </div>
                <h3 className="mb-3 text-2xl font-bold tracking-tight">AI Architect</h3>
                <p className="text-muted-foreground mb-6 leading-relaxed">
                  Tell our AI what you want to create. It will design a machine tailored to your specific workflow.
                </p>
                <span className="font-medium text-primary flex items-center group-hover:gap-2 transition-all">
                  Try Builder <ArrowRight className="ml-2 h-4 w-4" />
                </span>
              </Link>

              <Link to="/manual-build" className="group relative bg-background p-10 rounded-2xl border border-border/50 shadow-subtle hover:shadow-medium hover:-translate-y-1 transition-all duration-300">
                <div className="mb-6 inline-flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10 text-primary group-hover:bg-primary group-hover:text-white transition-colors duration-300">
                  <Wrench className="h-7 w-7" />
                </div>
                <h3 className="mb-3 text-2xl font-bold tracking-tight">Manual Studio</h3>
                <p className="text-muted-foreground mb-6 leading-relaxed">
                  For the experts. Hand-pick every component with our real-time compatibility engine.
                </p>
                <span className="font-medium text-primary flex items-center group-hover:gap-2 transition-all">
                  Start Manual <ArrowRight className="ml-2 h-4 w-4" />
                </span>
              </Link>

              <Link to="/browse-parts" className="group relative bg-background p-10 rounded-2xl border border-border/50 shadow-subtle hover:shadow-medium hover:-translate-y-1 transition-all duration-300">
                <div className="mb-6 inline-flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10 text-primary group-hover:bg-primary group-hover:text-white transition-colors duration-300">
                  <Search className="h-7 w-7" />
                </div>
                <h3 className="mb-3 text-2xl font-bold tracking-tight">Part Catalog</h3>
                <p className="text-muted-foreground mb-6 leading-relaxed">
                  Explore our curated database of premium components. Compare specs and prices instantly.
                </p>
                <span className="font-medium text-primary flex items-center group-hover:gap-2 transition-all">
                  View Catalog <ArrowRight className="ml-2 h-4 w-4" />
                </span>
              </Link>
            </div>
          </div>
        </section>

        {/* Value Props */}
        <section className="py-24 bg-background">
          <div className="container">
            <div className="grid gap-12 md:grid-cols-3 text-center">
              <div className="flex flex-col items-center">
                <div className="mb-6 p-4 rounded-full bg-secondary text-foreground">
                  <Zap className="h-8 w-8" />
                </div>
                <h3 className="mb-2 text-xl font-bold">Lightning Fast</h3>
                <p className="text-muted-foreground">
                  Get build recommendations in seconds.
                </p>
              </div>
              <div className="flex flex-col items-center">
                <div className="mb-6 p-4 rounded-full bg-secondary text-foreground">
                  <ShieldCheck className="h-8 w-8" />
                </div>
                <h3 className="mb-2 text-xl font-bold">100% Compatible</h3>
                <p className="text-muted-foreground">
                  Validated connections and dimensions.
                </p>
              </div>
              <div className="flex flex-col items-center">
                <div className="mb-6 p-4 rounded-full bg-secondary text-foreground">
                  <Cpu className="h-8 w-8" />
                </div>
                <h3 className="mb-2 text-xl font-bold">Latest Hardware</h3>
                <p className="text-muted-foreground">
                  Constantly updated database.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Home;
