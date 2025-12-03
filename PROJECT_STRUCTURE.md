# TRINITY AI PC Part Picker - Complete Project Documentation

## Table of Contents
- [1. Project Overview](#1-project-overview)
- [2. Quick Reference](#2-quick-reference)
- [3. Technology Stack](#3-technology-stack)
- [4. Project Structure](#4-project-structure)
- [5. Complete File Manifest](#5-complete-file-manifest)
- [6. Component Architecture](#6-component-architecture)
- [7. Data Flow & State Management](#7-data-flow--state-management)
- [8. Routing & Navigation](#8-routing--navigation)
- [9. Styling System](#9-styling-system)
- [10. Configuration Files](#10-configuration-files)
- [11. Dependencies](#11-dependencies)
- [12. Features & Functionality](#12-features--functionality)
- [13. Code Patterns & Standards](#13-code-patterns--standards)
- [14. Integration Points](#14-integration-points)
- [15. Build & Deployment](#15-build--deployment)
- [16. Development Guide](#16-development-guide)
- [17. Known Issues & Future Considerations](#17-known-issues--future-considerations)
- [Appendix A: Code Snippets](#appendix-a-code-snippets)
- [Appendix B: Design Assets](#appendix-b-design-assets)

## 1. Project Overview
**TRINITY AI PC Part Picker** is a modern, AI-powered web application designed to simplify the process of building custom PCs. It combines a traditional manual part picker with an advanced AI assistant that generates build recommendations based on user requirements.

### Key Features
- **AI Architect**: Conversational interface to generate complete PC builds based on natural language prompts (e.g., "Gaming PC under $1500").
- **Manual Studio**: Classic part picker interface with real-time compatibility checking and cost estimation.
- **Component Catalog**: Searchable database of PC parts with filtering by category, price, and specs.
- **Saved Builds**: Local storage-based system to save, view, and manage custom builds.
- **Brutalist Design**: Distinctive, high-contrast UI with hard shadows and bold typography.

### Deployment
- **Platform**: Vercel
- **Build System**: Vite
- **Type**: Single Page Application (SPA)

## 2. Quick Reference
- **Repo Root**: `d:\UserData\Documents\GitHub\Part-Picker`
- **Source Code**: `src/`
- **Entry Point**: `src/main.tsx`
- **Router**: `src/App.tsx`
- **Styles**: `src/index.css` (Tailwind)
- **Data Source**: `src/data/superiorParts.ts` (Normalized data), `pc-part-dataset-main/` (Raw JSON)

### Essential Commands
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
```

## 3. Technology Stack
- **Framework**: React 18
- **Language**: TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS + Tailwind Animate
- **UI Library**: Shadcn UI (Radix UI primitives)
- **Routing**: React Router DOM v6
- **State Management**: React Query (TanStack Query) + Local State
- **Icons**: Lucide React
- **Notifications**: Sonner + Toaster

## 4. Project Structure
```
project-root/
├── .eslintrc.cjs              # ESLint configuration
├── index.html                 # HTML entry point
├── package.json               # Dependencies and scripts
├── postcss.config.js          # PostCSS config
├── tailwind.config.js         # Tailwind theme config
├── tsconfig.json              # TypeScript config
├── vercel.json                # Vercel deployment config
├── vite.config.js             # Vite build config
├── public/                    # Static assets
├── pc-part-dataset-main/      # Raw data submodule
│   └── data/json/             # JSON data files (cpu.json, etc.)
└── src/
    ├── App.tsx                # Main Router component
    ├── main.tsx               # App entry point
    ├── index.css              # Global styles & Tailwind directives
    ├── vite-env.d.ts          # Vite type definitions
    ├── components/
    │   ├── Navigation.tsx     # Main navigation bar
    │   └── ui/                # Reusable UI components (Button, Card, etc.)
    ├── data/
    │   └── superiorParts.ts   # Data normalization layer
    ├── lib/
    │   ├── buildStorage.ts    # LocalStorage utility
    │   └── utils.ts           # Class name merger (cn)
    └── pages/
        ├── Home.tsx           # Landing page
        ├── AIBuild.tsx        # AI Assistant feature
        ├── ManualBuild.tsx    # Manual picker feature
        ├── BrowseParts.tsx    # Part catalog
        ├── SavedBuilds.tsx    # Saved builds management
        └── NotFound.tsx       # 404 page
```

## 5. Complete File Manifest

| File Path | Type | Purpose | Key Exports | Size |
|-----------|------|---------|-------------|------|
| `src/main.tsx` | React | Entry point | - | Small |
| `src/App.tsx` | React | Router setup | App | Medium |
| `src/index.css` | CSS | Global styles | - | Small |
| `src/components/Navigation.tsx` | React | Top navbar | Navigation | Medium |
| `src/pages/Home.tsx` | React | Landing page | Home | Large |
| `src/pages/AIBuild.tsx` | React | AI Builder feature | AIBuild | Large |
| `src/pages/ManualBuild.tsx` | React | Manual Builder feature | ManualBuild | Large |
| `src/pages/BrowseParts.tsx` | React | Part Catalog feature | BrowseParts | Large |
| `src/pages/SavedBuilds.tsx` | React | Saved Builds feature | SavedBuilds | Medium |
| `src/pages/NotFound.tsx` | React | 404 Page | NotFound | Small |
| `src/lib/utils.ts` | TS | Styling helpers | cn, variants | Small |
| `src/lib/buildStorage.ts` | TS | Storage utility | buildStorage | Medium |
| `src/data/superiorParts.ts` | TS | Data normalization | superiorParts | Large |
| `src/components/ui/button.tsx` | React | Button component | Button | Medium |
| `src/components/ui/card.tsx` | React | Card component | Card, CardContent | Medium |
| `src/components/ui/input.tsx` | React | Input component | Input | Small |
| `src/components/ui/select.tsx` | React | Select dropdown | Select, SelectItem | Large |
| `src/components/ui/badge.tsx` | React | Badge component | Badge | Small |
| `src/components/ui/sonner.tsx` | React | Toast provider | Toaster | Small |
| `src/components/ui/toaster.tsx` | React | Toast provider | Toaster | Small |
| `src/components/ui/tooltip.tsx` | React | Tooltip component | Tooltip | Small |
| `src/components/ui/scroll-area.tsx` | React | Scroll container | ScrollArea | Medium |
| `src/components/ui/label.tsx` | React | Label component | Label | Small |
| `tailwind.config.js` | Config | Theme config | - | Medium |
| `vite.config.js` | Config | Build config | - | Small |

## 6. Component Architecture

### Core Components
- **App**: Sets up `QueryClientProvider`, `TooltipProvider`, `Toaster`, and `BrowserRouter`. Defines routes.
- **Navigation**: Responsive navigation bar. Handles theme toggling (light/dark) and mobile menu state.
- **Layout**: No dedicated layout component; `Navigation` is included in each page or wrapped in `App` (currently included in each page).

### UI Library (`src/components/ui`)
Built on **Radix UI** primitives and styled with **Tailwind CSS**.
- **Button**: Supports variants (default, destructive, outline, secondary, ghost, link) and sizes.
- **Input**: Standard text input with focus rings.
- **Select**: Custom dropdown using Radix Select.
- **Card**: Composable card components (Header, Title, Content, Footer).
- **Badge**: Status indicators.
- **Toast/Sonner**: Notification system for success/error messages.

### Feature Components
- **AIBuild**:
  - Manages chat state (`messages`).
  - Handles API calls to `/api/chat` (mocked/proxied).
  - Renders `AssistantMessage` to display structured build data.
  - Integration with `buildStorage` to save generated builds.
- **ManualBuild**:
  - Manages `build` state (object with slots for cpu, gpu, etc.).
  - Computes `totalCost` and `isCompatible`.
  - Uses `Select` components populated by `superiorParts` data.
- **BrowseParts**:
  - Filters `superiorParts` based on search, category, and price.
  - Toggles between Grid and List views.
- **SavedBuilds**:
  - Fetches builds from `localStorage` via `buildStorage`.
  - Displays build summaries and allows deletion.

## 7. Data Flow & State Management

### Global State
- **Theme**: Managed via `localStorage` ('theme') and DOM class manipulation in `Navigation.tsx`.
- **Server State**: `React Query` is configured but primarily used for potential future API caching. Current data is mostly static or local.

### Local State
- **Page Level**: Each page manages its own state (e.g., `ManualBuild` manages the current selection, `AIBuild` manages chat history).
- **Data Persistence**: `src/lib/buildStorage.ts` acts as a facade for `localStorage`.
  - Key: `pc-part-dataset-main` (actually `pc-builds` in implementation).
  - Methods: `getAllBuilds`, `saveBuild`, `deleteBuild`.

### Data Source
- **Static Data**: `src/data/superiorParts.ts` imports raw JSON files from `pc-part-dataset-main` and normalizes them into a consistent `NormalizedPart` interface.
- **Normalization**: Handles missing prices, categorizes parts (Budget/High End), and formats specs (e.g., "32GB DDR5").

## 8. Routing & Navigation
Defined in `src/App.tsx` using `react-router-dom`.

| Path | Component | Purpose |
|------|-----------|---------|
| `/` | `Home` | Landing page with hero and feature grid. |
| `/ai-build` | `AIBuild` | Chat interface for AI build generation. |
| `/manual-build` | `ManualBuild` | Manual component selection tool. |
| `/browse-parts` | `BrowseParts` | Searchable catalog of all parts. |
| `/saved-builds` | `SavedBuilds` | Gallery of user's saved configurations. |
| `*` | `NotFound` | 404 Error page. |

## 9. Styling System
The project uses a **Brutalist** design aesthetic implemented via Tailwind CSS.

### Design Tokens (`tailwind.config.js`)
- **Colors**:
  - `primary`: Main action color (black/white depending on mode).
  - `accent`: Highlight color (often a vibrant purple/blue).
  - `background`: Page background.
  - `foreground`: Text color.
- **Typography**:
  - `font-sans`: Inter (System UI).
  - `font-display`: Oswald (Bold headers).
- **Shadows**:
  - `brutal`: `4px 4px 0px 0px rgba(0,0,0,1)` (Hard shadow).
- **Animations**:
  - `accordion-down/up`: For collapsible elements.
  - `fade-in`, `slide-up`: Entry animations.

### Styling Patterns
- **Borders**: Heavy usage of `border-2 border-black`.
- **Rounding**: `rounded-none` is used extensively for the brutalist look.
- **Uppercase**: Headers and buttons often use `uppercase tracking-widest`.

## 10. Configuration Files
- **`package.json`**: Defines scripts (`dev`, `build`, `lint`) and dependencies.
- **`tsconfig.json`**: TypeScript config. Sets path alias `@/*` to `./src/*`.
- **`vite.config.js`**: Vite config. Sets up React plugin and Vercel plugin. Defines build chunk size limits.
- **`vercel.json`**: Vercel deployment config. Rewrites `/api/*` to backend functions (if any) and SPA fallback for other routes.
- **`.eslintrc.cjs`**: Linting rules. Extends `react-hooks` and `typescript-eslint`.

## 11. Dependencies

### Core Framework
- `react`, `react-dom`: UI library.
- `react-router-dom`: Routing.

### UI & Styling
- `tailwindcss`, `postcss`, `autoprefixer`: CSS framework.
- `tailwindcss-animate`: Animation utilities.
- `class-variance-authority`: Component variant management.
- `clsx`, `tailwind-merge`: Class name utilities.
- `lucide-react`: Icon set.
- `@radix-ui/*`: Headless UI primitives for accessibility.
- `sonner`: Toast notifications.

### Data & State
- `@tanstack/react-query`: Async state management.
- `dotenv`: Environment variable management.

### AI
- `@google/generative-ai`: Gemini API client (used in API routes, likely server-side or proxied).

## 12. Features & Functionality

### AI Build Assistant
- **Flow**: User enters prompt -> System sends to API -> Returns JSON build -> Parsed & Displayed.
- **Key Tech**: `fetch('/api/chat')`, JSON parsing, `AssistantMessage` component.

### Manual Builder
- **Flow**: User selects category -> Chooses part -> System updates state -> Checks compatibility.
- **Compatibility Logic**: Checks if CPU and Motherboard are both selected (basic check).

### Part Browser
- **Flow**: Lists all parts -> User filters by category/price/search.
- **Performance**: Uses `useMemo` to cache filtered results.

## 13. Code Patterns & Standards
- **Imports**: Absolute imports using `@/` alias.
- **Components**: Functional components with hooks.
- **Props**: TypeScript interfaces for all component props.
- **Naming**: PascalCase for components, camelCase for functions/vars.
- **File Structure**: Feature-based pages, shared UI components.

## 14. Integration Points
- **AI API**: Expects a POST to `/api/chat`.
  - Request: `{ conversation: Message[], systemPrompt: string }`
  - Response: `{ response: string (JSON string) }`
- **LocalStorage**: Used for `pc-builds` and `theme`.

## 15. Build & Deployment
- **Build**: `npm run build` runs `tsc` then `vite build`.
- **Output**: `dist/` directory.
- **Vercel**: Configured for seamless deployment with `vite-plugin-vercel`.

## 16. Development Guide
1. **Adding a Component**: Create in `src/components/ui` if generic, or `src/components` if specific. Use `cn` for classes.
2. **Adding a Page**: Create in `src/pages`, add route in `App.tsx`, add to `Navigation.tsx`.
3. **Updating Data**: Modify `src/data/superiorParts.ts` or update the raw JSON in `pc-part-dataset-main`.

## 17. Known Issues & Future Considerations
- **Compatibility Checks**: Currently very basic (only checks if CPU/Mobo exist). Needs socket/chipset matching.
- **API Mocking**: The `/api/chat` endpoint needs to be implemented (likely as a Vercel Function) for the AI feature to work in production.
- **Performance**: Large datasets in `superiorParts.ts` might impact bundle size. Consider lazy loading or server-side pagination.
- **Type Safety**: Some `any` types in data normalization could be tightened.

## Appendix A: Code Snippets
**Data Normalization Example (`superiorParts.ts`):**
```typescript
const normalizeCpu = (): NormalizedPart[] => {
  return limitItems(
    mapDataset(cpuJson as RawCpu[], (item) => {
      const price = normalizedPrice(item.price ?? null);
      if (price == null) return null;
      return {
        name: item.name,
        brand: deriveBrand(item.name),
        category: categorizePrice(price),
        price,
        // ...
      };
    })
  );
};
```

## Appendix B: Design Assets
- **Font Family**: Inter (Sans), Oswald (Display).
- **Primary Color**: `hsl(var(--primary))` (Black/White).
- **Accent Color**: `hsl(var(--accent))` (Purple/Blue).
- **Border Radius**: `0` (Hard edges).
