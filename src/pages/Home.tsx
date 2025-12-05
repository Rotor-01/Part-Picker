import { Link } from 'react-router-dom';
import { Navigation } from '@/components/Navigation';
import { Cpu, Zap, Database, Save, ArrowRight } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      <Navigation />

      {/* Hero Section */}
      <section className="relative min-h-[85vh] flex flex-col justify-center px-4 sm:px-6 lg:px-12 border-b-2 border-foreground">
        <div className="max-w-[1920px] mx-auto w-full">
          <div className="animate-fade-in space-y-6">
            <h1 className="text-7xl sm:text-8xl md:text-9xl lg:text-[10rem] font-bold leading-[0.85] tracking-tighter uppercase">
              Build<br />
              <span className="text-stroke hover:text-primary transition-colors duration-500">Your</span><br />
              Dream PC
            </h1>

            <div className="flex flex-col md:flex-row items-start md:items-center justify-between mt-12 gap-8">
              <p className="text-xl md:text-2xl font-medium max-w-xl leading-relaxed border-l-4 border-primary pl-6">
                AI-powered recommendations meet manual precision.
                The smartest way to configure your perfect computer.
              </p>

              <div className="flex flex-col sm:flex-row gap-6 w-full md:w-auto">
                <Link
                  to="/ai-build"
                  className="group relative inline-flex items-center justify-center px-8 py-6 bg-foreground text-background font-bold text-xl uppercase tracking-wider hover:-translate-y-1 hover:shadow-medium transition-all duration-200 border-2 border-foreground"
                >
                  Start with AI
                  <ArrowRight className="ml-3 w-6 h-6 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link
                  to="/manual-build"
                  className="group inline-flex items-center justify-center px-8 py-6 bg-background text-foreground font-bold text-xl uppercase tracking-wider border-2 border-foreground hover:bg-secondary hover:-translate-y-1 hover:shadow-medium transition-all duration-200"
                >
                  Manual Builder
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid - Asymmetric */}
      <section className="border-b-2 border-foreground">
        <div className="grid grid-cols-1 md:grid-cols-12 min-h-[600px]">
          {/* Large Feature */}
          <div className="md:col-span-7 lg:col-span-8 p-12 border-b-2 md:border-b-0 md:border-r-2 border-foreground flex flex-col justify-between hover:bg-secondary transition-colors group">
            <Zap className="w-24 h-24 text-primary mb-8 group-hover:scale-110 transition-transform duration-300" />
            <div>
              <h2 className="text-5xl md:text-7xl font-bold uppercase tracking-tighter mb-6">AI Architect</h2>
              <p className="text-2xl text-foreground/80 max-w-2xl leading-relaxed">
                Describe your needs in plain English. Our intelligence engine designs the perfect specification instantly.
              </p>
            </div>
          </div>

          {/* Stacked Features */}
          <div className="md:col-span-5 lg:col-span-4 flex flex-col">
            <div className="flex-1 p-10 border-b-2 border-foreground hover:bg-primary hover:text-white transition-colors group">
              <Cpu className="w-12 h-12 mb-4" />
              <h3 className="text-3xl font-bold uppercase mb-2">Manual Studio</h3>
              <p className="text-lg opacity-90">Hand-pick every component with real-time compatibility checking.</p>
            </div>
            <div className="flex-1 p-10 border-b-2 border-foreground hover:bg-foreground hover:text-background transition-colors group">
              <Database className="w-12 h-12 mb-4" />
              <h3 className="text-3xl font-bold uppercase mb-2">Vast Catalog</h3>
              <p className="text-lg opacity-90">Browse thousands of parts with detailed specs and competitive pricing.</p>
            </div>
            <div className="flex-1 p-10 hover:bg-secondary transition-colors group">
              <Save className="w-12 h-12 mb-4 text-primary" />
              <h3 className="text-3xl font-bold uppercase mb-2">Save & Share</h3>
              <p className="text-lg opacity-90">Keep your builds organized and share configurations with friends.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 px-4 sm:px-6 lg:px-8 bg-foreground text-background">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-6xl sm:text-8xl font-bold mb-12 uppercase tracking-tighter">
            Ready to Build?
          </h2>
          <Link
            to="/ai-build"
            className="inline-block px-12 py-6 bg-primary text-white border-2 border-white font-bold text-2xl uppercase tracking-widest hover:bg-white hover:text-primary hover:scale-105 transition-all duration-300 shadow-[8px_8px_0px_0px_rgba(255,255,255,1)]"
          >
            Get Started Now
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 sm:px-6 lg:px-8 border-t-2 border-foreground">
        <div className="max-w-[1920px] mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-primary"></div>
            <span className="font-bold uppercase tracking-widest">Trinity PC Part Picker</span>
          </div>
          <p className="text-sm font-medium uppercase tracking-wider opacity-60">
            © 2024 Built with precision.
          </p>
        </div>
      </footer>
    </div>
  );
}
