import { useState } from "react";
import Navigation from "@/components/Navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
        <div className="mb-12 border-b-4 border-black pb-6">
          <h1 className="text-6xl font-bold uppercase tracking-tighter mb-2 font-display">
            MANUAL <span className="text-accent">STUDIO</span>
          </h1>
          <p className="text-xl font-mono uppercase tracking-widest text-muted-foreground">
            // Precision Component Selection
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-[2fr_1fr] max-w-7xl mx-auto">
          <div className="space-y-6">
            {componentCategories.map(({ key, label, icon: Icon, required }) => (
              <div key={key} className="border-2 border-black bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 transition-all duration-200">
                <div className="p-4 border-b-2 border-black bg-slate-50 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-black text-white">
                      <Icon className="h-5 w-5" />
                    </div>
                    <span className="font-bold uppercase tracking-wider text-lg">{label}</span>
                    {required && <span className="text-xs font-bold bg-accent text-white px-2 py-0.5 uppercase">Required</span>}
                  </div>
                  {build[key as keyof Build] && (
                    <div className="flex items-center gap-2 text-green-600 font-bold uppercase text-sm">
                      <CheckCircle2 className="h-5 w-5" />
                      <span>Selected</span>
                    </div>
                  )}
                </div>

                <div className="p-6">
                  {build[key as keyof Build] ? (
                    <div className="flex items-center justify-between bg-white border-2 border-black p-4">
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-lg truncate">{build[key as keyof Build]?.name}</p>
                        <p className="text-xl font-mono font-bold text-accent mt-1">
                          ${build[key as keyof Build]?.price}
                        </p>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setBuild({ ...build, [key]: null })}
                        className="ml-4 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-none"
                      >
                        <Trash2 className="h-5 w-5" />
                      </Button>
                    </div>
                  ) : (
                    <div className="text-center py-6 border-2 border-dashed border-slate-300 hover:border-black hover:bg-slate-50 transition-all">
                      <p className="mb-4 text-muted-foreground font-mono uppercase text-sm">No component selected</p>
                      <Select onValueChange={(value) => {
                        const selectedPart = getAvailableParts(key).find(part => part.id === value);
                        if (selectedPart) {
                          handleComponentSelect(key, selectedPart);
                        }
                      }}>
                        <SelectTrigger className="w-full max-w-sm mx-auto bg-white border-2 border-black rounded-none h-12 font-bold focus:ring-0 focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                          <SelectValue placeholder={`SELECT ${label.toUpperCase()}`} />
                        </SelectTrigger>
                        <SelectContent className="border-2 border-black rounded-none shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                          {getAvailableParts(key).map((part) => (
                            <SelectItem key={part.id} value={part.id} className="cursor-pointer py-3 focus:bg-accent focus:text-white rounded-none font-medium">
                              <div className="flex justify-between items-center w-full gap-4">
                                <span className="truncate">{part.name}</span>
                                <span className="font-bold font-mono ml-2">${part.price}</span>
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
            <div className="sticky top-24 border-2 border-black bg-white shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
              <div className="p-4 border-b-2 border-black bg-black text-white">
                <h3 className="font-bold uppercase tracking-widest flex items-center gap-2">
                  <Box className="h-5 w-5" />
                  Build Summary
                </h3>
              </div>

              <div className="p-6 space-y-6">
                <div className="bg-slate-100 p-6 border-2 border-black text-center">
                  <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground block mb-2">Total Estimated Cost</span>
                  <div className="text-5xl font-bold font-display text-accent">${totalCost.toFixed(2)}</div>
                </div>

                <div className={`p-4 border-2 border-black flex items-start gap-3 ${isCompatible ? "bg-green-100" : "bg-amber-100"}`}>
                  {isCompatible ? (
                    <CheckCircle2 className="h-6 w-6 text-green-700 flex-shrink-0" />
                  ) : (
                    <XCircle className="h-6 w-6 text-amber-700 flex-shrink-0" />
                  )}
                  <div>
                    <p className="font-bold uppercase text-sm mb-1">
                      {isCompatible ? "System Compatible" : "Incomplete Build"}
                    </p>
                    <p className="text-xs font-mono leading-relaxed opacity-80">
                      {isCompatible
                        ? "All systems nominal. Ready for fabrication."
                        : "Critical components missing. Cannot validate."}
                    </p>
                  </div>
                </div>

                <Button
                  className="w-full h-14 text-lg font-bold uppercase tracking-wider rounded-none bg-black text-white hover:bg-accent shadow-[4px_4px_0px_0px_rgba(0,0,0,0.5)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-0.5 transition-all border-2 border-transparent"
                  disabled={!isCompatible}
                  onClick={() => setShowSaveDialog(true)}
                >
                  <Save className="w-5 h-5 mr-2" />
                  Save Configuration
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Save Build Dialog */}
        {showSaveDialog && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            <div className="w-full max-w-md bg-white border-2 border-black shadow-[8px_8px_0px_0px_rgba(255,255,255,1)] p-8">
              <h2 className="text-2xl font-bold uppercase tracking-tighter mb-6 font-display">Save Configuration</h2>
              <div className="space-y-6">
                <div>
                  <label className="font-bold uppercase text-sm mb-2 block">Build Identifier</label>
                  <Input
                    placeholder="ENTER NAME..."
                    value={buildName}
                    onChange={(e) => setBuildName(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSaveBuild()}
                    autoFocus
                    className="h-12 rounded-none border-2 border-black font-mono"
                  />
                </div>
                <div className="flex gap-4">
                  <Button
                    variant="outline"
                    className="flex-1 h-12 rounded-none border-2 border-black hover:bg-slate-100 font-bold uppercase"
                    onClick={() => {
                      setShowSaveDialog(false);
                      setBuildName("");
                    }}
                  >
                    Cancel
                  </Button>
                  <Button
                    className="flex-1 h-12 rounded-none bg-accent text-white border-2 border-black hover:bg-black font-bold uppercase shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
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
