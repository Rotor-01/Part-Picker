import { useState, useMemo } from "react";
import { Navigation } from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Filter, Grid, List, Plus, ShoppingCart, X, Package } from "lucide-react";
import superiorParts, { NormalizedPart } from "@/data/superiorParts";
import { toast } from "sonner";

const BrowseParts = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [priceRange, setPriceRange] = useState<"all" | "under100" | "100to300" | "over300">("all");

  const categories = [
    { value: "all", label: "All Categories" },
    { value: "cpu", label: "CPU" },
    { value: "gpu", label: "GPU" },
    { value: "motherboard", label: "Motherboard" },
    { value: "ram", label: "RAM" },
    { value: "storage", label: "Storage" },
    { value: "psu", label: "Power Supply" },
    { value: "case", label: "Case" },
  ];

  const allParts = useMemo(() => {
    let parts: (NormalizedPart & { category: string })[] = [];
    Object.entries(superiorParts).forEach(([category, categoryParts]) => {
      if (Array.isArray(categoryParts)) {
        parts = [...parts, ...categoryParts.map(p => ({ ...p, category }))];
      }
    });
    return parts;
  }, []);

  const filteredParts = useMemo(() => {
    return allParts.filter(part => {
      const matchesSearch = part.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === "all" || part.category === selectedCategory;

      let matchesPrice = true;
      if (priceRange === "under100") matchesPrice = part.price < 100;
      if (priceRange === "100to300") matchesPrice = part.price >= 100 && part.price <= 300;
      if (priceRange === "over300") matchesPrice = part.price > 300;

      return matchesSearch && matchesCategory && matchesPrice;
    });
  }, [allParts, searchTerm, selectedCategory, priceRange]);

  const handleAddToBuild = (partName: string) => {
    toast.success(`${partName} added to build!`);
  };

  return (
    <div className="min-h-screen flex flex-col bg-black text-foreground font-sans relative selection:bg-liquid-blue/30">
      {/* Liquid Background */}
      <div className="liquid-bg">
        <div className="liquid-blob bg-liquid-blue w-[400px] h-[400px] top-[20%] left-[20%] opacity-20 mix-blend-screen animate-blob"></div>
        <div className="liquid-blob bg-liquid-purple w-[500px] h-[500px] bottom-[10%] right-[10%] opacity-20 mix-blend-screen animate-blob animation-delay-2000"></div>
      </div>
      <Navigation />

      <main className="container py-12 pt-32 flex-grow relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-6 animate-fade-in">
              <Package className="w-4 h-4 text-liquid-blue" />
              <span className="text-sm font-medium text-white/80">Premium Components</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-bold tracking-tighter mb-4 bg-clip-text text-transparent bg-gradient-to-b from-white to-white/40">
              Catalog
            </h1>
            <p className="text-xl text-white/60">
              Explore our curated database of next-gen hardware.
            </p>
          </div>

          <div className="flex items-center gap-2 glass p-1 rounded-full">
            <Button
              variant={viewMode === "grid" ? "secondary" : "ghost"}
              size="icon"
              onClick={() => setViewMode("grid")}
              className={`h-10 w-10 rounded-full ${viewMode === "grid" ? "bg-white text-black" : "text-white/60"}`}
            >
              <Grid className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === "list" ? "secondary" : "ghost"}
              size="icon"
              onClick={() => setViewMode("list")}
              className={`h-10 w-10 rounded-full ${viewMode === "list" ? "bg-white text-black" : "text-white/60"}`}
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-[280px_1fr]">
          {/* Filters Sidebar */}
          <div className="space-y-6">
            <div className="glass rounded-3xl p-6 sticky top-32 animate-slide-up">
              <div className="flex items-center gap-2 mb-6 text-white/40 uppercase tracking-widest text-xs font-bold">
                <Filter className="h-4 w-4" />
                Filters
              </div>

              <div className="space-y-6">
                <div className="space-y-3">
                  <label className="text-sm font-medium text-white">Search</label>
                  <div className="relative">
                    <Search className="absolute left-3 top-3.5 h-4 w-4 text-white/40" />
                    <Input
                      placeholder="Search parts..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 h-12 bg-black/20 border-white/10"
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="text-sm font-medium text-white">Category</label>
                  <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                    <SelectTrigger className="h-12 rounded-2xl bg-black/20 border-white/10 text-white">
                      <SelectValue placeholder="Select Category" />
                    </SelectTrigger>
                    <SelectContent className="glass border-white/10 text-white">
                      {categories.map((cat) => (
                        <SelectItem key={cat.value} value={cat.value} className="focus:bg-white/10 cursor-pointer">
                          {cat.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-3">
                  <label className="text-sm font-medium text-white">Price Range</label>
                  <Select value={priceRange} onValueChange={(val: any) => setPriceRange(val)}>
                    <SelectTrigger className="h-12 rounded-2xl bg-black/20 border-white/10 text-white">
                      <SelectValue placeholder="Select Price" />
                    </SelectTrigger>
                    <SelectContent className="glass border-white/10 text-white">
                      <SelectItem value="all" className="focus:bg-white/10 cursor-pointer">Any Price</SelectItem>
                      <SelectItem value="under100" className="focus:bg-white/10 cursor-pointer">Under $100</SelectItem>
                      <SelectItem value="100to300" className="focus:bg-white/10 cursor-pointer">$100 - $300</SelectItem>
                      <SelectItem value="over300" className="focus:bg-white/10 cursor-pointer">Over $300</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="pt-6 border-t border-white/10">
                  <p className="text-xs text-center text-white/40">
                    Showing {filteredParts.length} components
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Results Grid/List */}
          <div className="space-y-6">
            {filteredParts.length === 0 ? (
              <div className="text-center py-20 glass rounded-3xl border-dashed border-white/20">
                <Search className="h-12 w-12 text-white/20 mx-auto mb-4" />
                <h3 className="text-xl font-bold mb-2">No parts found</h3>
                <p className="text-white/60 mb-6">Adjust your filters to locate components</p>
                <Button
                  variant="outline"
                  className="rounded-full px-8 border-white/20 hover:bg-white/10"
                  onClick={() => {
                    setSearchTerm("");
                    setSelectedCategory("all");
                    setPriceRange("all");
                  }}
                >
                  Reset Filters
                </Button>
              </div>
            ) : (
              <div className={viewMode === "grid"
                ? "grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
                : "space-y-4"
              }>
                {filteredParts.map((part, index) => (
                  <div
                    key={`${part.category}-${index}`}
                    className={`group glass rounded-3xl overflow-hidden hover:bg-white/10 hover:scale-[1.02] transition-all duration-500 animate-slide-up ${viewMode === "list" ? "flex flex-row items-center" : "flex flex-col"}`}
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <div className={`relative flex items-center justify-center p-8 bg-gradient-to-br from-white/5 to-transparent ${viewMode === "list" ? "w-48 h-full shrink-0 border-r border-white/5" : "h-48 w-full border-b border-white/5"}`}>
                      <div className="text-white/20 group-hover:text-white group-hover:scale-110 transition-all duration-500">
                        <ShoppingCart className="h-12 w-12" />
                      </div>
                      <Badge variant="secondary" className="absolute top-4 right-4 rounded-full text-[10px] font-bold tracking-wide bg-black/40 backdrop-blur-md border border-white/10">
                        {part.category}
                      </Badge>
                    </div>

                    <div className={`flex flex-col flex-grow p-6 ${viewMode === "list" ? "flex-row items-center justify-between gap-8" : ""}`}>
                      <div className="space-y-2 min-w-0">
                        <h3 className="font-bold text-lg leading-tight line-clamp-2 text-white group-hover:text-liquid-blue transition-colors">
                          {part.name}
                        </h3>
                        {part.price > 500 && (
                          <span className="inline-block text-[10px] font-bold uppercase tracking-wider text-liquid-purple bg-liquid-purple/10 px-2 py-0.5 rounded-full">
                            Premium
                          </span>
                        )}
                      </div>

                      <div className={`flex items-center gap-4 ${viewMode === "grid" ? "mt-6 justify-between pt-4 border-t border-white/5" : "shrink-0"}`}>
                        <span className="text-2xl font-bold text-white">
                          ${part.price.toFixed(2)}
                        </span>
                        <Button
                          size="sm"
                          className="rounded-full px-6 bg-white text-black hover:bg-white/90 shadow-glow"
                          onClick={() => handleAddToBuild(part.name)}
                        >
                          <Plus className="h-4 w-4 mr-1.5" /> Add
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default BrowseParts;
