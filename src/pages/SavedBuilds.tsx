import { useState, useEffect } from "react";
import Navigation from "@/components/Navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Trash2, Clock, Cpu, Box, ArrowRight, Bot, Wrench } from "lucide-react";
import { buildStorage, SavedBuild } from "@/lib/buildStorage";
import { toast } from "sonner";
import { Link } from "react-router-dom";

// BEFORE: Basic list of saved builds
// AFTER: Professional card layout with detailed build info and clean actions
// KEY CHANGES:
// - Implemented card grid for saved builds
// - Added visual indicators for AI vs Manual builds
// - Improved empty state with clear CTA

const SavedBuilds = () => {
  const [builds, setBuilds] = useState<SavedBuild[]>([]);

  useEffect(() => {
    setBuilds(buildStorage.getAllBuilds());
  }, []);

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this build?")) {
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
    <div className="min-h-screen flex flex-col bg-background">
      <Navigation />

      <main className="container py-8 flex-grow">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">Saved Builds</h1>
            <p className="text-muted-foreground">Manage your custom PC configurations</p>
          </div>
          <Button asChild className="bg-primary hover:bg-primary/90 shadow-sm">
            <Link to="/ai-build">
              <Plus className="h-4 w-4 mr-2" /> Create New Build
            </Link>
          </Button>
        </div>

        {builds.length === 0 ? (
          <div className="text-center py-24 bg-secondary/10 rounded-2xl border-2 border-dashed border-border">
            <Box className="h-16 w-16 text-muted-foreground mx-auto mb-6 opacity-50" />
            <h3 className="text-xl font-bold text-foreground mb-2">No saved builds yet</h3>
            <p className="text-muted-foreground mb-8 max-w-md mx-auto">
              Start building your dream PC using our AI assistant or manual builder.
            </p>
            <div className="flex justify-center gap-4">
              <Button asChild variant="default" className="bg-primary hover:bg-primary/90">
                <Link to="/ai-build">Use AI Builder</Link>
              </Button>
              <Button asChild variant="outline">
                <Link to="/manual-build">Manual Build</Link>
              </Button>
            </div>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {builds.map((build) => (
              <Card key={build.id} className="flex flex-col border-border shadow-sm hover:shadow-md transition-all duration-300 group">
                <CardHeader className="pb-4 border-b border-border/50 bg-secondary/10">
                  <div className="flex justify-between items-start mb-2">
                    <Badge variant={build.source === "ai" ? "default" : "secondary"} className="mb-2">
                      {build.source === "ai" ? (
                        <span className="flex items-center gap-1"><Bot className="h-3 w-3" /> AI Generated</span>
                      ) : (
                        <span className="flex items-center gap-1"><Wrench className="h-3 w-3" /> Manual Build</span>
                      )}
                    </Badge>
                    <span className="text-xs text-muted-foreground flex items-center gap-1 bg-background px-2 py-1 rounded-full border border-border">
                      <Clock className="h-3 w-3" /> {formatDate(build.createdAt)}
                    </span>
                  </div>
                  <CardTitle className="text-xl font-bold text-foreground line-clamp-1 group-hover:text-primary transition-colors">
                    {build.name}
                  </CardTitle>
                  <CardDescription className="font-medium text-primary text-lg">
                    ${build.totalCost.toFixed(2)}
                  </CardDescription>
                </CardHeader>

                <CardContent className="flex-grow pt-6 space-y-3">
                  <div className="space-y-2">
                    <div className="flex items-center gap-3 text-sm">
                      <Cpu className="h-4 w-4 text-muted-foreground shrink-0" />
                      <span className="truncate text-foreground/80">{build.components.cpu?.name || "No CPU"}</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                      <Box className="h-4 w-4 text-muted-foreground shrink-0" />
                      <span className="truncate text-foreground/80">{build.components.gpu?.name || "No GPU"}</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                      <Box className="h-4 w-4 text-muted-foreground shrink-0" />
                      <span className="truncate text-foreground/80">{build.components.case?.name || "No Case"}</span>
                    </div>
                  </div>
                </CardContent>

                <CardFooter className="pt-4 border-t border-border bg-secondary/5 gap-2">
                  <Button variant="outline" className="flex-1 hover:bg-primary/5 hover:text-primary hover:border-primary/30" asChild>
                    <Link to={build.source === "ai" ? "/ai-build" : "/manual-build"}>
                      View Details <ArrowRight className="h-4 w-4 ml-2" />
                    </Link>
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                    onClick={() => handleDelete(build.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

function Plus(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M5 12h14" />
      <path d="M12 5v14" />
    </svg>
  )
}

export default SavedBuilds;
