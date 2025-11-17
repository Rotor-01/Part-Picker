// Build storage utility for saving and retrieving PC builds from localStorage

export interface BuildComponent {
  name: string;
  price: number;
}

export interface SavedBuild {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  totalCost: number;
  components: {
    cpu: BuildComponent | null;
    motherboard: BuildComponent | null;
    gpu: BuildComponent | null;
    ram: BuildComponent | null;
    storage: BuildComponent | null;
    psu: BuildComponent | null;
    case: BuildComponent | null;
  };
  source: "manual" | "ai"; // Track whether it came from manual or AI builder
}

const STORAGE_KEY = "pc-builds";

export const buildStorage = {
  // Get all saved builds
  getAllBuilds: (): SavedBuild[] => {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error("Error reading builds from storage:", error);
      return [];
    }
  },

  // Get a single build by ID
  getBuildById: (id: string): SavedBuild | null => {
    const builds = buildStorage.getAllBuilds();
    return builds.find(build => build.id === id) || null;
  },

  // Save a new build
  saveBuild: (build: Omit<SavedBuild, "id" | "createdAt" | "updatedAt">): SavedBuild => {
    const builds = buildStorage.getAllBuilds();
    const newBuild: SavedBuild = {
      ...build,
      id: `build-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    builds.push(newBuild);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(builds));
    return newBuild;
  },

  // Update an existing build
  updateBuild: (id: string, updates: Partial<Omit<SavedBuild, "id" | "createdAt">>): SavedBuild | null => {
    const builds = buildStorage.getAllBuilds();
    const index = builds.findIndex(build => build.id === id);
    
    if (index === -1) return null;
    
    builds[index] = {
      ...builds[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(builds));
    return builds[index];
  },

  // Delete a build
  deleteBuild: (id: string): boolean => {
    const builds = buildStorage.getAllBuilds();
    const filtered = builds.filter(build => build.id !== id);
    
    if (filtered.length === builds.length) return false; // Build not found
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
    return true;
  },

  // Calculate total cost of components
  calculateTotalCost: (components: SavedBuild["components"]): number => {
    return Object.values(components).reduce((sum, component) => {
      return sum + (component?.price || 0);
    }, 0);
  },
};
