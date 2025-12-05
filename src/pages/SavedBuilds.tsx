import { useState, useEffect } from "react";
import { Navigation } from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Trash2, Clock, Cpu, Box, ArrowRight, Bot, Wrench, Plus, HardDrive, Save } from "lucide-react";
import { buildStorage, SavedBuild } from "@/lib/buildStorage";
import { toast } from "sonner";
import { Link } from "react-router-dom";

const SavedBuilds = () => {
  const [builds, setBuilds] = useState<SavedBuild[]>([]);

  useEffect(() => {
    setBuilds(buildStorage.getAllBuilds());
  }, []);

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this configuration?")) {
      buildStorage.deleteBuild(id);
      setBuilds(buildStorage.getAllBuilds());
      toast.success("Build deleted successfully");
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="min-h-screen flex flex-col bg-black text-foreground font-sans relative selection:bg-liquid-blue/30">
      {/* Liquid Background */}
      <div className="liquid-bg">
        <div className="liquid-blob bg-liquid-teal w-[500px] h-[500px] top-[-100px] right-[-100px] opacity-20 mix-blend-screen animate-blob"></div>
        <div className="liquid-blob bg-liquid-pink w-[400px] h-[400px] bottom-[20%] left-[-100px] opacity-20 mix-blend-screen animate-blob animation-delay-2000"></div>
      </div>
      <Navigation />

      <main className="container py-12 pt-32 flex-grow relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-6 animate-fade-in">
              <Save className="w-4 h-4 text-liquid-teal" />
              <span className="text-sm font-medium text-white/80">Library</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-bold tracking-tighter mb-4 bg-clip-text text-transparent bg-gradient-to-b from-white to-white/40">
              Saved Builds
            </h1>
            <p className="text-xl text-white/60">
              Your personal collection of high-performance configurations.
            </p>
          </div>
          <Button asChild className="h-14 px-8 rounded-full bg-white text-black hover:bg-white/90 shadow-glow hover:scale-105 transition-all">
            <Link to="/ai-build">
              <Plus className="h-5 w-5 mr-2" /> New Build
            </Link>
          </Button>
        </div>

        {builds.length === 0 ? (
          <div className="text-center py-32 glass rounded-[3rem] border-dashed border-white/10 animate-fade-in">
            <div className="w-24 h-24 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-8 text-white/20 animate-pulse">
              <Box className="h-12 w-12" />
            </div>
            <h3 className="text-3xl font-bold mb-4 text-white">Library Empty</h3>
            <p className="text-white/40 mb-12 max-w-md mx-auto text-lg">
              You haven't archived any configurations yet. Start your journey with our AI Architect.
            </p>
            <div className="flex justify-center gap-6">
              <Button asChild className="h-14 px-10 rounded-full bg-white text-black hover:bg-white/90 shadow-glow">
                <Link to="/ai-build">AI Architect</Link>
              </Button>
              <Button asChild variant="outline" className="h-14 px-10 rounded-full border-white/20 hover:bg-white/10 text-white">
                <Link to="/manual-build">Manual Studio</Link>
              </Button>
            </div>
          </div>
        ) : (
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {builds.map((build, index) => (
              <div
                key={build.id}
                className="flex flex-col glass rounded-3xl overflow-hidden hover:bg-white/10 hover:scale-[1.02] transition-all duration-500 group animate-slide-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="p-8 border-b border-white/5 bg-gradient-to-br from-white/5 to-transparent">
                  <div className="flex justify-between items-start mb-6">
                    <Badge variant={build.source === "ai" ? "default" : "secondary"} className="rounded-full px-4 py-1.5 font-bold tracking-wide border border-white/10">
                      {build.source === "ai" ? (
                        <span className="flex items-center gap-1.5"><Bot className="h-3.5 w-3.5" /> AI Generated</span>
                      ) : (
                        <span className="flex items-center gap-1.5"><Wrench className="h-3.5 w-3.5" /> Manual</span>
                      )}
                    </Badge>
                    <span className="text-xs font-bold text-white/40 flex items-center gap-1.5 bg-black/20 px-3 py-1.5 rounded-full border border-white/5">
                      <Clock className="h-3 w-3" /> {formatDate(build.createdAt)}
                    </span>
                  </div>
                  <h3 className="text-2xl font-bold tracking-tight line-clamp-1 text-white group-hover:text-liquid-blue transition-colors mb-2">
                    {build.name}
                  </h3>
                  <div className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-white/60">
                    ${build.totalCost.toFixed(2)}
                  </div>
                </div>

                <div className="flex-grow p-8 space-y-4">
                  <div className="space-y-4 text-sm text-white/60">
                    <div className="flex items-center gap-4 p-3 rounded-xl bg-white/5 border border-white/5">
                      <Cpu className="h-5 w-5 shrink-0 text-white" />
                      <span className="truncate font-medium text-white/90">{build.components.cpu?.name || "No CPU"}</span>
                    </div>
                    <div className="flex items-center gap-4 p-3 rounded-xl bg-white/5 border border-white/5">
                      <Box className="h-5 w-5 shrink-0 text-white" />
                      <span className="truncate font-medium text-white/90">{build.components.gpu?.name || "No GPU"}</span>
                    </div>
                    <div className="flex items-center gap-4 p-3 rounded-xl bg-white/5 border border-white/5">
                      <HardDrive className="h-5 w-5 shrink-0 text-white" />
                      <span className="truncate font-medium text-white/90">{build.components.storage?.name || "No Storage"}</span>
                    </div>
                  </div>
                </div>

                <div className="p-6 border-t border-white/5 flex gap-4">
                  <Button variant="outline" className="flex-1 rounded-2xl border-white/10 hover:bg-white/10 h-12 font-bold text-white" asChild>
                    <Link to={build.source === "ai" ? "/ai-build" : "/manual-build"}>
                      View <ArrowRight className="h-4 w-4 ml-2" />
                    </Link>
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="rounded-2xl hover:bg-destructive/20 hover:text-destructive h-12 w-12 border border-transparent hover:border-destructive/20"
                    onClick={() => handleDelete(build.id)}
                  >
                    <Trash2 className="h-5 w-5" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default SavedBuilds;
