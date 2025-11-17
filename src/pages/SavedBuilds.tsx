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
    <div className="min-h-screen">
      <Navigation />

      <main className="container py-6 sm:py-8">
        <div className="mb-6 sm:mb-8 text-center">
          <h1 className="mb-3 sm:mb-4 text-2xl sm:text-3xl lg:text-4xl font-bold text-gradient">
            Saved Builds
          </h1>
          <p className="text-base sm:text-lg text-muted-foreground px-4">
            View and manage your saved PC builds
          </p>
        </div>

        {builds.length === 0 ? (
          <Card className="card-gradient border-border">
            <CardContent className="py-12 sm:py-20 text-center">
              <p className="text-base sm:text-lg text-muted-foreground mb-4">
                No saved builds yet
              </p>
              <p className="text-sm text-muted-foreground">
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
                  className={`card-gradient border-border cursor-pointer transition-all ${
                    selectedBuild?.id === build.id
                      ? "ring-2 ring-primary border-primary"
                      : "hover:border-primary/50"
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
                          <Badge variant="secondary" className="text-xs">
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
              <Card className="card-gradient border-border">
                <CardHeader className="pb-3 sm:pb-4">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <CardTitle className="text-lg sm:text-xl truncate">
                        {selectedBuild.name}
                      </CardTitle>
                      <div className="flex items-center gap-2 mt-2">
                        <Badge variant="secondary" className="text-xs">
                          {selectedBuild.source === "ai" ? "AI Build" : "Manual Build"}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4 sm:space-y-6">
                  {/* Build Summary */}
                  <div className="rounded-lg bg-secondary p-3 sm:p-4">
                    <div className="mb-2 flex justify-between text-xs sm:text-sm">
                      <span className="text-muted-foreground">Total Cost</span>
                      <span className="text-xl sm:text-2xl font-bold text-gradient">
                        ${selectedBuild.totalCost}
                      </span>
                    </div>
                  </div>

                  {/* Components */}
                  <div className="space-y-2 sm:space-y-3">
                    <h4 className="font-semibold text-sm sm:text-base">Components</h4>
                    <div className="space-y-2">
                      {Object.entries(selectedBuild.components).map(([key, component]) => (
                        <div
                          key={key}
                          className="flex items-center justify-between rounded-lg bg-secondary p-2 sm:p-3"
                        >
                          <div className="flex-1 min-w-0">
                            <p className="text-xs sm:text-sm font-medium capitalize">
                              {key}
                            </p>
                            {component ? (
                              <>
                                <p className="text-xs sm:text-sm text-muted-foreground truncate">
                                  {component.name}
                                </p>
                                <p className="text-xs font-semibold text-primary">
                                  ${component.price}
                                </p>
                              </>
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
                    <div className="border-t border-border pt-4">
                      <Button
                        variant="outline"
                        className="w-full mb-3"
                        onClick={() => setShowConversation(!showConversation)}
                      >
                        {showConversation ? (
                          <>
                            <ChevronUp className="h-4 w-4 mr-2" />
                            Hide Conversation
                          </>
                        ) : (
                          <>
                            <ChevronDown className="h-4 w-4 mr-2" />
                            Show Conversation
                          </>
                        )}
                      </Button>
                      {showConversation && (
                        <div className="space-y-2 max-h-[400px] overflow-y-auto rounded-lg bg-secondary p-3">
                          {selectedBuild.conversation.map((msg, idx) => (
                            <div key={idx} className="text-xs border-b border-border pb-2 last:border-b-0">
                              <p className="font-semibold text-primary capitalize mb-1">
                                {msg.role === "user" ? "You" : "Trinity"}:
                              </p>
                              <p className="text-muted-foreground whitespace-pre-wrap break-words">
                                {msg.content}
                              </p>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Metadata */}
                  <div className="space-y-2 border-t border-border pt-4">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Calendar className="h-3 w-3 sm:h-4 sm:w-4" />
                      <span>Created: {formatDate(selectedBuild.createdAt)}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Calendar className="h-3 w-3 sm:h-4 sm:w-4" />
                      <span>Updated: {formatDate(selectedBuild.updatedAt)}</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 pt-2">
                    <Button
                      variant="destructive"
                      className="flex-1"
                      size="sm"
                      onClick={() => handleDeleteBuild(selectedBuild.id)}
                    >
                      <Trash2 className="h-3 w-3 sm:h-4 sm:w-4 mr-2" />
                      Delete
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card className="card-gradient border-border flex items-center justify-center min-h-[400px]">
                <CardContent className="text-center">
                  <Eye className="h-8 w-8 sm:h-10 sm:w-10 mx-auto mb-3 text-muted-foreground" />
                  <p className="text-sm sm:text-base text-muted-foreground">
                    Select a build to view details
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
