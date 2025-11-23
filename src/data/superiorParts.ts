import cpuJson from "../../pc-part-dataset-main/data/json/cpu.json" assert { type: "json" };
import gpuJson from "../../pc-part-dataset-main/data/json/video-card.json" assert { type: "json" };
import motherboardJson from "../../pc-part-dataset-main/data/json/motherboard.json" assert { type: "json" };
import memoryJson from "../../pc-part-dataset-main/data/json/memory.json" assert { type: "json" };
import storageJson from "../../pc-part-dataset-main/data/json/internal-hard-drive.json" assert { type: "json" };
import psuJson from "../../pc-part-dataset-main/data/json/power-supply.json" assert { type: "json" };
import caseJson from "../../pc-part-dataset-main/data/json/case.json" assert { type: "json" };

// Normalized shape the rest of the app can rely on
export interface NormalizedPart {
  name: string;
  brand: string;
  category: string; // e.g. Budget / Mid Range / High End / Enthusiast
  price: number;
  // Extra properties by part type
  [key: string]: unknown;
}

const MAX_ITEMS_PER_CATEGORY = 400; // keep UI performant

const normalizedPrice = (value?: number | null): number | null => {
  if (typeof value !== "number" || !Number.isFinite(value) || value <= 0) return null;
  return Math.round(value * 100) / 100;
};

const KNOWN_BRANDS = [
  "AMD", "Intel", "NVIDIA", "ASUS", "MSI", "Gigabyte",
  "Corsair", "Crucial", "Kingston", "Samsung", "Seagate",
  "Western Digital", "EVGA", "Cooler Master", "Noctua",
  "be quiet!", "Lian Li", "Fractal Design", "NZXT",
  "SeaSonic", "Thermaltake", "Logitech", "Razer"
];

const deriveBrand = (name?: string): string => {
  if (!name) return "Unknown";
  const nameLower = name.toLowerCase();
  for (const brand of KNOWN_BRANDS) {
    if (nameLower.startsWith(brand.toLowerCase())) {
      return brand;
    }
  }
  const [firstWord] = name.trim().split(/\s+/);
  if (!firstWord) return "Unknown";
  const clean = firstWord.replace(/[^A-Za-z0-9+.-]/g, "");
  return clean || "Unknown";
};

const categorizePrice = (price: number): string => {
  if (price < 150) return "Budget";
  if (price < 400) return "Mid Range";
  if (price < 800) return "High End";
  return "Enthusiast";
};

const limitItems = <T,>(items: T[]): T[] =>
  items.length > MAX_ITEMS_PER_CATEGORY ? items.slice(0, MAX_ITEMS_PER_CATEGORY) : items;

// --- Raw types (subset of the official API shapes) ---

type RawPart = {
  name: string;
  price?: number | null;
  [key: string]: unknown;
};

type RawCpu = RawPart & {
  core_count?: number;
  thread_count?: number;
  core_clock?: number;
  boost_clock?: number;
  microarchitecture?: string;
  tdp?: number;
  graphics?: string | null;
};

type RawGpu = RawPart & {
  chipset?: string;
  memory?: number;
  core_clock?: number;
  boost_clock?: number;
  color?: string;
  length?: number;
};

type RawMotherboard = RawPart & {
  socket?: string;
  form_factor?: string;
  max_memory?: number;
  memory_slots?: number;
  color?: string;
};

type RawMemory = RawPart & {
  speed?: [number, number] | null;
  modules?: [number, number] | null;
  cas_latency?: number;
  first_word_latency?: number;
  color?: string;
};

type RawStorage = RawPart & {
  capacity?: number;
  type?: string | number;
  interface?: string;
  form_factor?: string | number;
  cache?: number;
};

type RawPsu = RawPart & {
  type?: string;
  efficiency?: string;
  wattage?: number;
  modular?: string | boolean;
  color?: string;
};

type RawCase = RawPart & {
  type?: string;
  color?: string;
  side_panel?: string;
  psu?: number;
  external_volume?: number;
  internal_35_bays?: number;
};

// --- Helpers for specific fields ---

const normalizeMemorySpecs = (item: RawMemory) => {
  const [ddrVersion, speedMHz] = Array.isArray(item.speed) ? item.speed : [];
  const [moduleCount, moduleSize] = Array.isArray(item.modules) ? item.modules : [];
  const totalCapacity = moduleCount && moduleSize ? `${moduleCount * moduleSize}GB` : undefined;

  return {
    type: typeof ddrVersion === "number" ? `DDR${ddrVersion}` : undefined,
    speed: typeof speedMHz === "number" ? `${speedMHz} MHz` : undefined,
    capacity: totalCapacity,
    latency: typeof item.cas_latency === "number" ? `CL${item.cas_latency}` : undefined,
    modules: moduleCount && moduleSize ? `${moduleCount}x${moduleSize}GB` : undefined,
  };
};

const formatCapacity = (capacity?: number) => {
  if (typeof capacity !== "number" || capacity <= 0) return undefined;
  if (capacity >= 1000) {
    const tb = capacity / 1000;
    return Number.isInteger(tb) ? `${tb} TB` : `${tb.toFixed(1)} TB`;
  }
  return `${capacity} GB`;
};

