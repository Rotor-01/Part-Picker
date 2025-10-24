import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Bot, Wrench, Search } from "lucide-react";
import Navigation from "@/components/Navigation";

const Home = () => {
  return (
    <div className="min-h-screen">
      <Navigation />
      
      <main className="container py-20">
        <section className="mb-20 text-center">
          <h1 className="mb-6 text-6xl font-bold text-gradient">
            Build Your Dream PC
          </h1>
          <p className="mx-auto mb-12 max-w-2xl text-xl text-muted-foreground">
            AI-Powered Recommendations or Manual Selection - Perfect Compatibility Guaranteed
          </p>
          
          <div className="grid gap-8 md:grid-cols-3">
            <Card className="group card-gradient border-border transition-all hover:glow hover:border-primary">
              <CardContent className="p-8 text-center">
                <div className="mb-6 inline-flex h-20 w-20 items-center justify-center rounded-full bg-primary/10 transition-all group-hover:bg-primary/20">
                  <Bot className="h-10 w-10 text-primary" />
                </div>
                <h3 className="mb-4 text-2xl font-bold">AI Build Assistant</h3>
                <p className="mb-6 text-muted-foreground">
                  Get personalized PC builds based on your budget, use case, and preferences with our intelligent AI.
                </p>
                <Button asChild className="w-full">
                  <Link to="/ai-build">Try AI Builder</Link>
                </Button>
              </CardContent>
            </Card>
            
            <Card className="group card-gradient border-border transition-all hover:glow hover:border-primary">
              <CardContent className="p-8 text-center">
                <div className="mb-6 inline-flex h-20 w-20 items-center justify-center rounded-full bg-primary/10 transition-all group-hover:bg-primary/20">
                  <Wrench className="h-10 w-10 text-primary" />
                </div>
                <h3 className="mb-4 text-2xl font-bold">Manual Builder</h3>
                <p className="mb-6 text-muted-foreground">
                  Hand-pick every component with our compatibility checker ensuring your build works perfectly.
                </p>
                <Button asChild className="w-full">
                  <Link to="/manual-build">Start Building</Link>
                </Button>
              </CardContent>
            </Card>
            
            <Card className="group card-gradient border-border transition-all hover:glow hover:border-primary">
              <CardContent className="p-8 text-center">
                <div className="mb-6 inline-flex h-20 w-20 items-center justify-center rounded-full bg-primary/10 transition-all group-hover:bg-primary/20">
                  <Search className="h-10 w-10 text-primary" />
                </div>
                <h3 className="mb-4 text-2xl font-bold">Browse Parts</h3>
                <p className="mb-6 text-muted-foreground">
                  Explore our extensive catalog of CPUs, GPUs, motherboards, and more with detailed specifications.
                </p>
                <Button asChild className="w-full">
                  <Link to="/browse-parts">View Catalog</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </section>
        
        <section className="rounded-2xl border border-border bg-card p-12 text-center">
          <h2 className="mb-6 text-4xl font-bold">About PC Part Picker</h2>
          <p className="mx-auto mb-8 max-w-3xl text-lg text-muted-foreground">
            This tool helps you build the perfect PC with AI recommendations or manual component selection. 
            Ensure compatibility and get the best performance for your needs.
          </p>
          <div className="grid gap-6 md:grid-cols-3">
            <div className="rounded-lg bg-secondary p-6">
              <h3 className="mb-2 text-xl font-bold">AI-Powered</h3>
              <p className="text-sm text-muted-foreground">Smart recommendations using Google Gemini</p>
            </div>
            <div className="rounded-lg bg-secondary p-6">
              <h3 className="mb-2 text-xl font-bold">Compatibility Check</h3>
              <p className="text-sm text-muted-foreground">Automatic validation of all components</p>
            </div>
            <div className="rounded-lg bg-secondary p-6">
              <h3 className="mb-2 text-xl font-bold">Extensive Catalog</h3>
              <p className="text-sm text-muted-foreground">Latest CPUs, GPUs, and components</p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Home;
