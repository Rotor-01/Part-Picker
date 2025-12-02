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
    <div className="min-h-screen flex flex-col bg-white overflow-x-hidden">
      <Navigation />

      <main className="flex-grow">
        {/* Hero Section - Split Layout */}
        <section className="relative pt-12 pb-24 lg:pt-32 lg:pb-40 overflow-hidden">
          <div className="container relative z-10">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              {/* Left Column: Typography & CTA */}
              <div className="text-left space-y-8 animate-fade-in-up">
                <div className="inline-flex items-center rounded-full border border-orange-100 bg-orange-50 px-4 py-1.5 text-sm font-medium text-orange-600">
                  <span className="flex h-2 w-2 rounded-full bg-orange-500 mr-2 animate-pulse"></span>
                  The Future of PC Building
                </div>

                <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-slate-900 leading-[1.1]">
                  Build Your <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-red-500">
                    Perfect Story.
                  </span>
                </h1>

                <p className="text-xl text-slate-500 leading-relaxed max-w-lg">
                  Crafting a PC shouldn't be a puzzle. It should be a creative journey. Let our AI assistant guide you to the perfect machine.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 pt-4">
                  <Button asChild size="lg" className="h-14 px-8 text-lg rounded-full shadow-xl shadow-orange-500/20 hover:shadow-orange-500/30 transition-all hover:-translate-y-1">
                    <Link to="/ai-build">
                      Start Your Build <ArrowRight className="ml-2 h-5 w-5" />
                    </Link>
                  </Button>
                  <Button asChild variant="ghost" size="lg" className="h-14 px-8 text-lg rounded-full text-slate-600 hover:text-orange-600 hover:bg-orange-50">
                    <Link to="/manual-build">Manual Mode</Link>
                  </Button>
                </div>
              </div>

              {/* Right Column: Illustration Placeholder */}
              <div className="relative animate-float hidden lg:block">
                <div className="absolute inset-0 bg-gradient-to-tr from-orange-100 to-blue-50 rounded-full blur-3xl opacity-60 transform scale-110" />
                <div className="relative bg-white rounded-[2.5rem] p-8 shadow-2xl shadow-slate-200/50 border border-slate-100">
                  {/* Abstract UI Representation */}
                  <div className="space-y-6">
                    <div className="flex items-center gap-4 mb-8">
                      <div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center text-orange-600">
                        <Bot className="w-6 h-6" />
                      </div>
                      <div className="space-y-2">
                        <div className="h-4 w-32 bg-slate-100 rounded-full" />
                        <div className="h-3 w-24 bg-slate-50 rounded-full" />
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex items-center gap-4">
                        <div className="w-10 h-10 rounded-lg bg-white shadow-sm" />
                        <div className="flex-1 space-y-2">
                          <div className="h-3 w-3/4 bg-slate-200 rounded-full" />
                          <div className="h-2 w-1/2 bg-slate-100 rounded-full" />
                        </div>
                      </div>
                      <div className="p-4 rounded-2xl bg-white border border-slate-100 shadow-lg shadow-slate-200/50 flex items-center gap-4 transform translate-x-4">
                        <div className="w-10 h-10 rounded-lg bg-orange-500 shadow-sm flex items-center justify-center text-white">
                          <Cpu className="w-6 h-6" />
                        </div>
                        <div className="flex-1 space-y-2">
                          <div className="h-3 w-3/4 bg-slate-800 rounded-full" />
                          <div className="h-2 w-1/2 bg-slate-200 rounded-full" />
                        </div>
                        <div className="text-orange-500 font-bold text-sm">98% Match</div>
                      </div>
                      <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex items-center gap-4">
                        <div className="w-10 h-10 rounded-lg bg-white shadow-sm" />
                        <div className="flex-1 space-y-2">
                          <div className="h-3 w-3/4 bg-slate-200 rounded-full" />
                          <div className="h-2 w-1/2 bg-slate-100 rounded-full" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Wave Separator */}
          <div className="absolute bottom-0 left-0 right-0">
            <svg className="fill-slate-50" viewBox="0 0 1440 120">
              <path d="M0,64L80,69.3C160,75,320,85,480,80C640,75,800,53,960,48C1120,43,1280,53,1360,58.7L1440,64L1440,320L1360,320C1280,320,1120,320,960,320C800,320,640,320,480,320C320,320,160,320,80,320L0,320Z"></path>
            </svg>
          </div>
        </section>

        {/* Features Grid */}
        <section className="py-24 bg-slate-50 relative z-10">
          <div className="container">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <h2 className="text-3xl font-bold text-slate-900 mb-4">Designed for Creators</h2>
              <p className="text-slate-500 text-lg">Whether you're a gamer, designer, or developer, we have the tools to build your perfect workspace.</p>
            </div>

            <div className="grid gap-8 md:grid-cols-3">
              <Link to="/ai-build" className="group">
                <div className="h-full bg-white rounded-3xl p-8 shadow-xl shadow-slate-200/40 hover:shadow-2xl hover:shadow-orange-500/10 hover:-translate-y-2 transition-all duration-300 border border-slate-100">
                  <div className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-orange-50 text-orange-600 group-hover:bg-orange-500 group-hover:text-white transition-colors duration-300">
                    <Bot className="h-8 w-8" />
                  </div>
                  <h3 className="mb-3 text-2xl font-bold text-slate-900">Creative Assistant</h3>
                  <p className="text-slate-500 mb-6 leading-relaxed">
                    Tell our AI what you want to create. It will design a machine tailored to your specific workflow.
                  </p>
                  <span className="text-orange-600 font-semibold flex items-center group-hover:translate-x-2 transition-transform">
                    Try AI Builder <ArrowRight className="ml-2 h-4 w-4" />
                  </span>
                </div>
              </Link>

              <Link to="/manual-build" className="group">
                <div className="h-full bg-white rounded-3xl p-8 shadow-xl shadow-slate-200/40 hover:shadow-2xl hover:shadow-blue-500/10 hover:-translate-y-2 transition-all duration-300 border border-slate-100">
                  <div className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 group-hover:bg-blue-500 group-hover:text-white transition-colors duration-300">
                    <Wrench className="h-8 w-8" />
                  </div>
                  <h3 className="mb-3 text-2xl font-bold text-slate-900">Manual Studio</h3>
                  <p className="text-slate-500 mb-6 leading-relaxed">
                    For the experts. Hand-pick every component with our real-time compatibility engine.
                  </p>
                  <span className="text-blue-600 font-semibold flex items-center group-hover:translate-x-2 transition-transform">
                    Start Manual Build <ArrowRight className="ml-2 h-4 w-4" />
                  </span>
                </div>
              </Link>

              <Link to="/browse-parts" className="group">
                <div className="h-full bg-white rounded-3xl p-8 shadow-xl shadow-slate-200/40 hover:shadow-2xl hover:shadow-purple-500/10 hover:-translate-y-2 transition-all duration-300 border border-slate-100">
                  <div className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-purple-50 text-purple-600 group-hover:bg-purple-500 group-hover:text-white transition-colors duration-300">
                    <Search className="h-8 w-8" />
                  </div>
                  <h3 className="mb-3 text-2xl font-bold text-slate-900">Part Catalog</h3>
                  <p className="text-slate-500 mb-6 leading-relaxed">
                    Explore our curated database of premium components. Compare specs and prices instantly.
                  </p>
                  <span className="text-purple-600 font-semibold flex items-center group-hover:translate-x-2 transition-transform">
                    View Catalog <ArrowRight className="ml-2 h-4 w-4" />
                  </span>
                </div>
              </Link>
            </div>
          </div>
        </section>

        {/* Value Props */}
        <section className="py-24 bg-white">
          <div className="container">
            <div className="grid gap-12 sm:grid-cols-3">
              <div className="text-center p-6">
                <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-orange-100 text-orange-600">
                  <Zap className="h-8 w-8" />
                </div>
                <h3 className="mb-3 text-xl font-bold text-slate-900">Lightning Fast</h3>
                <p className="text-slate-500 leading-relaxed">
                  Get build recommendations in seconds, not hours. Our AI processes thousands of combinations instantly.
                </p>
              </div>
              <div className="text-center p-6">
                <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-green-600">
                  <ShieldCheck className="h-8 w-8" />
                </div>
                <h3 className="mb-3 text-xl font-bold text-slate-900">100% Compatible</h3>
                <p className="text-slate-500 leading-relaxed">
                  Never worry about incompatible parts. Our engine validates every single connection and dimension.
                </p>
              </div>
              <div className="text-center p-6">
                <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-blue-100 text-blue-600">
                  <Cpu className="h-8 w-8" />
                </div>
                <h3 className="mb-3 text-xl font-bold text-slate-900">Latest Hardware</h3>
                <p className="text-slate-500 leading-relaxed">
                  Our database is constantly updated with the newest releases from all major manufacturers.
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