const normalizeModularity = (value?: string | boolean | null) => {
  if (typeof value === "boolean") return value ? "Modular" : "Non-Modular";
  if (typeof value === "string") {
    const normalized = value.toLowerCase();
    if (normalized === "false" || normalized === "no") return "Non-Modular";
    if (normalized === "full" || normalized === "semi") {
      return `${normalized.charAt(0).toUpperCase()}${normalized.slice(1)} Modular`;
    }
    return value;
  }
  return undefined;
};

const mapDataset = <TRaw, TResult extends NormalizedPart>(
  data: TRaw[],
  mapper: (item: TRaw) => TResult | null
): TResult[] => {
  return data.reduce<TResult[]>((acc, item) => {
    const mapped = mapper(item);
    if (mapped) acc.push(mapped);
    return acc;
  }, []);
};

// --- Normalizers per category ---

const normalizeCpu = (): NormalizedPart[] => {
  return limitItems(
    mapDataset(cpuJson as RawCpu[], (item) => {
      const price = normalizedPrice(item.price ?? null);
      if (price == null) return null;

      const threads =
        typeof item.thread_count === "number"
          ? item.thread_count
          : undefined;

      const part: NormalizedPart = {
        name: item.name,
        brand: deriveBrand(item.name),
        category: categorizePrice(price),
        price,
        cores: item.core_count,
        threads,
        coreClock: item.core_clock,
        boostClock: item.boost_clock,
        microarchitecture: item.microarchitecture,
        tdp: item.tdp,
        graphics: item.graphics ?? undefined,
      };

      return part;
    })
  );
};

const normalizeGpu = (): NormalizedPart[] => {
  return limitItems(
    mapDataset(gpuJson as RawGpu[], (item) => {
      const price = normalizedPrice(item.price ?? null);
      if (price == null) return null;

      const part: NormalizedPart = {
        name: item.name,
        brand: deriveBrand(item.name),
        category: categorizePrice(price),
        price,
        vram: item.memory,
        chipset: item.chipset,
        coreClock: item.core_clock,
        boostClock: item.boost_clock,
        color: item.color,
        length: item.length,
      };

      return part;
    })
  );
};

const normalizeMotherboard = (): NormalizedPart[] => {
  return limitItems(
    mapDataset(motherboardJson as RawMotherboard[], (item) => {
      const price = normalizedPrice(item.price ?? null);
      if (price == null) return null;

      const part: NormalizedPart = {
        name: item.name,
        brand: deriveBrand(item.name),
        category: categorizePrice(price),
        price,
        socket: item.socket,
        formfactor: item.form_factor,
        maxMemory: item.max_memory,
        memorySlots: item.memory_slots,
        color: item.color,
      };

      return part;
    })
  );
};

const normalizeMemory = (): NormalizedPart[] => {
  return limitItems(
    mapDataset(memoryJson as RawMemory[], (item) => {
      const price = normalizedPrice(item.price ?? null);
      if (price == null) return null;

      const part: NormalizedPart = {
        name: item.name,
        brand: deriveBrand(item.name),
        category: categorizePrice(price),
        price,
        specs: normalizeMemorySpecs(item),
        color: item.color,
        firstWordLatency: item.first_word_latency,
      };

      return part;
    })
  );
};

const normalizeStorage = (): NormalizedPart[] => {
  return limitItems(
    mapDataset(storageJson as RawStorage[], (item) => {
      const price = normalizedPrice(item.price ?? null);
      if (price == null) return null;

      const storageType = typeof item.type === "number" ? `${item.type} RPM` : item.type;
      const formfactor = typeof item.form_factor === "number" ? `${item.form_factor}\"` : item.form_factor;

      const part: NormalizedPart = {
        name: item.name,
        brand: deriveBrand(item.name),
        category: categorizePrice(price),
        price,
        capacity: formatCapacity(item.capacity),
        type: storageType,
        interface: item.interface,
        formfactor,
        cache: item.cache,
      };

      return part;
    })
  );
};

const normalizePsu = (): NormalizedPart[] => {
  return limitItems(
    mapDataset(psuJson as RawPsu[], (item) => {
      const price = normalizedPrice(item.price ?? null);
      if (price == null) return null;

      const part: NormalizedPart = {
        name: item.name,
        brand: deriveBrand(item.name),
        category: categorizePrice(price),
        price,
        wattage: item.wattage,
        rating: item.efficiency,
        modular: normalizeModularity(item.modular ?? null),
        type: item.type,
        color: item.color,
      };

      return part;
    })
  );
};

const normalizeCases = (): NormalizedPart[] => {
  return limitItems(
    mapDataset(caseJson as RawCase[], (item) => {
      const price = normalizedPrice(item.price ?? null);
      if (price == null) return null;

      const part: NormalizedPart = {
        name: item.name,
        brand: deriveBrand(item.name),
        category: categorizePrice(price),
        price,
        formfactor: item.type,
        color: item.color,
        sidePanel: item.side_panel,
        psu: typeof item.psu === "number" ? `${item.psu}W Included` : undefined,
      };

      return part;
    })
  );
};

const superiorParts = {
  cpu: normalizeCpu(),
  gpu: normalizeGpu(),
  motherboard: normalizeMotherboard(),
  ram: normalizeMemory(),
  storage: normalizeStorage(),
  psu: normalizePsu(),
  case: normalizeCases(),
} as const;

export type SuperiorDatabase = typeof superiorParts;
export type SuperiorCategory = keyof SuperiorDatabase;
export type SuperiorPart = SuperiorDatabase[SuperiorCategory][number];

export default superiorParts;
