import { useState } from "react";
import Navigation from "@/components/Navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Cpu, HardDrive, Zap, Box, CheckCircle2, XCircle, MemoryStick, Save } from "lucide-react";
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
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navigation />

      <main className="container py-8 flex-grow">
        <div className="mb-8 text-center animate-fade-in-up">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-orange-100 text-orange-600 mb-4 shadow-sm">
            <Box className="w-8 h-8" />
          </div>
          <h1 className="mb-3 text-4xl font-bold text-slate-900">Manual Builder</h1>
          <p className="text-lg text-slate-500 max-w-2xl mx-auto">
            Hand-pick every component for your perfect build with our precision tools.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-[2fr_1fr] max-w-6xl mx-auto">
          <div className="space-y-6 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
            {componentCategories.map(({ key, label, icon: Icon, required }) => (
              <Card key={key} className="border-0 shadow-xl shadow-slate-200/50 hover:shadow-2xl hover:shadow-slate-200/60 transition-all duration-300 overflow-visible">
                <CardHeader className="pb-4 border-b border-slate-100 bg-white rounded-t-2xl">
                  <CardTitle className="flex items-center justify-between text-lg">
                    <div className="flex items-center gap-3">
                      <div className="p-2.5 rounded-xl bg-orange-50 text-orange-600">
                        <Icon className="h-5 w-5" />
                      </div>
                      <span className="font-bold text-slate-900">{label}</span>
                      {required && <Badge variant="secondary" className="text-xs bg-slate-100 text-slate-500 font-medium">Required</Badge>}
                    </div>
                    {build[key as keyof Build] && (
                      <div className="flex items-center gap-2 text-green-600 animate-in fade-in bg-green-50 px-3 py-1 rounded-full">
                        <CheckCircle2 className="h-4 w-4" />
                        <span className="text-xs font-bold uppercase tracking-wide">Selected</span>
                      </div>
                    )}
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-6 bg-white rounded-b-2xl">
                  {build[key as keyof Build] ? (
                    <div className="flex items-center justify-between rounded-2xl bg-slate-50 border border-slate-100 p-4 group hover:border-orange-200 transition-colors">
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-lg truncate text-slate-900">{build[key as keyof Build]?.name}</p>
                        <p className="text-sm text-orange-600 font-bold mt-1">
                          ${build[key as keyof Build]?.price}
                        </p>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setBuild({ ...build, [key]: null })}
                        className="ml-4 flex-shrink-0 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-full"
                      >
                        Change
                      </Button>
                    </div>
                  ) : (
                    <div className="text-center py-8 border-2 border-dashed border-slate-200 rounded-2xl hover:border-orange-300 hover:bg-orange-50/30 transition-all duration-300">
                      <p className="mb-4 text-slate-500 font-medium">No {label.toLowerCase()} selected</p>
                      <Select onValueChange={(value) => {
                        const selectedPart = getAvailableParts(key).find(part => part.id === value);
                        if (selectedPart) {
                          handleComponentSelect(key, selectedPart);
                        }
                      }}>
                        <SelectTrigger className="w-full max-w-sm mx-auto bg-white border-slate-200 shadow-sm h-12 rounded-xl focus:ring-orange-500/20">
                          <SelectValue placeholder={`Select ${label}`} />
                        </SelectTrigger>
                        <SelectContent className="max-h-[300px] shadow-xl shadow-slate-200/50 border-0 rounded-xl">
                          {getAvailableParts(key).map((part) => (
                            <SelectItem key={part.id} value={part.id} className="focus:bg-orange-50 focus:text-orange-900 cursor-pointer py-3">
                              <div className="flex justify-between items-center w-full gap-4">
                                <span className="truncate font-medium">{part.name}</span>
                                <span className="text-orange-600 font-bold ml-2">${part.price}</span>
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

          <div className="space-y-6 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            <Card className="sticky top-24 border-0 shadow-2xl shadow-slate-200/60 bg-white rounded-3xl overflow-hidden">
              <CardHeader className="pb-4 border-b border-slate-100 bg-slate-50/50">
                <CardTitle className="text-lg flex items-center gap-2 text-slate-900">
                  <Box className="h-5 w-5 text-orange-500" />
                  Build Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6 pt-6">
                <div className="rounded-2xl bg-slate-900 p-6 text-center shadow-lg shadow-slate-900/20 text-white relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-20 h-20 bg-orange-500/20 rounded-full blur-2xl -mr-10 -mt-10"></div>
                  <span className="text-slate-400 text-xs uppercase tracking-widest font-bold relative z-10">Total Estimated Cost</span>
                  <div className="text-4xl font-bold text-white mt-2 relative z-10">${totalCost.toFixed(2)}</div>
                </div>

                <div className={`rounded-2xl p-4 flex items-start gap-3 transition-all duration-300 ${isCompatible ? "bg-green-50 border border-green-100" : "bg-amber-50 border border-amber-100"
                  }`}>
                  {isCompatible ? (
                    <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                  ) : (
                    <XCircle className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
                  )}
                  <div>
                    <p className={`font-bold text-sm ${isCompatible ? "text-green-700" : "text-amber-700"}`}>
                      {isCompatible ? "Compatible Build" : "Build Incomplete"}
                    </p>
                    <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                      {isCompatible
                        ? "All selected components are compatible."
                        : "Please select all required components to validate compatibility."}
                    </p>
                  </div>
                </div>

                <Button
                  className="w-full h-12 text-base shadow-lg shadow-orange-500/25 hover:shadow-orange-500/40"
                  disabled={!isCompatible}
                  size="lg"
                  onClick={() => setShowSaveDialog(true)}
                >
                  <Save className="w-4 h-4 mr-2" />
                  Save Configuration
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Save Build Dialog */}
        {showSaveDialog && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            <Card className="w-full max-w-md bg-white border-0 shadow-2xl rounded-3xl overflow-hidden">
              <CardHeader className="bg-slate-50 border-b border-slate-100 pb-6">
                <CardTitle className="text-xl text-slate-900">Save Your Build</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6 pt-6">
                <div>
                  <label className="text-sm font-semibold mb-2 block text-slate-700">Name your masterpiece</label>
                  <Input
                    placeholder="e.g., The Orange Beast"
                    value={buildName}
                    onChange={(e) => setBuildName(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSaveBuild()}
                    autoFocus
                    className="h-12 bg-slate-50 border-slate-200"
                  />
                </div>
                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    className="flex-1 h-12 rounded-xl border-slate-200 hover:bg-slate-50 text-slate-600"
                    onClick={() => {
                      setShowSaveDialog(false);
                      setBuildName("");
                    }}
                  >
                    Cancel
                  </Button>
                  <Button
                    className="flex-1 h-12 rounded-xl bg-orange-500 hover:bg-orange-600 text-white shadow-lg shadow-orange-500/20"
                    onClick={handleSaveBuild}
                  >
                    Save Build
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
