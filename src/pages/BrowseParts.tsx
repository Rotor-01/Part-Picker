import { useState, useMemo } from "react";
import Navigation from "@/components/Navigation";
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
    <div className="min-h-screen flex flex-col bg-background font-sans">
      <Navigation />

      <main className="container py-12 flex-grow">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-4">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-2 font-display">
              Component Catalog
            </h1>
            <p className="text-lg text-muted-foreground">
              Explore our curated database of premium components.
            </p>
          </div>

          <div className="flex items-center gap-2 bg-secondary/30 p-1 rounded-lg border border-border">
            <Button
              variant={viewMode === "grid" ? "default" : "ghost"}
              size="icon"
              onClick={() => setViewMode("grid")}
              className={`h-9 w-9 rounded-md ${viewMode === "grid" ? "shadow-sm" : ""}`}
            >
              <Grid className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === "list" ? "default" : "ghost"}
              size="icon"
              onClick={() => setViewMode("list")}
              className={`h-9 w-9 rounded-md ${viewMode === "list" ? "shadow-sm" : ""}`}
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-[280px_1fr]">
          {/* Filters Sidebar */}
          <div className="space-y-6">
            <div className="border border-border rounded-2xl bg-card shadow-subtle sticky top-24 overflow-hidden">
              <div className="p-4 border-b border-border bg-secondary/30">
                <h3 className="font-semibold flex items-center gap-2 text-sm uppercase tracking-wide text-muted-foreground">
                  <Filter className="h-4 w-4" />
                  Filters
                </h3>
              </div>
              <div className="p-6 space-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Search</label>
                  <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search parts..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 h-10 rounded-lg"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Category</label>
                  <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                    <SelectTrigger className="h-10 rounded-lg">
                      <SelectValue placeholder="Select Category" />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl shadow-medium">
                      {categories.map((cat) => (
                        <SelectItem key={cat.value} value={cat.value} className="cursor-pointer rounded-lg my-1">
                          {cat.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Price Range</label>
                  <Select value={priceRange} onValueChange={(val: any) => setPriceRange(val)}>
                    <SelectTrigger className="h-10 rounded-lg">
                      <SelectValue placeholder="Select Price" />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl shadow-medium">
                      <SelectItem value="all" className="cursor-pointer rounded-lg my-1">Any Price</SelectItem>
                      <SelectItem value="under100" className="cursor-pointer rounded-lg my-1">Under $100</SelectItem>
                      <SelectItem value="100to300" className="cursor-pointer rounded-lg my-1">$100 - $300</SelectItem>
                      <SelectItem value="over300" className="cursor-pointer rounded-lg my-1">Over $300</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="pt-4 border-t border-border">
                  <p className="text-xs text-center text-muted-foreground">
                    Showing {filteredParts.length} components
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Results Grid/List */}
          <div className="space-y-6">
            {filteredParts.length === 0 ? (
              <div className="text-center py-20 border border-dashed border-border rounded-2xl bg-secondary/10">
                <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-50" />
                <h3 className="text-xl font-semibold mb-2">No parts found</h3>
                <p className="text-muted-foreground mb-6">Adjust your filters to locate components</p>
                <Button
                  variant="outline"
                  className="rounded-full px-6"
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
                    className={`group border border-border rounded-2xl bg-card shadow-subtle hover:shadow-medium hover:-translate-y-1 transition-all duration-300 overflow-hidden ${viewMode === "list" ? "flex flex-row items-center" : "flex flex-col"
                      }`}
                  >
                    <div className={`relative bg-secondary/30 flex items-center justify-center p-6 ${viewMode === "list" ? "w-48 h-full shrink-0 border-r border-border" : "h-48 w-full border-b border-border"
                      }`}>
                      <div className="text-muted-foreground/30 group-hover:text-primary/80 transition-colors duration-300">
                        <ShoppingCart className="h-12 w-12" />
                      </div>
                      <Badge variant="secondary" className="absolute top-3 right-3 rounded-full text-[10px] font-semibold tracking-wide bg-background/80 backdrop-blur-sm shadow-sm">
                        {part.category}
                      </Badge>
                    </div>

                    <div className={`flex flex-col flex-grow p-5 ${viewMode === "list" ? "flex-row items-center justify-between gap-8" : ""}`}>
                      <div className="space-y-1.5 min-w-0">
                        <h3 className="font-semibold text-lg leading-tight line-clamp-2 group-hover:text-primary transition-colors">
                          {part.name}
                        </h3>
                        {part.price > 500 && (
                          <span className="inline-block text-[10px] font-bold uppercase tracking-wider text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                            Premium
                          </span>
                        )}
                      </div>

                      <div className={`flex items-center gap-4 ${viewMode === "grid" ? "mt-4 justify-between pt-4 border-t border-border/50" : "shrink-0"}`}>
                        <span className="text-xl font-bold text-foreground">
                          ${part.price.toFixed(2)}
                        </span>
                        <Button
                          size="sm"
                          className="rounded-full px-5 shadow-subtle hover:shadow-md transition-all"
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
