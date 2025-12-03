import { useState, useEffect } from "react";
import Navigation from "@/components/Navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Trash2, Clock, Cpu, Box, ArrowRight, Bot, Wrench, Plus, HardDrive } from "lucide-react";
import { buildStorage, SavedBuild } from "@/lib/buildStorage";
import { toast } from "sonner";
import { Link } from "react-router-dom";

const SavedBuilds = () => {
  const [builds, setBuilds] = useState<SavedBuild[]>([]);

  useEffect(() => {
    setBuilds(buildStorage.getAllBuilds());
  }, []);

  const handleDelete = (id: string) => {
    if (confirm("DELETE CONFIGURATION? THIS ACTION CANNOT BE UNDONE.")) {
      buildStorage.deleteBuild(id);
      setBuilds(buildStorage.getAllBuilds());
      toast.success("BUILD DELETED");
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
    <div className="min-h-screen flex flex-col bg-background font-sans">
      <Navigation />

      <main className="container py-12 flex-grow">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 border-b-4 border-black pb-6 gap-4">
          <div>
            <h1 className="text-6xl font-bold uppercase tracking-tighter mb-2 font-display">
              SAVED <span className="text-accent">CONFIGS</span>
            </h1>
            <p className="text-xl font-mono uppercase tracking-widest text-muted-foreground">
              // Manage Custom Builds
            </p>
          </div>
          <Button asChild className="h-14 px-8 rounded-none bg-black text-white hover:bg-accent hover:text-white shadow-[4px_4px_0px_0px_rgba(0,0,0,0.5)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-0.5 transition-all font-bold uppercase tracking-wider border-2 border-transparent">
            <Link to="/ai-build">
              <Plus className="h-5 w-5 mr-2" /> New Build
            </Link>
          </Button>
        </div>

        {builds.length === 0 ? (
          <div className="text-center py-24 border-2 border-dashed border-black bg-slate-50">
            <div className="w-24 h-24 bg-black text-white flex items-center justify-center mx-auto mb-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,0.2)]">
              <Box className="h-12 w-12" />
            </div>
            <h3 className="text-3xl font-bold uppercase mb-4">No saved builds</h3>
            <p className="text-muted-foreground font-mono uppercase mb-8 max-w-md mx-auto">
              Initialize a new configuration sequence.
            </p>
            <div className="flex justify-center gap-6">
              <Button asChild className="h-14 px-8 rounded-none bg-accent text-white hover:bg-black font-bold uppercase tracking-wider shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                <Link to="/ai-build">AI Builder</Link>
              </Button>
              <Button asChild variant="outline" className="h-14 px-8 rounded-none border-2 border-black hover:bg-black hover:text-white font-bold uppercase tracking-wider">
                <Link to="/manual-build">Manual Mode</Link>
              </Button>
            </div>
          </div>
        ) : (
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {builds.map((build) => (
              <div
                key={build.id}
                className="flex flex-col border-2 border-black bg-white shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 transition-all duration-200 group"
              >
                <div className="p-6 border-b-2 border-black bg-slate-50">
                  <div className="flex justify-between items-start mb-4">
                    <Badge variant={build.source === "ai" ? "default" : "secondary"} className={`rounded-none font-bold uppercase tracking-wider border-2 border-black ${build.source === 'ai' ? 'bg-accent text-white' : 'bg-white text-black'}`}>
                      {build.source === "ai" ? (
                        <span className="flex items-center gap-2"><Bot className="h-3.5 w-3.5" /> AI Generated</span>
                      ) : (
                        <span className="flex items-center gap-2"><Wrench className="h-3.5 w-3.5" /> Manual</span>
                      )}
                    </Badge>
                    <span className="text-xs font-mono font-bold uppercase text-muted-foreground flex items-center gap-1">
                      <Clock className="h-3 w-3" /> {formatDate(build.createdAt)}
                    </span>
                  </div>
                  <h3 className="text-2xl font-bold uppercase tracking-tight line-clamp-1 group-hover:text-accent transition-colors">
                    {build.name}
                  </h3>
                  <div className="font-bold font-display text-3xl mt-2 text-black">
                    ${build.totalCost.toFixed(2)}
                  </div>
                </div>

                <div className="flex-grow p-6 space-y-4">
                  <div className="space-y-3 font-mono text-sm">
                    <div className="flex items-center gap-3">
                      <Cpu className="h-4 w-4 shrink-0" />
                      <span className="truncate font-bold uppercase">{build.components.cpu?.name || "NO CPU"}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Box className="h-4 w-4 shrink-0" />
                      <span className="truncate font-bold uppercase">{build.components.gpu?.name || "NO GPU"}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <HardDrive className="h-4 w-4 shrink-0" />
                      <span className="truncate font-bold uppercase">{build.components.storage?.name || "NO STORAGE"}</span>
                    </div>
                  </div>
                </div>

                <div className="p-4 border-t-2 border-black bg-white flex gap-3">
                  <Button variant="outline" className="flex-1 rounded-none border-2 border-black hover:bg-black hover:text-white font-bold uppercase tracking-wider h-12" asChild>
                    <Link to={build.source === "ai" ? "/ai-build" : "/manual-build"}>
                      Details <ArrowRight className="h-4 w-4 ml-2" />
                    </Link>
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="rounded-none border-2 border-transparent hover:border-destructive hover:bg-destructive hover:text-white h-12 w-12"
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
