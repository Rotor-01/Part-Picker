import { useState, useEffect } from "react";
import Navigation from "@/components/Navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Search, ExternalLink, ChevronLeft, ChevronRight } from "lucide-react";
import superiorParts from "@/data/superiorParts";

interface Component {
  name: string;
  brand: string;
  category: string;
  price: number;
  image?: string;
  link?: string;
  componentType?: string; // This is added in useEffect

  // CPU
  cores?: number;
  threads?: number;
  socket?: string;

  // GPU
  vram?: number;
  powerdraw?: number;

  // Motherboard
  formfactor?: string;

  // Storage
  capacity?: string;

  // RAM
  specs?: {
    type: string;
    speed: string;
    capacity: string;
    latency: string;
    modules: string;
  };

  // PSU
  wattage?: number;
  rating?: string;

  // Case
  color?: string;
}

const ITEMS_PER_PAGE = 24;

const BrowseParts = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [allComponents, setAllComponents] = useState<Component[]>([]);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    // Flatten all components from the superior parts database
    const components: Component[] = [];
    Object.entries(superiorParts).forEach(([category, items]) => {
      if (Array.isArray(items)) {
        items.forEach((item: Component) => {
          components.push({ ...item, componentType: category });
        });
      }
    });
    setAllComponents(components);
  }, []);

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedCategory]);

  const categories = ["all", ...Object.keys(superiorParts)];

  const filteredComponents = allComponents.filter((component) => {
    const matchesSearch = component.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      component.brand.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "all" || component.componentType === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const totalPages = Math.ceil(filteredComponents.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedComponents = filteredComponents.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />

      <main className="container py-6 sm:py-8 flex-grow">
        <div className="mb-6 sm:mb-8 text-center">
          <h1 className="mb-3 sm:mb-4 text-2xl sm:text-3xl lg:text-4xl font-bold text-gradient">Browse PC Parts</h1>
          <p className="text-base sm:text-lg text-muted-foreground px-4">
            Explore our extensive catalog of components
          </p>
        </div>

        <Card className="card-gradient mb-6 sm:mb-8 border-border">
          <CardContent className="pt-4 sm:pt-6">
            <div className="flex flex-col gap-3 sm:gap-4 md:flex-row">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search components..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 text-sm sm:text-base bg-background/50"
                />
              </div>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-full md:w-[200px] bg-background/50">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category === "all" ? "All Categories" : category.toUpperCase()}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="mt-3 sm:mt-4 text-xs sm:text-sm text-muted-foreground flex justify-between items-center">
              <span>Found {filteredComponents.length} components</span>
              <span>Page {currentPage} of {totalPages}</span>
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-4 sm:gap-6 md:grid-cols-2 lg:grid-cols-3">
          {paginatedComponents.map((component) => (
            <Card key={`${component.name}-${component.category}`} className="group card-gradient border-border transition-all hover:glow hover:border-primary flex flex-col">
              <CardContent className="p-4 sm:p-6 flex flex-col h-full">
                <div className="mb-3 sm:mb-4 flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <Badge variant="secondary" className="mb-2 text-xs bg-primary/10 text-primary hover:bg-primary/20">
                      {component.category}
                    </Badge>
                    <h3 className="font-bold text-sm sm:text-base truncate" title={component.name}>{component.name}</h3>
                    <p className="text-xs sm:text-sm text-muted-foreground">{component.brand}</p>
                  </div>
                  <div className="text-right flex-shrink-0 ml-2">
                    <p className="text-lg sm:text-2xl font-bold text-primary">${component.price}</p>
                  </div>
                </div>

                <div className="mb-3 sm:mb-4 space-y-1 text-xs sm:text-sm flex-grow">
                  {/* CPU */}
                  {component.cores && (
                    <p className="text-muted-foreground">
                      <span className="font-semibold text-foreground">Cores:</span> {component.cores}
                    </p>
                  )}
                  {component.threads && (
                    <p className="text-muted-foreground">
                      <span className="font-semibold text-foreground">Threads:</span> {component.threads}
                    </p>
                  )}

                  {/* GPU */}
                  {component.vram && (
                    <p className="text-muted-foreground">
                      <span className="font-semibold text-foreground">VRAM:</span> {component.vram}GB
                    </p>
                  )}

                  {/* RAM */}
                  {component.specs?.capacity && (
                    <p className="text-muted-foreground">
                      <span className="font-semibold text-foreground">Capacity:</span> {component.specs.capacity} ({component.specs.type})
                    </p>
                  )}
                  {component.specs?.speed && (
                    <p className="text-muted-foreground">
                      <span className="font-semibold text-foreground">Speed:</span> {component.specs.speed}
                    </p>
                  )}

                  {/* Storage */}
                  {component.capacity && (
                    <p className="text-muted-foreground">
                      <span className="font-semibold text-foreground">Capacity:</span> {component.capacity}
                    </p>
                  )}

                  {/* Motherboard & CPU & Storage */}
                  {component.socket && (
                    <p className="text-muted-foreground">
                      <span className="font-semibold text-foreground">Socket:</span> {component.socket}
                    </p>
                  )}

                  {/* Motherboard & Case */}
                  {component.formfactor && (
                    <p className="text-muted-foreground">
                      <span className="font-semibold text-foreground">Form Factor:</span> {component.formfactor}
                    </p>
                  )}

                  {/* PSU */}
                  {component.wattage && (
                    <p className="text-muted-foreground">
                      <span className="font-semibold text-foreground">Wattage:</span> {component.wattage}W
                    </p>
                  )}
                </div>

                <div className="flex gap-2 mt-auto">
                  <Button variant="outline" className="flex-1 text-xs sm:text-sm hover:bg-primary/10 hover:text-primary hover:border-primary/50" size="sm">
                    Add to Build
                  </Button>
                  {component.link && (
                    <Button size="sm" variant="ghost" asChild className="hover:bg-primary/10 hover:text-primary">
                      <a href={component.link} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="h-3 w-3 sm:h-4 sm:w-4" />
                      </a>
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredComponents.length === 0 ? (
          <div className="py-12 sm:py-20 text-center">
            <p className="text-base sm:text-lg text-muted-foreground">No components found matching your criteria</p>
          </div>
        ) : (
          /* Pagination Controls */
          <div className="mt-8 flex justify-center items-center gap-4">
            <Button
              variant="outline"
              size="icon"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="hover:bg-primary/10 hover:text-primary"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="text-sm text-muted-foreground">
              Page {currentPage} of {totalPages}
            </span>
            <Button
              variant="outline"
              size="icon"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="hover:bg-primary/10 hover:text-primary"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        )}
      </main>
    </div>
  );
};

export default BrowseParts;
