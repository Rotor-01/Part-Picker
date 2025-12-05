import { Link } from 'react-router-dom';
import { Navigation } from '@/components/Navigation';
import { Cpu, Zap, Database, ArrowRight, Sparkles, Wrench } from 'lucide-react';

export default function Home() {
  // Force redeploy
  return (
    <div className="min-h-screen text-foreground relative selection:bg-liquid-blue/30">
      {/* Liquid Background */}
      {/* Desktop Liquid Background */}
      <div className="liquid-bg hidden md:block">
        <div className="liquid-blob bg-liquid-blue w-[500px] h-[500px] top-[-100px] left-[-100px] opacity-40 mix-blend-screen animate-blob"></div>
        <div className="liquid-blob bg-liquid-purple w-[600px] h-[600px] top-[20%] right-[-200px] opacity-30 mix-blend-screen animate-blob animation-delay-2000"></div>
        <div className="liquid-blob bg-liquid-pink w-[400px] h-[400px] bottom-[-100px] left-[20%] opacity-30 mix-blend-screen animate-blob animation-delay-4000"></div>
        <div className="liquid-blob bg-liquid-teal w-[300px] h-[300px] bottom-[10%] right-[10%] opacity-30 mix-blend-screen animate-blob animation-delay-1000"></div>
      </div>

      {/* Mobile Liquid Background (Darker, like AI Build) */}
      <div className="fixed inset-0 pointer-events-none md:hidden">
        <div className="absolute top-[-20%] left-[-10%] w-[800px] h-[800px] bg-liquid-blue/20 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[600px] h-[600px] bg-liquid-purple/20 rounded-full blur-[100px] animate-pulse animation-delay-2000" />
      </div>

      <Navigation />

      {/* Hero Section */}
      <section className="relative min-h-screen flex flex-col justify-center px-4 sm:px-6 lg:px-8 pt-20">
        <div className="max-w-7xl mx-auto w-full text-center z-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-8 animate-fade-in">
            <Sparkles className="w-4 h-4 text-liquid-teal" />
            <span className="text-sm font-medium text-white/80">The Future of PC Building</span>
          </div>

          <h1 className="text-6xl sm:text-7xl md:text-9xl font-bold tracking-tighter mb-8 bg-clip-text text-transparent bg-gradient-to-b from-white to-white/40 animate-slide-up">
            Build Your<br />
            <span className="text-glow">Dream Machine</span>
          </h1>

          <p className="text-xl md:text-2xl text-white/60 max-w-2xl mx-auto mb-12 leading-relaxed animate-slide-up animation-delay-200">
            Experience the next generation of component selection.
            AI-driven, precision-engineered, and beautifully simple.
          </p>

          <div className="flex flex-col sm:flex-row gap-6 justify-center animate-slide-up animation-delay-300">
            <Link
              to="/ai-build"
              className="group relative inline-flex items-center justify-center px-8 py-4 rounded-full bg-white text-black font-bold text-lg hover:scale-105 transition-all duration-300 shadow-glow"
            >
              Start with AI
              <div className="absolute inset-0 rounded-full bg-white/20 blur-lg opacity-0 group-hover:opacity-100 transition-opacity"></div>
            </Link>
            <Link
              to="/manual-build"
              className="group inline-flex items-center justify-center px-8 py-4 rounded-full glass text-white font-bold text-lg hover:bg-white/10 hover:scale-105 transition-all duration-300"
            >
              Manual Studio
            </Link>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-32 px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="glass rounded-3xl p-8 hover:bg-white/10 transition-all duration-500 group">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-liquid-blue to-liquid-teal flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform">
                <Zap className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-4">AI Architect</h3>
              <p className="text-white/60 leading-relaxed">
                Our neural engine analyzes thousands of benchmarks to design the perfect rig for your specific needs.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="glass rounded-3xl p-8 hover:bg-white/10 transition-all duration-500 group">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-liquid-purple to-liquid-pink flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform">
                <Wrench className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-4">Manual Studio</h3>
              <p className="text-white/60 leading-relaxed">
                Take full control with our advanced compatibility checker. Drag, drop, and visualize your build.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="glass rounded-3xl p-8 hover:bg-white/10 transition-all duration-500 group">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-liquid-teal to-liquid-blue flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform">
                <Database className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-4">Vast Catalog</h3>
              <p className="text-white/60 leading-relaxed">
                Access a curated database of premium components with real-time pricing and availability.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-5xl mx-auto glass rounded-[3rem] p-12 md:p-24 text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-liquid-blue/20 to-liquid-purple/20 blur-3xl"></div>
          <div className="relative z-10">
            <h2 className="text-5xl md:text-7xl font-bold mb-8 tracking-tight">Ready to Ascend?</h2>
            <p className="text-xl text-white/60 mb-12 max-w-2xl mx-auto">
              Join thousands of builders who have crafted their dream machines with Trinity.
            </p>
            <Link
              to="/ai-build"
              className="inline-flex items-center justify-center px-12 py-6 rounded-full bg-white text-black font-bold text-xl hover:scale-105 transition-all duration-300 shadow-glow"
            >
              Get Started <ArrowRight className="ml-2 w-6 h-6" />
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 sm:px-6 lg:px-8 relative z-10 border-t border-white/5">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <span className="font-bold text-white/40">Trinity PC Part Picker</span>
          </div>
          <p className="text-sm text-white/20">
            © 2026 Designed in the Future.
          </p>
        </div>
      </footer>
    </div>
  );
}
