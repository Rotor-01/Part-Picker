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
    return parts.map((part: NormalizedPart) => ({
      name: part.name,
      price: part.price,
      id: `${category}-${part.name}`,
      ...part
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
    <div className="min-h-screen">
      <Navigation />
      
      <main className="container py-6 sm:py-8">
        <div className="mb-6 sm:mb-8 text-center">
          <h1 className="mb-3 sm:mb-4 text-2xl sm:text-3xl lg:text-4xl font-bold text-gradient">Manual PC Builder</h1>
          <p className="text-base sm:text-lg text-muted-foreground px-4">
            Hand-pick every component for your perfect build
          </p>
        </div>

        <div className="grid gap-4 sm:gap-6 lg:grid-cols-[2fr_1fr]">
          <div className="space-y-3 sm:space-y-4">
            {componentCategories.map(({ key, label, icon: Icon, required }) => (
              <Card key={key} className="card-gradient border-border">
                <CardHeader className="pb-3 sm:pb-4">
                  <CardTitle className="flex items-center justify-between text-sm sm:text-base">
                    <div className="flex items-center gap-2">
                      <Icon className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                      {label}
                      {required && <Badge variant="secondary" className="text-xs">Required</Badge>}
                    </div>
                    {build[key as keyof Build] && (
                      <CheckCircle2 className="h-4 w-4 sm:h-5 sm:w-5 text-green-500" />
                    )}
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  {build[key as keyof Build] ? (
                    <div className="flex items-center justify-between rounded-lg bg-secondary p-3 sm:p-4">
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-sm sm:text-base truncate">{build[key as keyof Build]?.name}</p>
                        <p className="text-xs sm:text-sm text-muted-foreground">
                          ${build[key as keyof Build]?.price}
                        </p>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setBuild({ ...build, [key]: null })}
                        className="ml-2 flex-shrink-0"
                      >
                        Change
                      </Button>
                    </div>
                  ) : (
                    <div className="text-center py-6 sm:py-8">
                      <p className="mb-3 sm:mb-4 text-sm sm:text-base text-muted-foreground">No {label.toLowerCase()} selected</p>
                      <Select onValueChange={(value) => {
                        const selectedPart = getAvailableParts(key).find(part => part.id === value);
                        if (selectedPart) {
                          handleComponentSelect(key, selectedPart);
                        }
                      }}>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder={`Select ${label}`} />
                        </SelectTrigger>
                        <SelectContent>
                          {getAvailableParts(key).map((part) => (
                            <SelectItem key={part.id} value={part.id}>
                              <div className="flex justify-between items-center w-full">
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

          <div className="space-y-3 sm:space-y-4">
            <Card className="card-gradient sticky top-20 sm:top-24 border-border">
              <CardHeader className="pb-3 sm:pb-4">
                <CardTitle className="text-sm sm:text-base">Build Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 sm:space-y-4">
                <div className="rounded-lg bg-secondary p-3 sm:p-4">
                  <div className="mb-2 flex justify-between text-xs sm:text-sm">
                    <span className="text-muted-foreground">Total Cost</span>
                    <span className="text-xl sm:text-2xl font-bold text-gradient">${totalCost}</span>
                  </div>
                </div>

                <div className="rounded-lg border border-border p-3 sm:p-4">
                  <div className="mb-2 flex items-center gap-2">
                    {isCompatible ? (
                      <>
                        <CheckCircle2 className="h-4 w-4 sm:h-5 sm:w-5 text-green-500" />
                        <span className="font-semibold text-green-500 text-sm sm:text-base">Compatible</span>
                      </>
                    ) : (
                      <>
                        <XCircle className="h-4 w-4 sm:h-5 sm:w-5 text-yellow-500" />
                        <span className="font-semibold text-yellow-500 text-sm sm:text-base">Incomplete</span>
                      </>
                    )}
                  </div>
                  <p className="text-xs sm:text-sm text-muted-foreground">
                    {isCompatible
                      ? "All selected components are compatible"
                      : "Select required components to validate compatibility"}
                  </p>
                </div>

                <Button 
                  className="w-full" 
                  disabled={!isCompatible} 
                  size="sm"
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
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <Card className="w-full max-w-md card-gradient border-border">
              <CardHeader>
                <CardTitle>Save Build</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Build Name</label>
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
                    className="flex-1"
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
