import { useState } from "react";
import Navigation from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Cpu, HardDrive, Zap, Box, CheckCircle2, XCircle, MemoryStick, Save, Trash2 } from "lucide-react";
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
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background font-sans">
      <Navigation />

      <main className="container py-12 flex-grow">
        <div className="mb-12 text-center">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4 font-display">
            Manual Studio
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Precision component selection with real-time compatibility validation.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-[2fr_1fr] max-w-7xl mx-auto">
          <div className="space-y-6">
            {componentCategories.map(({ key, label, icon: Icon, required }) => (
              <div key={key} className="group border border-border rounded-2xl bg-card shadow-subtle hover:shadow-medium transition-all duration-300 overflow-hidden">
                <div className="p-4 border-b border-border bg-secondary/30 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-background rounded-lg border border-border text-foreground/80">
                      <Icon className="h-5 w-5" />
                    </div>
                    <span className="font-semibold text-lg">{label}</span>
                    {required && <span className="text-xs font-medium bg-primary/10 text-primary px-2 py-0.5 rounded-full">Required</span>}
                  </div>
                  {build[key as keyof Build] && (
                    <div className="flex items-center gap-2 text-green-600 font-medium text-sm bg-green-50 px-3 py-1 rounded-full">
                      <CheckCircle2 className="h-4 w-4" />
                      <span>Selected</span>
                    </div>
                  )}
                </div>

                <div className="p-6">
                  {build[key as keyof Build] ? (
                    <div className="flex items-center justify-between bg-secondary/20 rounded-xl p-4 border border-border/50">
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-lg truncate">{build[key as keyof Build]?.name}</p>
                        <p className="text-lg font-medium text-primary mt-1">
                          ${build[key as keyof Build]?.price}
                        </p>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setBuild({ ...build, [key]: null })}
                        className="ml-4 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-full"
                      >
                        <Trash2 className="h-5 w-5" />
                      </Button>
                    </div>
                  ) : (
                    <div className="text-center py-8 border-2 border-dashed border-border rounded-xl hover:border-primary/50 hover:bg-secondary/20 transition-all">
                      <p className="mb-4 text-sm text-muted-foreground">No component selected</p>
                      <Select onValueChange={(value) => {
                        const selectedPart = getAvailableParts(key).find(part => part.id === value);
                        if (selectedPart) {
                          handleComponentSelect(key, selectedPart);
                        }
                      }}>
                        <SelectTrigger className="w-full max-w-sm mx-auto h-12 rounded-lg border-border font-medium">
                          <SelectValue placeholder={`Select ${label}`} />
                        </SelectTrigger>
                        <SelectContent className="rounded-xl border-border shadow-medium max-h-[300px]">
                          {getAvailableParts(key).map((part) => (
                            <SelectItem key={part.id} value={part.id} className="cursor-pointer py-3 rounded-lg my-1">
                              <div className="flex justify-between items-center w-full gap-4">
                                <span className="truncate">{part.name}</span>
                                <span className="font-mono font-medium text-muted-foreground ml-2">${part.price}</span>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="space-y-6">
            <div className="sticky top-24 border border-border rounded-2xl bg-card shadow-medium overflow-hidden">
              <div className="p-4 border-b border-border bg-secondary/50">
                <h3 className="font-semibold flex items-center gap-2">
                  <Box className="h-5 w-5 text-muted-foreground" />
                  Build Summary
                </h3>
              </div>

              <div className="p-6 space-y-6">
                <div className="bg-secondary/30 p-6 rounded-xl border border-border text-center">
                  <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground block mb-2">Total Estimated Cost</span>
                  <div className="text-4xl font-bold text-primary">${totalCost.toFixed(2)}</div>
                </div>

                <div className={`p-4 rounded-xl border flex items-start gap-3 ${isCompatible ? "bg-green-50 border-green-200 text-green-800" : "bg-amber-50 border-amber-200 text-amber-800"}`}>
                  {isCompatible ? (
                    <CheckCircle2 className="h-5 w-5 flex-shrink-0 mt-0.5" />
                  ) : (
                    <XCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
                  )}
                  <div>
                    <p className="font-semibold text-sm mb-1">
                      {isCompatible ? "System Compatible" : "Incomplete Build"}
                    </p>
                    <p className="text-xs opacity-90 leading-relaxed">
                      {isCompatible
                        ? "All core components selected. Ready for fabrication."
                        : "Please select at least a CPU and Motherboard to validate compatibility."}
                    </p>
                  </div>
                </div>

                <Button
                  className="w-full h-12 text-base font-semibold rounded-lg shadow-subtle hover:shadow-medium transition-all"
                  disabled={!isCompatible}
                  onClick={() => setShowSaveDialog(true)}
                >
                  <Save className="w-4 h-4 mr-2" />
                  Save Configuration
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Save Build Dialog */}
        {showSaveDialog && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            <div className="w-full max-w-md bg-background border border-border rounded-2xl shadow-large p-8">
              <h2 className="text-2xl font-bold tracking-tight mb-6">Save Configuration</h2>
              <div className="space-y-6">
                <div>
                  <label className="text-sm font-medium mb-2 block text-muted-foreground">Build Name</label>
                  <Input
                    placeholder="e.g., Dream Machine"
                    value={buildName}
                    onChange={(e) => setBuildName(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSaveBuild()}
                    autoFocus
                    className="h-12 rounded-lg"
                  />
                </div>
                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    className="flex-1 h-12 rounded-lg"
                    onClick={() => {
                      setShowSaveDialog(false);
                      setBuildName("");
                    }}
                  >
                    Cancel
                  </Button>
                  <Button
                    className="flex-1 h-12 rounded-lg"
                    onClick={handleSaveBuild}
                  >
                    Save
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default ManualBuild;
