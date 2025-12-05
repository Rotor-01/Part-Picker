import { useState } from "react";
import { Navigation } from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Cpu, HardDrive, Zap, Box, CheckCircle2, XCircle, MemoryStick, Save, Trash2, Monitor, Mouse, Keyboard } from "lucide-react";
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

const MaskIcon = ({ src, className }: { src: string; className?: string }) => (
  <div
    className={className}
    style={{
      maskImage: `url(${src})`,
      WebkitMaskImage: `url(${src})`,
      maskSize: 'contain',
      WebkitMaskSize: 'contain',
      maskRepeat: 'no-repeat',
      WebkitMaskRepeat: 'no-repeat',
      maskPosition: 'center',
      WebkitMaskPosition: 'center',
      backgroundColor: 'currentColor'
    }}
  />
);

const MotherboardIcon = ({ className }: { className?: string }) => (
  <MaskIcon src="/icons/motherboard.png" className={className} />
);

const GpuIcon = ({ className }: { className?: string }) => (
  <MaskIcon src="/icons/gpu.png" className={className} />
);

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
    { key: "cpu", label: "Processor", icon: Cpu, required: true, desc: "The brain of your computer." },
    { key: "motherboard", label: "Motherboard", icon: MotherboardIcon, required: true, desc: "Connects all components together." },
    { key: "gpu", label: "Graphics Card", icon: GpuIcon, required: true, desc: "Renders images and video." },
    { key: "ram", label: "Memory (RAM)", icon: MemoryStick, required: false, desc: "Short-term data storage." },
    { key: "storage", label: "Storage", icon: HardDrive, required: true, desc: "Long-term data storage." },
    { key: "psu", label: "Power Supply", icon: Zap, required: true, desc: "Powers your components." },
    { key: "case", label: "Case", icon: Box, required: true, desc: "Houses your components." },
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
    <div className="min-h-screen flex flex-col bg-black text-foreground font-sans relative selection:bg-liquid-blue/30">
      {/* Liquid Background */}
      <div className="liquid-bg">
        <div className="liquid-blob bg-liquid-pink w-[500px] h-[500px] bottom-[-100px] left-[-100px] opacity-20 mix-blend-screen animate-blob"></div>
        <div className="liquid-blob bg-liquid-teal w-[600px] h-[600px] top-[10%] right-[-200px] opacity-20 mix-blend-screen animate-blob animation-delay-2000"></div>
      </div>
      <Navigation />

      <main className="container py-12 pt-32 flex-grow relative z-10">
        <div className="mb-16 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-6 animate-fade-in">
            <Cpu className="w-4 h-4 text-liquid-pink" />
            <span className="text-sm font-medium text-white/80">Precision Engineering</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-bold tracking-tighter mb-6 bg-clip-text text-transparent bg-gradient-to-b from-white to-white/40">
            Manual Studio
          </h1>
          <p className="text-xl text-white/60 max-w-2xl mx-auto">
            Craft your masterpiece component by component with our advanced compatibility engine.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-[2fr_1fr] max-w-7xl mx-auto">
          <div className="space-y-6">
            {componentCategories.map(({ key, label, icon: Icon, required, desc }, index) => (
              <div
                key={key}
                className="group glass rounded-3xl overflow-hidden hover:bg-white/10 transition-all duration-500 animate-slide-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="p-6 flex flex-col md:flex-row md:items-center gap-6">
                  <div className={`w-16 h-16 rounded-2xl flex items-center justify-center shrink-0 transition-colors duration-300 ${build[key as keyof Build] ? "bg-liquid-blue text-white shadow-glow" : "bg-white/5 text-white/40 group-hover:bg-white/10 group-hover:text-white"
                    }`}>
                    <Icon className="h-8 w-8" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-1">
                      <h3 className="text-xl font-bold">{label}</h3>
                      {required && <span className="text-[10px] font-bold uppercase tracking-wider bg-white/10 text-white/60 px-2 py-0.5 rounded-full">Required</span>}
                      {build[key as keyof Build] && (
                        <span className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider bg-green-500/20 text-green-400 px-2 py-0.5 rounded-full">
                          <CheckCircle2 className="h-3 w-3" /> Selected
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-white/40 mb-4">{desc}</p>

                    {build[key as keyof Build] ? (
                      <div className="flex items-center justify-between bg-white/5 rounded-xl p-4 border border-white/10">
                        <div className="flex-1 min-w-0 mr-4">
                          <p className="font-bold text-lg truncate text-white">{build[key as keyof Build]?.name}</p>
                          <p className="text-liquid-blue font-mono">${build[key as keyof Build]?.price}</p>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setBuild({ ...build, [key]: null })}
                          className="text-white/40 hover:text-destructive hover:bg-destructive/10 rounded-full"
                        >
                          <Trash2 className="h-5 w-5" />
                        </Button>
                      </div>
                    ) : (
                      <div className="relative">
                        <Select onValueChange={(value) => {
                          const selectedPart = getAvailableParts(key).find(part => part.id === value);
                          if (selectedPart) {
                            handleComponentSelect(key, selectedPart);
                          }
                        }}>
                          <SelectTrigger className="w-full h-14 rounded-xl border-white/10 bg-black/20 text-white hover:bg-black/40 transition-colors">
                            <SelectValue placeholder={`Select ${label}...`} />
                          </SelectTrigger>
                          <SelectContent className="glass border-white/10 text-white max-h-[300px]">
                            {getAvailableParts(key).map((part) => (
                              <SelectItem key={part.id} value={part.id} className="focus:bg-white/10 focus:text-white cursor-pointer py-3">
                                <div className="flex justify-between items-center w-full gap-8">
                                  <span className="font-medium">{part.name}</span>
                                  <span className="font-mono text-white/60">${part.price}</span>
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="space-y-6">
            <div className="sticky top-32 glass rounded-3xl p-8 shadow-glass animate-fade-in">
              <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                <Box className="h-5 w-5 text-liquid-purple" />
                Build Summary
              </h3>

              <div className="space-y-6">
                <div className="bg-black/20 p-6 rounded-2xl border border-white/5 text-center">
                  <span className="text-xs font-bold uppercase tracking-widest text-white/40 block mb-2">Total Estimated Cost</span>
                  <div className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-liquid-blue to-liquid-purple">
                    ${totalCost.toFixed(2)}
                  </div>
                </div>

                <div className={`p-4 rounded-2xl border flex items-start gap-3 transition-colors duration-500 ${isCompatible
                  ? "bg-green-500/10 border-green-500/20 text-green-400"
                  : "bg-amber-500/10 border-amber-500/20 text-amber-400"
                  }`}>
                  {isCompatible ? (
                    <CheckCircle2 className="h-5 w-5 flex-shrink-0 mt-0.5" />
                  ) : (
                    <XCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
                  )}
                  <div>
                    <p className="font-bold text-sm mb-1">
                      {isCompatible ? "System Compatible" : "Incomplete Build"}
                    </p>
                    <p className="text-xs opacity-80 leading-relaxed">
                      {isCompatible
                        ? "All core components selected. Ready for fabrication."
                        : "Please select at least a CPU and Motherboard to validate compatibility."}
                    </p>
                  </div>
                </div>

                <Button
                  className="w-full h-14 text-lg font-bold rounded-full shadow-glow"
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
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xl p-4 animate-in fade-in duration-300">
            <div className="w-full max-w-md glass rounded-3xl p-8 shadow-2xl border border-white/20">
              <h2 className="text-3xl font-bold tracking-tight mb-2 text-white">Save Build</h2>
              <p className="text-white/60 mb-8">Give your creation a name to save it to your library.</p>

              <div className="space-y-6">
                <div>
                  <label className="text-xs font-bold uppercase tracking-widest text-white/40 mb-2 block">Build Name</label>
                  <Input
                    placeholder="e.g., Quantum Beast 2026"
                    value={buildName}
                    onChange={(e) => setBuildName(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSaveBuild()}
                    autoFocus
                    className="h-14 text-lg bg-black/20 border-white/10 focus:border-liquid-blue/50"
                  />
                </div>
                <div className="flex gap-4">
                  <Button
                    variant="outline"
                    className="flex-1 h-14 rounded-2xl border-white/10 hover:bg-white/5"
                    onClick={() => {
                      setShowSaveDialog(false);
                      setBuildName("");
                    }}
                  >
                    Cancel
                  </Button>
                  <Button
                    className="flex-1 h-14 rounded-2xl bg-white text-black hover:bg-white/90"
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
