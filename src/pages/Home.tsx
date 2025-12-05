import { Link } from 'react-router-dom';
import { Navigation } from '@/components/Navigation';
import { Cpu, Zap, Database, Save } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto text-center">
          <div className="animate-fade-in">
            <h1 className="text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-bold text-foreground leading-none tracking-tight mb-8">
              Build Your
              <br />
              <span className="text-primary">Dream PC</span>
            </h1>
            <p className="text-lg sm:text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto mb-12 leading-relaxed">
              AI-powered recommendations meet manual precision.
              The smartest way to configure your perfect computer.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link
                to="/ai-build"
                className="px-8 py-4 bg-primary text-primary-foreground rounded-full font-semibold text-lg hover:bg-primary/90 transition-all duration-200 hover:scale-105 shadow-medium"
              >
                Start with AI
              </Link>
              <Link
                to="/manual-build"
                className="px-8 py-4 bg-secondary text-secondary-foreground rounded-full font-semibold text-lg hover:bg-secondary/80 transition-all duration-200 hover:scale-105"
              >
                Manual Builder
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-secondary/30">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold text-center mb-16 text-foreground">
            Everything You Need
          </h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <FeatureCard
              icon={<Zap className="w-12 h-12 text-primary" />}
              title="AI Architect"
              description="Describe your needs, get instant build recommendations powered by advanced AI."
            />
            <FeatureCard
              icon={<Cpu className="w-12 h-12 text-primary" />}
              title="Manual Studio"
              description="Hand-pick every component with real-time compatibility checking."
            />
            <FeatureCard
              icon={<Database className="w-12 h-12 text-primary" />}
              title="Vast Catalog"
              description="Browse thousands of parts with detailed specs and competitive pricing."
            />
            <FeatureCard
              icon={<Save className="w-12 h-12 text-primary" />}
              title="Save & Share"
              description="Keep your builds organized and share configurations with friends."
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl sm:text-5xl font-bold mb-6 text-foreground">
            Ready to Build?
          </h2>
          <p className="text-xl text-muted-foreground mb-8">
            Join thousands of builders creating their perfect PC
          </p>
          <Link
            to="/ai-build"
            className="inline-block px-8 py-4 bg-primary text-primary-foreground rounded-full font-semibold text-lg hover:bg-primary/90 transition-all duration-200 hover:scale-105 shadow-medium"
          >
            Get Started Now
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center text-muted-foreground">
          <p className="text-sm">
            © 2024 TRINITY PC Part Picker. Built with precision and care.
          </p>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="bg-white border border-border rounded-lg p-8 hover:-translate-y-1 transition-all duration-200 hover:shadow-large group">
      <div className="mb-4 transition-transform group-hover:scale-110 duration-200">
        {icon}
      </div>
      <h3 className="text-xl font-bold mb-3 text-foreground">{title}</h3>
      <p className="text-muted-foreground leading-relaxed">{description}</p>
    </div>
  );
}
