import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Bot, Wrench, Search } from "lucide-react";
import Navigation from "@/components/Navigation";

const Home = () => {
  return (
    <div className="min-h-screen">
      <Navigation />
      
      <main className="container py-8 sm:py-12 lg:py-20">
        <section className="mb-12 sm:mb-16 lg:mb-20 text-center">
          <h1 className="mb-4 sm:mb-6 text-3xl sm:text-4xl lg:text-6xl font-bold text-gradient">
            Build Your Dream PC
          </h1>
          <p className="mx-auto mb-8 sm:mb-12 max-w-2xl text-base sm:text-lg lg:text-xl text-muted-foreground px-4">
            AI-Powered Recommendations or Manual Selection - Perfect Compatibility Guaranteed
          </p>
          
          <div className="grid gap-6 sm:gap-8 md:grid-cols-2 lg:grid-cols-3">
            <Card className="group card-gradient border-border transition-all hover:glow hover:border-primary flex flex-col h-full">
              <CardContent className="p-6 sm:p-8 text-center flex flex-col h-full">
                <div className="mb-4 sm:mb-6 inline-flex h-16 w-16 sm:h-20 sm:w-20 items-center justify-center rounded-full bg-primary/10 transition-all group-hover:bg-primary/20 mx-auto">
                  <Bot className="h-8 w-8 sm:h-10 sm:w-10 text-primary" />
                </div>
                <h3 className="mb-3 sm:mb-4 text-xl sm:text-2xl font-bold">AI Build Assistant</h3>
                <p className="mb-4 sm:mb-6 text-sm sm:text-base text-muted-foreground flex-grow">
                  Get personalized PC builds based on your budget, use case, and preferences with our intelligent AI.
                </p>
                <Button asChild className="w-full mt-auto">
                  <Link to="/ai-build">Try AI Builder</Link>
                </Button>
              </CardContent>
            </Card>
            
            <Card className="group card-gradient border-border transition-all hover:glow hover:border-primary flex flex-col h-full">
              <CardContent className="p-6 sm:p-8 text-center flex flex-col h-full">
                <div className="mb-4 sm:mb-6 inline-flex h-16 w-16 sm:h-20 sm:w-20 items-center justify-center rounded-full bg-primary/10 transition-all group-hover:bg-primary/20 mx-auto">
                  <Wrench className="h-8 w-8 sm:h-10 sm:w-10 text-primary" />
                </div>
                <h3 className="mb-3 sm:mb-4 text-xl sm:text-2xl font-bold">Manual Builder</h3>
                <p className="mb-4 sm:mb-6 text-sm sm:text-base text-muted-foreground flex-grow">
                  Hand-pick every component with our compatibility checker ensuring your build works perfectly.
                </p>
                <Button asChild className="w-full mt-auto">
                  <Link to="/manual-build">Start Building</Link>
                </Button>
              </CardContent>
            </Card>
            
            <Card className="group card-gradient border-border transition-all hover:glow hover:border-primary flex flex-col h-full">
              <CardContent className="p-6 sm:p-8 text-center flex flex-col h-full">
                <div className="mb-4 sm:mb-6 inline-flex h-16 w-16 sm:h-20 sm:w-20 items-center justify-center rounded-full bg-primary/10 transition-all group-hover:bg-primary/20 mx-auto">
                  <Search className="h-8 w-8 sm:h-10 sm:w-10 text-primary" />
                </div>
                <h3 className="mb-3 sm:mb-4 text-xl sm:text-2xl font-bold">Browse Parts</h3>
                <p className="mb-4 sm:mb-6 text-sm sm:text-base text-muted-foreground flex-grow">
                  Explore our extensive catalog of CPUs, GPUs, motherboards, and more with detailed specifications.
                </p>
                <Button asChild className="w-full mt-auto">
                  <Link to="/browse-parts">View Catalog</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </section>
        
        <section className="rounded-2xl border border-border bg-card p-6 sm:p-8 lg:p-12 text-center">
          <h2 className="mb-4 sm:mb-6 text-2xl sm:text-3xl lg:text-4xl font-bold">About PC Part Picker</h2>
          <p className="mx-auto mb-6 sm:mb-8 max-w-3xl text-sm sm:text-base lg:text-lg text-muted-foreground">
            This tool helps you build the perfect PC with AI recommendations or manual component selection. 
            Ensure compatibility and get the best performance for your needs.
          </p>
          <div className="grid gap-4 sm:gap-6 md:grid-cols-3">
            <div className="rounded-lg bg-secondary p-4 sm:p-6">
              <h3 className="mb-2 text-lg sm:text-xl font-bold">AI-Powered</h3>
              <p className="text-xs sm:text-sm text-muted-foreground">Smart recommendations using Google Gemini</p>
            </div>
            <div className="rounded-lg bg-secondary p-4 sm:p-6">
              <h3 className="mb-2 text-lg sm:text-xl font-bold">Compatibility Check</h3>
              <p className="text-xs sm:text-sm text-muted-foreground">Automatic validation of all components</p>
            </div>
            <div className="rounded-lg bg-secondary p-4 sm:p-6">
              <h3 className="mb-2 text-lg sm:text-xl font-bold">Extensive Catalog</h3>
              <p className="text-xs sm:text-sm text-muted-foreground">Latest CPUs, GPUs, and components</p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Home;
