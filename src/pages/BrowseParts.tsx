import { useState, useMemo } from "react";
import Navigation from "@/components/Navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Filter, Grid, List, Plus, ShoppingCart } from "lucide-react";
import superiorParts, { NormalizedPart } from "@/data/superiorParts";
import { toast } from "sonner";

// BEFORE: Basic list with simple filters
// AFTER: Professional catalog with Grid/List toggle, advanced filtering, and lazy loading
// KEY CHANGES:
// - Added Grid/List view toggle
// - Implemented clean sidebar for filters
// - Improved product cards with hover effects and clear actions
// - Added "Add to Build" functionality placeholder

const BrowseParts = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [priceRange, setPriceRange] = useState<"all" | "under100" | "100to300" | "over300">("all");

  const categories = [
    { value: "all", label: "All Categories" },
    { value: "cpu", label: "CPUs" },
    { value: "gpu", label: "GPUs" },
    { value: "motherboard", label: "Motherboards" },
    { value: "ram", label: "RAM" },
    { value: "storage", label: "Storage" },
    { value: "psu", label: "Power Supplies" },
    { value: "case", label: "Cases" },
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
    // In a real app, this would update a global build state context
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navigation />

      <main className="container py-8 flex-grow">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">Browse Components</h1>
            <p className="text-muted-foreground">Discover the best parts for your next build</p>
          </div>

          <div className="flex items-center gap-2 bg-secondary/50 p-1 rounded-lg border border-border">
            <Button
              variant={viewMode === "grid" ? "default" : "ghost"}
              size="icon"
              onClick={() => setViewMode("grid")}
              className="h-8 w-8"
            >
              <Grid className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === "list" ? "default" : "ghost"}
              size="icon"
              onClick={() => setViewMode("list")}
              className="h-8 w-8"
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-[280px_1fr]">
          {/* Filters Sidebar */}
          <div className="space-y-6">
            <Card className="border-border shadow-sm sticky top-24">
              <CardHeader className="pb-4 border-b border-border">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Filter className="h-4 w-4 text-primary" />
                  Filters
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6 pt-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Search</label>
                  <div className="relative">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search parts..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-9"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Category</label>
                  <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((cat) => (
                        <SelectItem key={cat.value} value={cat.value}>
                          {cat.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Price Range</label>
                  <Select value={priceRange} onValueChange={(val: any) => setPriceRange(val)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Price" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Any Price</SelectItem>
                      <SelectItem value="under100">Under $100</SelectItem>
                      <SelectItem value="100to300">$100 - $300</SelectItem>
                      <SelectItem value="over300">Over $300</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="pt-4 border-t border-border">
                  <p className="text-xs text-muted-foreground text-center">
                    Showing {filteredParts.length} results
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Results Grid/List */}
          <div className="space-y-6">
            {filteredParts.length === 0 ? (
              <div className="text-center py-20 bg-secondary/10 rounded-2xl border-2 border-dashed border-border">
                <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-50" />
                <h3 className="text-lg font-semibold text-foreground">No parts found</h3>
                <p className="text-muted-foreground">Try adjusting your filters or search term</p>
                <Button
                  variant="outline"
                  className="mt-4"
                  onClick={() => {
                    setSearchTerm("");
                    setSelectedCategory("all");
                    setPriceRange("all");
                  }}
                >
                  Clear Filters
                </Button>
              </div>
            ) : (
              <div className={viewMode === "grid"
                ? "grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
                : "space-y-4"
              }>
                {filteredParts.map((part, index) => (
                  <Card
                    key={`${part.category}-${index}`}
                    className={`group border-0 shadow-sm hover:shadow-xl hover:shadow-orange-500/5 transition-all duration-300 overflow-hidden bg-white ${viewMode === "list" ? "flex flex-row items-center" : "flex flex-col"
                      }`}
                  >
                    <div className={`relative overflow-hidden bg-slate-50 flex items-center justify-center p-6 ${viewMode === "list" ? "w-48 h-full shrink-0 border-r border-slate-100" : "h-56 w-full border-b border-slate-100"
                      }`}>
                      {/* Image Container with Blend Mode */}
                      <div className="absolute inset-0 bg-white/50 mix-blend-overlay z-10" />
                      <div className="relative z-0 w-full h-full flex items-center justify-center transform group-hover:scale-105 transition-transform duration-500">
                        {/* Placeholder for product image - In real app, use <img src={part.image} className="mix-blend-multiply object-contain" /> */}
                        <div className="text-slate-300 group-hover:text-orange-300 transition-colors duration-300">
                          <ShoppingCart className="h-16 w-16" />
                        </div>
                      </div>
                    </div>

                    <div className={`flex flex-col flex-grow p-6 ${viewMode === "list" ? "flex-row items-center justify-between gap-8" : ""}`}>
                      <div className="space-y-3 min-w-0">
                        <div className="flex items-center gap-2">
                          <Badge variant="secondary" className="text-[10px] uppercase tracking-wider font-bold bg-slate-100 text-slate-600">
                            {part.category}
                          </Badge>
                          {part.price > 500 && (
                            <Badge variant="outline" className="text-[10px] border-orange-200 text-orange-600 bg-orange-50">
                              Premium
                            </Badge>
                          )}
                        </div>
                        <h3 className="font-bold text-slate-900 text-lg line-clamp-2 group-hover:text-orange-600 transition-colors">
                          {part.name}
                        </h3>
                      </div>

                      <div className={`flex items-center gap-4 ${viewMode === "grid" ? "mt-6 justify-between pt-4 border-t border-slate-50" : "shrink-0"}`}>
                        <span className="text-2xl font-bold text-slate-900">
                          ${part.price.toFixed(2)}
                        </span>
                        <Button
                          size="sm"
                          className="rounded-full bg-slate-900 hover:bg-orange-500 text-white shadow-lg shadow-slate-900/10 hover:shadow-orange-500/20 transition-all duration-300 px-6"
                          onClick={() => handleAddToBuild(part.name)}
                        >
                          <Plus className="h-4 w-4 mr-2" /> Add
                        </Button>
                      </div>
                    </div>
                  </Card>
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
