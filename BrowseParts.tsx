import { useState, useEffect } from "react";
import Navigation from "@/components/Navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Search, ExternalLink } from "lucide-react";
import pcPartsData from "@/data/pc-parts.json";

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

const BrowseParts = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [allComponents, setAllComponents] = useState<Component[]>([]);

  useEffect(() => {
    // Flatten all components from the JSON data
    const components: Component[] = [];
    Object.entries(pcPartsData).forEach(([category, items]) => {
      if (Array.isArray(items)) {
        items.forEach((item: any) => {
          components.push({ ...item, componentType: category });
        });
      }
    });
    setAllComponents(components);
  }, []);

  const categories = ["all", ...Object.keys(pcPartsData)];

  const filteredComponents = allComponents.filter((component) => {
    const matchesSearch = component.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         component.brand.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "all" || component.componentType === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen">
      <Navigation />
      
      <main className="container py-8">
        <div className="mb-8 text-center">
          <h1 className="mb-4 text-4xl font-bold text-gradient">Browse PC Parts</h1>
          <p className="text-lg text-muted-foreground">
            Explore our extensive catalog of components
          </p>
        </div>

        <Card className="card-gradient mb-8 border-border">
          <CardContent className="pt-6">
            <div className="flex flex-col gap-4 md:flex-row">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search components..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-full md:w-[200px]">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category === "all" ? "All Categories" : category.toUpperCase()}
                    </ElectedItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="mt-4 text-sm text-muted-foreground">
              Found {filteredComponents.length} components
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredComponents.map((component, index) => (
            <Card key={index} className="group card-gradient border-border transition-all hover:glow hover:border-primary">
              <CardContent className="p-6">
                <div className="mb-4 flex items-start justify-between">
                  <div>
                    <Badge variant="secondary" className="mb-2">
                      {component.category}
                    </Badge>
                    <h3 className="font-bold">{component.name}</h3>
                    <p className="text-sm text-muted-foreground">{component.brand}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-primary">${component.price}</p>
                  </div>
                </div>

                <div className="mb-4 space-y-1 text-sm">
                  {/* CPU */}
                  {component.cores && (
                    <p className="text-muted-foreground">
                      <span className="font-semibold">Cores:</span> {component.cores}
                    </p>
                  )}
                  {component.threads && (
                    <p className="text-muted-foreground">
                      <span className="font-semibold">Threads:</span> {component.threads}
                    </p>
                  )}
                  
                  {/* GPU */}
                  {component.vram && (
                    <p className="text-muted-foreground">
                      <span className="font-semibold">VRAM:</span> {component.vram}GB
                    </p>
                  )}

                  {/* RAM */}
                  {component.specs?.capacity && (
                    <p className="text-muted-foreground">
                      <span className="font-semibold">Capacity:</span> {component.specs.capacity} ({component.specs.type})
                    </p>
                  )}
                  {component.specs?.speed && (
                    <p className="text-muted-foreground">
                      <span className="font-semibold">Speed:</span> {component.specs.speed}
                    </p>
                  )}

                  {/* Storage */}
                  {component.capacity && (
                    <p className="text-muted-foreground">
                      <span className="font-semibold">Capacity:</span> {component.capacity}
                    </p>
                  )}

                  {/* Motherboard & CPU & Storage */}
                  {component.socket && (
                    <p className="text-muted-foreground">
                      <span className="font-semibold">Socket:</span> {component.socket}
                    </p>
                  )}

                  {/* Motherboard & Case */}
                  {component.formfactor && (
                    <p className="text-muted-foreground">
                      <span className="font-semibold">Form Factor:</span> {component.formfactor}
                    </p>
                  )}
                  
                  {/* PSU */}
                  {component.wattage && (
                    <p className="text-muted-foreground">
                      <span className="font-semibold">Wattage:</span> {component.wattage}W
                    </p>
                  )}
                </div>

                <div className="flex gap-2">
                  <Button variant="outline" className="flex-1">
                    Add to Build
                  </Button>
                  {component.link && (
                    <Button size="icon" variant="ghost" asChild>
                      <a href={component.link} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="h-4 w-4" />
                      </a>
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredComponents.length === 0 && (
          <div className="py-20 text-center">
            <p className="text-lg text-muted-foreground">No components found matching your criteria</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default BrowseParts;
