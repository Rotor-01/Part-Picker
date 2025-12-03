import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Bot, Wrench, Search, ArrowRight, Cpu, Zap, ShieldCheck } from "lucide-react";
import Navigation from "@/components/Navigation";

const Home = () => {
  return (
    <div className="min-h-screen flex flex-col bg-background overflow-x-hidden font-sans">
      <Navigation />

      <main className="flex-grow">
        {/* Hero Section */}
        <section className="relative pt-20 pb-32 border-b border-border">
          <div className="container relative z-10">
            <div className="flex flex-col items-start max-w-5xl">
              <div className="inline-flex items-center border-2 border-primary px-4 py-2 text-sm font-bold uppercase tracking-widest mb-8 bg-accent text-accent-foreground transform -rotate-1">
                The Future of PC Building
              </div>

              <h1 className="text-7xl sm:text-8xl lg:text-9xl font-bold uppercase tracking-tighter text-foreground leading-[0.85] mb-8 font-display">
                BUILD YOUR <br />
                <span className="text-transparent text-stroke">PERFECT</span> <br />
                MACHINE.
              </h1>

              <p className="text-xl sm:text-2xl text-muted-foreground max-w-2xl mb-12 font-light border-l-4 border-accent pl-6">
                Crafting a PC shouldn't be a puzzle. It should be a statement.
                Let our AI assistant guide you to the ultimate build.
              </p>

              <div className="flex flex-col sm:flex-row gap-6 w-full sm:w-auto">
                <Button asChild size="lg" className="h-16 px-10 text-xl font-bold uppercase tracking-wider rounded-none bg-primary text-primary-foreground hover:bg-accent hover:text-accent-foreground hover:translate-x-1 hover:-translate-y-1 transition-all border-2 border-transparent hover:border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                  <Link to="/ai-build">
                    Start Building <ArrowRight className="ml-2 h-6 w-6" />
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="h-16 px-10 text-xl font-bold uppercase tracking-wider rounded-none border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground hover:translate-x-1 hover:-translate-y-1 transition-all shadow-[4px_4px_0px_0px_rgba(0,0,0,0)] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                  <Link to="/manual-build">Manual Mode</Link>
                </Button>
              </div>
            </div>
          </div>

          {/* Decorative Grid Background */}
          <div className="absolute inset-0 -z-10 opacity-[0.03]"
            style={{ backgroundImage: 'linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)', backgroundSize: '40px 40px' }}>
          </div>
        </section>

        {/* Features Grid */}
        <section className="py-0 border-b border-border">
          <div className="grid md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-border">
            <Link to="/ai-build" className="group relative h-full bg-background p-12 hover:bg-accent hover:text-accent-foreground transition-colors duration-300">
              <div className="mb-8 inline-flex h-20 w-20 items-center justify-center border-2 border-current rounded-none">
                <Bot className="h-10 w-10" />
              </div>
              <h3 className="mb-4 text-3xl font-bold uppercase tracking-tight font-display">AI Assistant</h3>
              <p className="text-lg mb-8 opacity-80 leading-relaxed">
                Tell our AI what you want to create. It will design a machine tailored to your specific workflow.
              </p>
              <span className="font-bold uppercase tracking-widest flex items-center group-hover:gap-4 transition-all">
                Try Builder <ArrowRight className="ml-2 h-5 w-5" />
              </span>
            </Link>

            <Link to="/manual-build" className="group relative h-full bg-background p-12 hover:bg-primary hover:text-primary-foreground transition-colors duration-300">
              <div className="mb-8 inline-flex h-20 w-20 items-center justify-center border-2 border-current rounded-none">
                <Wrench className="h-10 w-10" />
              </div>
              <h3 className="mb-4 text-3xl font-bold uppercase tracking-tight font-display">Manual Studio</h3>
              <p className="text-lg mb-8 opacity-80 leading-relaxed">
                For the experts. Hand-pick every component with our real-time compatibility engine.
              </p>
              <span className="font-bold uppercase tracking-widest flex items-center group-hover:gap-4 transition-all">
                Start Manual <ArrowRight className="ml-2 h-5 w-5" />
              </span>
            </Link>

            <Link to="/browse-parts" className="group relative h-full bg-background p-12 hover:bg-foreground hover:text-background transition-colors duration-300">
              <div className="mb-8 inline-flex h-20 w-20 items-center justify-center border-2 border-current rounded-none">
                <Search className="h-10 w-10" />
              </div>
              <h3 className="mb-4 text-3xl font-bold uppercase tracking-tight font-display">Part Catalog</h3>
              <p className="text-lg mb-8 opacity-80 leading-relaxed">
                Explore our curated database of premium components. Compare specs and prices instantly.
              </p>
              <span className="font-bold uppercase tracking-widest flex items-center group-hover:gap-4 transition-all">
                View Catalog <ArrowRight className="ml-2 h-5 w-5" />
              </span>
            </Link>
          </div>
        </section>

        {/* Value Props - Marquee Style */}
        <section className="py-24 bg-background overflow-hidden">
          <div className="container">
            <div className="grid gap-12 md:grid-cols-3">
              <div className="border-l-2 border-primary pl-6">
                <div className="mb-6 text-accent">
                  <Zap className="h-12 w-12" />
                </div>
                <h3 className="mb-2 text-2xl font-bold uppercase font-display">Lightning Fast</h3>
                <p className="text-muted-foreground text-lg">
                  Get build recommendations in seconds.
                </p>
              </div>
              <div className="border-l-2 border-primary pl-6">
                <div className="mb-6 text-accent">
                  <ShieldCheck className="h-12 w-12" />
                </div>
                <h3 className="mb-2 text-2xl font-bold uppercase font-display">100% Compatible</h3>
                <p className="text-muted-foreground text-lg">
                  Validated connections and dimensions.
                </p>
              </div>
              <div className="border-l-2 border-primary pl-6">
                <div className="mb-6 text-accent">
                  <Cpu className="h-12 w-12" />
                </div>
                <h3 className="mb-2 text-2xl font-bold uppercase font-display">Latest Hardware</h3>
                <p className="text-muted-foreground text-lg">
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
