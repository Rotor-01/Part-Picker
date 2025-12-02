import { useState } from "react";
import Navigation from "@/components/Navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Cpu, HardDrive, Zap, Box, CheckCircle2, XCircle, MemoryStick } from "lucide-react";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import superiorParts, { NormalizedPart } from "@/data/superiorParts";
import { buildStorage } from "@/lib/buildStorage";

// BEFORE: Dark, card-heavy interface
// AFTER: Clean, structured layout with clear hierarchy and professional styling
// KEY CHANGES:
// - Updated component cards to be cleaner and more compact
// - Improved summary card visibility and styling
// - Refined selection dropdowns and empty states

interface BuildComponent {
  name: string;
  price: number;
}

interface Build {
  cpu: BuildComponent | null;
  motherboard: BuildComponent | null;
  gpu: BuildComponent | null;
  ram: BuildComponent | null;
  storage: BuildComponent | null;
  psu: BuildComponent | null;
  case: BuildComponent | null;
}

const ManualBuild = () => {
  const [build, setBuild] = useState<Build>({
    cpu: null,
    motherboard: null,
    gpu: null,
    ram: null,
    storage: null,
    psu: null,
    case: null,
  });
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [buildName, setBuildName] = useState("");

  const totalCost = Object.values(build).reduce((sum, component) => {
    return sum + (component?.price || 0);
  }, 0);

  const isCompatible = build.cpu !== null && build.motherboard !== null;

  // Get available parts for each category
  const getAvailableParts = (category: string) => {
    const parts = superiorParts[category as keyof typeof superiorParts];
    if (!Array.isArray(parts)) return [];
    return parts.map(({ name, price, ...rest }: NormalizedPart) => ({
      name,
      price,
      id: `${category}-${name}`,
      ...rest
    }));
  };

  const handleComponentSelect = (category: string, component: NormalizedPart) => {
    setBuild(prev => ({
      ...prev,
      [category]: {
        name: component.name,
        price: component.price
      }
    }));
  };

  const componentCategories = [
    { key: "cpu", label: "CPU", icon: Cpu, required: true },
    { key: "motherboard", label: "Motherboard", icon: Box, required: true },
    { key: "gpu", label: "GPU", icon: Zap, required: true },
    { key: "ram", label: "RAM", icon: MemoryStick, required: false },
    { key: "storage", label: "Storage", icon: HardDrive, required: true },
    { key: "psu", label: "Power Supply", icon: Zap, required: true },
    { key: "case", label: "Case", icon: Box, required: true },
  ];

  const handleSaveBuild = () => {
    if (!buildName.trim()) {
      toast.error("Please enter a build name");
      return;
    }

    try {
      buildStorage.saveBuild({
        name: buildName,
        totalCost,
        components: build,
        source: "manual",
      });
      toast.success(`Build "${buildName}" saved successfully!`);
      setBuildName("");
      setShowSaveDialog(false);
    } catch (error) {
      toast.error("Failed to save build");
      console.error(error);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navigation />

      <main className="container py-6 sm:py-8 flex-grow">
        <div className="mb-6 sm:mb-8 text-center">
          <h1 className="mb-3 sm:mb-4 text-3xl sm:text-4xl font-bold text-foreground">Manual PC Builder</h1>
          <p className="text-base sm:text-lg text-muted-foreground px-4">
            Hand-pick every component for your perfect build
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
          <div className="space-y-4">
            {componentCategories.map(({ key, label, icon: Icon, required }) => (
              <Card key={key} className="border-border shadow-sm hover:shadow-md transition-all duration-200">
                <CardHeader className="pb-3 sm:pb-4 bg-secondary/10 border-b border-border/50">
                  <CardTitle className="flex items-center justify-between text-sm sm:text-base">
                    <div className="flex items-center gap-2">
                      <div className="p-2 rounded-lg bg-primary/10 text-primary">
                        <Icon className="h-4 w-4 sm:h-5 sm:w-5" />
                      </div>
                      <span className="font-semibold text-foreground">{label}</span>
                      {required && <Badge variant="secondary" className="text-xs">Required</Badge>}
                    </div>
                    {build[key as keyof Build] && (
                      <div className="flex items-center gap-2 text-green-600 animate-in fade-in">
                        <CheckCircle2 className="h-4 w-4 sm:h-5 sm:w-5" />
                        <span className="text-xs font-medium">Selected</span>
                      </div>
                    )}
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-4">
                  {build[key as keyof Build] ? (
                    <div className="flex items-center justify-between rounded-xl bg-secondary/30 border border-border p-3 sm:p-4">
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-sm sm:text-base truncate text-foreground">{build[key as keyof Build]?.name}</p>
                        <p className="text-xs sm:text-sm text-primary font-medium mt-1">
                          ${build[key as keyof Build]?.price}
                        </p>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setBuild({ ...build, [key]: null })}
                        className="ml-2 flex-shrink-0 hover:text-destructive"
                      >
                        Change
                      </Button>
                    </div>
                  ) : (
                    <div className="text-center py-6 sm:py-8 border-2 border-dashed border-border rounded-xl hover:border-primary/30 transition-colors bg-secondary/5">
                      <p className="mb-3 sm:mb-4 text-sm sm:text-base text-muted-foreground">No {label.toLowerCase()} selected</p>
                      <Select onValueChange={(value) => {
                        const selectedPart = getAvailableParts(key).find(part => part.id === value);
                        if (selectedPart) {
                          handleComponentSelect(key, selectedPart);
                        }
                      }}>
                        <SelectTrigger className="w-full max-w-xs mx-auto bg-background">
                          <SelectValue placeholder={`Select ${label}`} />
                        </SelectTrigger>
                        <SelectContent>
                          {getAvailableParts(key).map((part) => (
                            <SelectItem key={part.id} value={part.id}>
                              <div className="flex justify-between items-center w-full gap-4">
                                <span className="truncate">{part.name}</span>
                                <span className="text-primary font-semibold ml-2">${part.price}</span>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="space-y-4">
            <Card className="sticky top-24 border-border shadow-lg">
              <CardHeader className="pb-3 sm:pb-4 border-b border-border bg-secondary/20">
                <CardTitle className="text-sm sm:text-base flex items-center gap-2 text-foreground">
                  <Box className="h-4 w-4 text-primary" />
                  Build Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 pt-4">
                <div className="rounded-xl bg-secondary/30 border border-border p-4 text-center">
                  <span className="text-muted-foreground text-xs uppercase tracking-wider font-semibold">Total Cost</span>
                  <div className="text-3xl font-bold text-primary mt-1">${totalCost.toFixed(2)}</div>
                </div>

                <div className={`rounded-xl border p-4 flex items-start gap-3 transition-colors ${isCompatible ? "bg-green-500/10 border-green-500/20" : "bg-yellow-500/10 border-yellow-500/20"
                  }`}>
                  {isCompatible ? (
                    <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                  ) : (
                    <XCircle className="h-5 w-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                  )}
                  <div>
                    <p className={`font-semibold text-sm ${isCompatible ? "text-green-600" : "text-yellow-600"}`}>
                      {isCompatible ? "Compatible Build" : "Build Incomplete"}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {isCompatible
                        ? "All selected components are compatible."
                        : "Please select all required components to validate compatibility."}
                    </p>
                  </div>
                </div>

                <Button
                  className="w-full bg-primary hover:bg-primary/90 shadow-md"
                  disabled={!isCompatible}
                  size="lg"
                  onClick={() => setShowSaveDialog(true)}
                >
                  Save Build
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Save Build Dialog */}
        {showSaveDialog && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            <Card className="w-full max-w-md bg-background border-border shadow-2xl">
              <CardHeader>
                <CardTitle>Save Build</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block text-muted-foreground">Build Name</label>
                  <Input
                    placeholder="e.g., Gaming Rig 2024"
                    value={buildName}
                    onChange={(e) => setBuildName(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSaveBuild()}
                    autoFocus
                  />
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() => {
                      setShowSaveDialog(false);
                      setBuildName("");
                    }}
                  >
                    Cancel
                  </Button>
                  <Button
                    className="flex-1 bg-primary hover:bg-primary/90"
                    onClick={handleSaveBuild}
                  >
                    Save
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </main>
    </div>
  );
};

export default ManualBuild;
