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
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navigation />

      <main className="container py-8 flex-grow">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4 animate-fade-in-up">
          <div>
            <h1 className="text-4xl font-bold text-slate-900 mb-2">Saved Builds</h1>
            <p className="text-slate-500 text-lg">Manage your custom PC configurations</p>
          </div>
          <Button asChild className="h-12 px-6 shadow-lg shadow-orange-500/25 hover:shadow-orange-500/40">
            <Link to="/ai-build">
              <Plus className="h-5 w-5 mr-2" /> Create New Build
            </Link>
          </Button>
        </div>

        {builds.length === 0 ? (
          <div className="text-center py-24 bg-white rounded-3xl border-0 shadow-xl shadow-slate-200/50 animate-fade-in-up">
            <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <Box className="h-10 w-10 text-slate-300" />
            </div>
            <h3 className="text-2xl font-bold text-slate-900 mb-3">No saved builds yet</h3>
            <p className="text-slate-500 mb-8 max-w-md mx-auto text-lg">
              Start building your dream PC using our AI assistant or manual builder.
            </p>
            <div className="flex justify-center gap-4">
              <Button asChild variant="default" className="h-12 px-8 rounded-full">
                <Link to="/ai-build">Use AI Builder</Link>
              </Button>
              <Button asChild variant="outline" className="h-12 px-8 rounded-full border-slate-200 hover:bg-slate-50 text-slate-600">
                <Link to="/manual-build">Manual Build</Link>
              </Button>
            </div>
          </div>
        ) : (
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {builds.map((build, index) => (
              <Card
                key={build.id}
                className="flex flex-col border-0 shadow-xl shadow-slate-200/50 hover:shadow-2xl hover:shadow-slate-200/70 transition-all duration-300 group hover:-translate-y-1 overflow-hidden bg-white rounded-3xl animate-fade-in-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <CardHeader className="pb-4 border-b border-slate-50 bg-slate-50/50">
                  <div className="flex justify-between items-start mb-3">
                    <Badge variant={build.source === "ai" ? "default" : "secondary"} className={`mb-2 ${build.source === 'ai' ? 'bg-orange-100 text-orange-700 hover:bg-orange-200' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>
                      {build.source === "ai" ? (
                        <span className="flex items-center gap-1.5"><Bot className="h-3.5 w-3.5" /> AI Generated</span>
                      ) : (
                        <span className="flex items-center gap-1.5"><Wrench className="h-3.5 w-3.5" /> Manual Build</span>
                      )}
                    </Badge>
                    <span className="text-xs text-slate-400 flex items-center gap-1 bg-white px-2.5 py-1 rounded-full border border-slate-100 shadow-sm font-medium">
                      <Clock className="h-3 w-3" /> {formatDate(build.createdAt)}
                    </span>
                  </div>
                  <CardTitle className="text-xl font-bold text-slate-900 line-clamp-1 group-hover:text-orange-600 transition-colors">
                    {build.name}
                  </CardTitle>
                  <CardDescription className="font-bold text-slate-900 text-2xl mt-1">
                    ${build.totalCost.toFixed(2)}
                  </CardDescription>
                </CardHeader>

                <CardContent className="flex-grow pt-6 space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 text-sm group/item">
                      <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 group-hover/item:text-orange-500 group-hover/item:bg-orange-50 transition-colors">
                        <Cpu className="h-4 w-4 shrink-0" />
                      </div>
                      <span className="truncate text-slate-600 font-medium">{build.components.cpu?.name || "No CPU"}</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm group/item">
                      <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 group-hover/item:text-orange-500 group-hover/item:bg-orange-50 transition-colors">
                        <Box className="h-4 w-4 shrink-0" />
                      </div>
                      <span className="truncate text-slate-600 font-medium">{build.components.gpu?.name || "No GPU"}</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm group/item">
                      <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 group-hover/item:text-orange-500 group-hover/item:bg-orange-50 transition-colors">
                        <HardDrive className="h-4 w-4 shrink-0" />
                      </div>
                      <span className="truncate text-slate-600 font-medium">{build.components.storage?.name || "No Storage"}</span>
                    </div>
                  </div>
                </CardContent>

                <CardFooter className="pt-4 pb-6 px-6 border-t border-slate-50 bg-white gap-3">
                  <Button variant="outline" className="flex-1 rounded-xl border-slate-200 hover:bg-orange-50 hover:text-orange-600 hover:border-orange-200 transition-all h-11" asChild>
                    <Link to={build.source === "ai" ? "/ai-build" : "/manual-build"}>
                      View Details <ArrowRight className="h-4 w-4 ml-2" />
                    </Link>
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl h-11 w-11"
                    onClick={() => handleDelete(build.id)}
                  >
                    <Trash2 className="h-5 w-5" />
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

export default SavedBuilds;
