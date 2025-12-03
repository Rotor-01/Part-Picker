import { useState, useMemo } from "react";
import Navigation from "@/components/Navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Filter, Grid, List, Plus, ShoppingCart, X } from "lucide-react";
import superiorParts, { NormalizedPart } from "@/data/superiorParts";
import { toast } from "sonner";

const BrowseParts = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [priceRange, setPriceRange] = useState<"all" | "under100" | "100to300" | "over300">("all");

  const categories = [
    { value: "all", label: "ALL CATEGORIES" },
    { value: "cpu", label: "CPU" },
    { value: "gpu", label: "GPU" },
    { value: "motherboard", label: "MOTHERBOARD" },
    { value: "ram", label: "RAM" },
    { value: "storage", label: "STORAGE" },
    { value: "psu", label: "POWER SUPPLY" },
    { value: "case", label: "CASE" },
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
    <div className="min-h-screen flex flex-col bg-background font-sans">
      <Navigation />

      <main className="container py-12 flex-grow">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 border-b-4 border-black pb-6 gap-4">
          <div>
            <h1 className="text-6xl font-bold uppercase tracking-tighter mb-2 font-display">
              COMPONENT <span className="text-accent">CATALOG</span>
            </h1>
            <p className="text-xl font-mono uppercase tracking-widest text-muted-foreground">
              // Select High-Performance Parts
            </p>
          </div>

          <div className="flex items-center gap-2 border-2 border-black p-1 bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            <Button
              variant={viewMode === "grid" ? "default" : "ghost"}
              size="icon"
              onClick={() => setViewMode("grid")}
              className={`h-10 w-10 rounded-none ${viewMode === "grid" ? "bg-black text-white" : "hover:bg-slate-100"}`}
            >
              <Grid className="h-5 w-5" />
            </Button>
            <Button
              variant={viewMode === "list" ? "default" : "ghost"}
              size="icon"
              onClick={() => setViewMode("list")}
              className={`h-10 w-10 rounded-none ${viewMode === "list" ? "bg-black text-white" : "hover:bg-slate-100"}`}
            >
              <List className="h-5 w-5" />
            </Button>
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-[300px_1fr]">
          {/* Filters Sidebar */}
          <div className="space-y-6">
            <div className="border-2 border-black bg-white shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] sticky top-24">
              <div className="p-4 border-b-2 border-black bg-black text-white">
                <h3 className="font-bold uppercase tracking-widest flex items-center gap-2">
                  <Filter className="h-4 w-4" />
                  Filters
                </h3>
              </div>
              <div className="p-6 space-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold uppercase">Search</label>
                  <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="SEARCH PARTS..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 h-12 rounded-none border-2 border-black focus:ring-0 focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] font-mono uppercase text-sm"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold uppercase">Category</label>
                  <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                    <SelectTrigger className="h-12 rounded-none border-2 border-black focus:ring-0 focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] font-bold uppercase">
                      <SelectValue placeholder="SELECT CATEGORY" />
                    </SelectTrigger>
                    <SelectContent className="rounded-none border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                      {categories.map((cat) => (
                        <SelectItem key={cat.value} value={cat.value} className="rounded-none focus:bg-accent focus:text-white font-medium uppercase">
                          {cat.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold uppercase">Price Range</label>
                  <Select value={priceRange} onValueChange={(val: any) => setPriceRange(val)}>
                    <SelectTrigger className="h-12 rounded-none border-2 border-black focus:ring-0 focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] font-bold uppercase">
                      <SelectValue placeholder="SELECT PRICE" />
                    </SelectTrigger>
                    <SelectContent className="rounded-none border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                      <SelectItem value="all" className="rounded-none focus:bg-accent focus:text-white font-medium uppercase">ANY PRICE</SelectItem>
                      <SelectItem value="under100" className="rounded-none focus:bg-accent focus:text-white font-medium uppercase">UNDER $100</SelectItem>
                      <SelectItem value="100to300" className="rounded-none focus:bg-accent focus:text-white font-medium uppercase">$100 - $300</SelectItem>
                      <SelectItem value="over300" className="rounded-none focus:bg-accent focus:text-white font-medium uppercase">OVER $300</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="pt-6 border-t-2 border-black">
                  <p className="text-xs font-mono uppercase text-center text-muted-foreground">
                    // Found {filteredParts.length} Components
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Results Grid/List */}
          <div className="space-y-6">
            {filteredParts.length === 0 ? (
              <div className="text-center py-20 border-2 border-dashed border-black bg-slate-50">
                <Search className="h-16 w-16 text-muted-foreground mx-auto mb-6 opacity-50" />
                <h3 className="text-2xl font-bold uppercase mb-2">No parts found</h3>
                <p className="text-muted-foreground font-mono uppercase mb-6">Adjust filters to locate components</p>
                <Button
                  variant="outline"
                  className="rounded-none border-2 border-black hover:bg-black hover:text-white font-bold uppercase"
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
                    className={`group border-2 border-black bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 transition-all duration-200 ${viewMode === "list" ? "flex flex-row items-center" : "flex flex-col"
                      }`}
                  >
                    <div className={`relative bg-slate-50 flex items-center justify-center p-6 border-b-2 border-black ${viewMode === "list" ? "w-48 h-full shrink-0 border-r-2 border-b-0" : "h-48 w-full"
                      }`}>
                      <div className="text-slate-300 group-hover:text-accent transition-colors duration-300">
                        <ShoppingCart className="h-12 w-12" />
                      </div>
                      <Badge className="absolute top-3 right-3 rounded-none bg-black text-white hover:bg-black font-bold uppercase text-[10px] tracking-wider">
                        {part.category}
                      </Badge>
                    </div>

                    <div className={`flex flex-col flex-grow p-6 ${viewMode === "list" ? "flex-row items-center justify-between gap-8" : ""}`}>
                      <div className="space-y-2 min-w-0">
                        <h3 className="font-bold text-lg leading-tight uppercase line-clamp-2 group-hover:text-accent transition-colors">
                          {part.name}
                        </h3>
                        {part.price > 500 && (
                          <span className="inline-block text-[10px] font-bold uppercase tracking-widest text-accent border border-accent px-1">
                            Premium Grade
                          </span>
                        )}
                      </div>

                      <div className={`flex items-center gap-4 ${viewMode === "grid" ? "mt-6 justify-between pt-4 border-t-2 border-slate-100" : "shrink-0"}`}>
                        <span className="text-2xl font-bold font-display text-black">
                          ${part.price.toFixed(2)}
                        </span>
                        <Button
                          size="sm"
                          className="rounded-none bg-black text-white hover:bg-accent hover:text-white shadow-[2px_2px_0px_0px_rgba(0,0,0,0.5)] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-0.5 transition-all font-bold uppercase tracking-wider px-6"
                          onClick={() => handleAddToBuild(part.name)}
                        >
                          <Plus className="h-4 w-4 mr-2" /> Add
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
