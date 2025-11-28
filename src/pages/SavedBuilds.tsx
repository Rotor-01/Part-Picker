import { useState, useEffect } from "react";
import Navigation from "@/components/Navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Trash2, Eye, Calendar, ChevronDown, ChevronUp } from "lucide-react";
import { toast } from "sonner";
import { buildStorage, SavedBuild } from "@/lib/buildStorage";

const SavedBuilds = () => {
  const [builds, setBuilds] = useState<SavedBuild[]>([]);
  const [selectedBuild, setSelectedBuild] = useState<SavedBuild | null>(null);
  const [showConversation, setShowConversation] = useState(false);

  useEffect(() => {
    loadBuilds();
  }, []);

  const loadBuilds = () => {
    const allBuilds = buildStorage.getAllBuilds();
    setBuilds(allBuilds);
  };

  const handleDeleteBuild = (id: string) => {
    if (confirm("Are you sure you want to delete this build?")) {
      buildStorage.deleteBuild(id);
      toast.success("Build deleted successfully");
      loadBuilds();
      if (selectedBuild?.id === id) {
        setSelectedBuild(null);
      }
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />

      <main className="container py-6 sm:py-8 flex-grow">
        <div className="mb-6 sm:mb-8 text-center">
          <h1 className="mb-3 sm:mb-4 text-2xl sm:text-3xl lg:text-4xl font-bold text-gradient">
            Saved Builds
          </h1>
          <p className="text-base sm:text-lg text-muted-foreground px-4">
            View and manage your saved PC builds
          </p>
        </div>

        {builds.length === 0 ? (
          <Card className="card-gradient border-border border-dashed">
            <CardContent className="py-12 sm:py-20 text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-secondary/50">
                <Eye className="h-8 w-8 text-muted-foreground" />
              </div>
              <p className="text-base sm:text-lg text-muted-foreground mb-4">
                No saved builds yet
              </p>
              <p className="text-sm text-muted-foreground max-w-sm mx-auto">
                Create a build using the Manual or AI builder and save it to see it here
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 sm:gap-6 lg:grid-cols-[1fr_2fr]">
            {/* Builds List */}
            <div className="space-y-2 sm:space-y-3">
              {builds.map((build) => (
                <Card
                  key={build.id}
                  className={`card-gradient border-border cursor-pointer transition-all duration-200 ${selectedBuild?.id === build.id
                      ? "ring-1 ring-primary border-primary bg-primary/5"
                      : "hover:border-primary/50 hover:bg-white/5"
                    }`}
                  onClick={() => setSelectedBuild(build)}
                >
                  <CardContent className="p-3 sm:p-4">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-sm sm:text-base truncate">
                          {build.name}
                        </h3>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="secondary" className="text-xs bg-secondary/50">
                            {build.source === "ai" ? "AI" : "Manual"}
                          </Badge>
                          <p className="text-xs text-muted-foreground">
                            ${build.totalCost}
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Build Details */}
            {selectedBuild ? (
              <Card className="card-gradient border-border h-fit">
                <CardHeader className="pb-3 sm:pb-4 border-b border-white/5">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <CardTitle className="text-lg sm:text-xl truncate flex items-center gap-2">
                        {selectedBuild.name}
                        <Badge variant="outline" className="ml-2 text-xs font-normal text-muted-foreground border-white/10">
                          {selectedBuild.source === "ai" ? "AI Generated" : "Manual Selection"}
                        </Badge>
                      </CardTitle>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4 sm:space-y-6 pt-6">
                  {/* Build Summary */}
                  <div className="rounded-xl bg-secondary/30 border border-white/5 p-4 text-center">
                    <span className="text-muted-foreground text-xs uppercase tracking-wider">Total Cost</span>
                    <div className="text-3xl font-bold text-gradient mt-1">${selectedBuild.totalCost}</div>
                  </div>

                  {/* Components */}
                  <div className="space-y-2 sm:space-y-3">
                    <h4 className="font-semibold text-sm sm:text-base flex items-center gap-2">
                      <div className="w-1 h-4 bg-primary rounded-full"></div>
                      Components
                    </h4>
                    <div className="space-y-2">
                      {Object.entries(selectedBuild.components).map(([key, component]) => (
                        <div
                          key={key}
                          className="flex items-center justify-between rounded-lg bg-secondary/30 border border-white/5 p-2 sm:p-3 hover:bg-secondary/50 transition-colors"
                        >
                          <div className="flex-1 min-w-0">
                            <p className="text-xs sm:text-sm font-medium capitalize text-muted-foreground mb-0.5">
                              {key}
                            </p>
                            {component ? (
                              <div className="flex justify-between items-center gap-4">
                                <p className="text-sm font-medium truncate text-foreground">
                                  {component.name}
                                </p>
                                <p className="text-sm font-semibold text-primary whitespace-nowrap">
                                  ${component.price}
                                </p>
                              </div>
                            ) : (
                              <p className="text-xs text-muted-foreground italic">
                                Not selected
                              </p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* AI Conversation (if available) */}
                  {selectedBuild.source === "ai" && selectedBuild.conversation && (
                    <div className="border-t border-white/5 pt-4">
                      <Button
                        variant="ghost"
                        className="w-full mb-3 justify-between hover:bg-white/5"
                        onClick={() => setShowConversation(!showConversation)}
                      >
                        <span className="flex items-center">
                          {showConversation ? "Hide Conversation" : "Show Conversation"}
                        </span>
                        {showConversation ? (
                          <ChevronUp className="h-4 w-4" />
                        ) : (
                          <ChevronDown className="h-4 w-4" />
                        )}
                      </Button>
                      {showConversation && (
                        <div className="space-y-3 max-h-[400px] overflow-y-auto rounded-xl bg-secondary/30 border border-white/5 p-4 scrollbar-thin">
                          {selectedBuild.conversation.map((msg, idx) => (
                            <div key={idx} className={`text-sm p-3 rounded-lg ${msg.role === "user" ? "bg-primary/10 ml-8" : "bg-secondary/50 mr-8"
                              }`}>
                              <p className="font-semibold text-xs text-muted-foreground mb-1 uppercase tracking-wider">
                                {msg.role === "user" ? "You" : "Trinity"}
                              </p>
                              <p className="text-foreground/90 whitespace-pre-wrap break-words text-xs sm:text-sm leading-relaxed">
                                {msg.content}
                              </p>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Metadata */}
                  <div className="flex items-center justify-between text-xs text-muted-foreground border-t border-white/5 pt-4">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-3 w-3" />
                      <span>{formatDate(selectedBuild.createdAt)}</span>
                    </div>
                    <Button
                      variant="destructive"
                      size="sm"
                      className="h-8"
                      onClick={() => handleDeleteBuild(selectedBuild.id)}
                    >
                      <Trash2 className="h-3 w-3 mr-2" />
                      Delete Build
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card className="card-gradient border-border flex items-center justify-center min-h-[400px] border-dashed">
                <CardContent className="text-center">
                  <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-secondary/50">
                    <Eye className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <p className="text-sm sm:text-base text-muted-foreground">
                    Select a build from the list to view details
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default SavedBuilds;
