import { useState, useEffect } from "react";
import Navigation from "@/components/Navigation";
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
    <div className="min-h-screen flex flex-col bg-background font-sans">
      <Navigation />

      <main className="container py-12 flex-grow">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-4">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-2 font-display">
              Saved Configurations
            </h1>
            <p className="text-lg text-muted-foreground">
              Manage your custom PC builds and specifications.
            </p>
          </div>
          <Button asChild className="h-12 px-6 rounded-full shadow-medium hover:shadow-large transition-all">
            <Link to="/ai-build">
              <Plus className="h-5 w-5 mr-2" /> New Build
            </Link>
          </Button>
        </div>

        {builds.length === 0 ? (
          <div className="text-center py-24 border border-dashed border-border rounded-3xl bg-secondary/10">
            <div className="w-20 h-20 bg-secondary rounded-full flex items-center justify-center mx-auto mb-6 text-muted-foreground">
              <Box className="h-10 w-10" />
            </div>
            <h3 className="text-2xl font-bold mb-3">No saved builds</h3>
            <p className="text-muted-foreground mb-8 max-w-md mx-auto">
              You haven't created any configurations yet. Start with our AI Architect or Manual Studio.
            </p>
            <div className="flex justify-center gap-4">
              <Button asChild className="h-12 px-8 rounded-full">
                <Link to="/ai-build">AI Architect</Link>
              </Button>
              <Button asChild variant="outline" className="h-12 px-8 rounded-full">
                <Link to="/manual-build">Manual Studio</Link>
              </Button>
            </div>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {builds.map((build) => (
              <div
                key={build.id}
                className="flex flex-col border border-border rounded-2xl bg-card shadow-subtle hover:shadow-medium hover:-translate-y-1 transition-all duration-300 group overflow-hidden"
              >
                <div className="p-6 border-b border-border bg-secondary/30">
                  <div className="flex justify-between items-start mb-4">
                    <Badge variant={build.source === "ai" ? "default" : "secondary"} className="rounded-full px-3 py-1 font-medium tracking-wide">
                      {build.source === "ai" ? (
                        <span className="flex items-center gap-1.5"><Bot className="h-3.5 w-3.5" /> AI Generated</span>
                      ) : (
                        <span className="flex items-center gap-1.5"><Wrench className="h-3.5 w-3.5" /> Manual</span>
                      )}
                    </Badge>
                    <span className="text-xs font-medium text-muted-foreground flex items-center gap-1.5 bg-background px-2 py-1 rounded-full border border-border/50">
                      <Clock className="h-3 w-3" /> {formatDate(build.createdAt)}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold tracking-tight line-clamp-1 group-hover:text-primary transition-colors mb-1">
                    {build.name}
                  </h3>
                  <div className="text-2xl font-bold text-foreground">
                    ${build.totalCost.toFixed(2)}
                  </div>
                </div>

                <div className="flex-grow p-6 space-y-4">
                  <div className="space-y-3 text-sm text-muted-foreground">
                    <div className="flex items-center gap-3">
                      <Cpu className="h-4 w-4 shrink-0 text-foreground/70" />
                      <span className="truncate font-medium text-foreground">{build.components.cpu?.name || "No CPU"}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Box className="h-4 w-4 shrink-0 text-foreground/70" />
                      <span className="truncate font-medium text-foreground">{build.components.gpu?.name || "No GPU"}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <HardDrive className="h-4 w-4 shrink-0 text-foreground/70" />
                      <span className="truncate font-medium text-foreground">{build.components.storage?.name || "No Storage"}</span>
                    </div>
                  </div>
                </div>

                <div className="p-4 border-t border-border bg-background flex gap-3">
                  <Button variant="outline" className="flex-1 rounded-lg border-border hover:bg-secondary h-11 font-medium" asChild>
                    <Link to={build.source === "ai" ? "/ai-build" : "/manual-build"}>
                      View Details <ArrowRight className="h-4 w-4 ml-2" />
                    </Link>
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="rounded-lg hover:bg-destructive/10 hover:text-destructive h-11 w-11"
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
