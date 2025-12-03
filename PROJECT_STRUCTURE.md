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
- **Minimalist Design**: Clean, typography-driven UI with cream backgrounds, generous whitespace, and subtle interactions.

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
- **UI Library**: Shadcn UI (Radix UI primitives) - Custom Minimalist Theme
- **Routing**: React Router DOM v6
- **State Management**: React Query (TanStack Query) + Local State
- **Icons**: Lucide React
- **Notifications**: Sonner

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
- **Navigation**: Responsive navigation bar with light theme. Features a clean logo, horizontal links, and a mobile menu.
- **Layout**: No dedicated layout component; `Navigation` is included in each page.

### UI Library (`src/components/ui`)
Built on **Radix UI** primitives and styled with **Tailwind CSS**.
- **Button**: Minimalist variants (default, outline, ghost). Rounded corners (`rounded-full` often used in pages).
- **Input**: Clean text input with subtle borders and focus rings.
- **Select**: Custom dropdown with light background and shadow.
- **Card**: Clean container with thin borders (`border`) and subtle shadows (`shadow-subtle`).
- **Badge**: Pill-shaped status indicators with soft colors.
- **Toast/Sonner**: Notification system for success/error messages.

### Feature Components
- **AIBuild**:
  - Manages chat state (`messages`).
  - Renders `AssistantMessage` with clean, card-based layout for build parts.
  - Uses `Input` and `Button` for chat interface.
- **ManualBuild**:
  - Grid layout for component categories.
  - Uses `Select` for part choosing.
  - Real-time cost calculation and compatibility check (CPU + Mobo presence).
- **BrowseParts**:
  - Filterable grid/list of parts.
  - Sidebar with `Select` and `Input` filters.
- **SavedBuilds**:
  - Card-based grid of saved configurations.
  - Displays metadata (date, cost, source) with `Badge` and icons.

## 7. Data Flow & State Management

### Global State
- **Theme**: Light theme by default. Dark mode structure exists in CSS but is currently unused/hidden.
- **Server State**: `React Query` configured.

### Local State
- **Page Level**: Managed via `useState` (e.g., `ManualBuild` selection state, `AIBuild` chat history).
- **Data Persistence**: `src/lib/buildStorage.ts` interfaces with `localStorage`.

### Data Source
- **Static Data**: `src/data/superiorParts.ts` normalizes raw JSON data into `NormalizedPart` objects.

## 8. Routing & Navigation
Defined in `src/App.tsx`.

| Path | Component | Purpose |
|------|-----------|---------|
| `/` | `Home` | Landing page with massive typography hero. |
| `/ai-build` | `AIBuild` | AI Architect chat interface. |
| `/manual-build` | `ManualBuild` | Manual component selection studio. |
| `/browse-parts` | `BrowseParts` | Component catalog. |
| `/saved-builds` | `SavedBuilds` | User's saved configurations. |
| `*` | `NotFound` | 404 Error page. |

## 9. Styling System
The project uses a **Minimalist, Typography-Driven** design aesthetic.

### Design Tokens (`tailwind.config.js`)
- **Colors**:
  - `background`: `#FAFAF9` (Cream/Off-white).
  - `foreground`: `#0A0A0A` (Deep Black).
  - `primary`: `#2563EB` (Blue Accent).
  - `secondary`: `#F5F5F4` (Light Gray/Alternate Background).
  - `border`: `#E5E5E5` (Subtle Gray).
- **Typography**:
  - `font-sans`: Inter (System UI).
  - `font-display`: Inter (Clean, bold headers).
- **Shadows**:
  - `subtle`: `0 1px 3px rgba(0,0,0,0.05)`
  - `medium`: `0 4px 6px -1px rgba(0, 0, 0, 0.05)...`
  - `large`: `0 10px 25px -5px rgba(0, 0, 0, 0.05)...`
- **Border Radius**:
  - `radius`: `0.5rem` (Rounded corners).

### Styling Patterns
- **Layouts**: Asymmetric grids, generous padding (`py-24`, `p-10`).
- **Cards**: White/Cream backgrounds, thin borders, subtle hover lift (`hover:-translate-y-1`).
- **Typography**: Massive headings (`text-6xl` to `text-9xl`) for impact.

## 10. Configuration Files
- **`package.json`**: Dependencies and scripts.
- **`tsconfig.json`**: TypeScript config (`@/*` alias).
- **`vite.config.js`**: Vite build config.
- **`tailwind.config.js`**: Design system definition.

## 11. Dependencies
- `react`, `react-dom`, `react-router-dom`
- `tailwindcss`, `tailwindcss-animate`, `clsx`, `tailwind-merge`
- `lucide-react` (Icons)
- `@radix-ui/*` (Headless UI)
- `sonner` (Toasts)
- `@tanstack/react-query`

## 12. Features & Functionality
- **AI Architect**: Natural language processing (mocked/proxied) to generate builds.
- **Manual Studio**: Step-by-step part selection with validation.
- **Catalog**: Search and filter parts by category and price.
- **Persistence**: Save builds to browser local storage.

## 13. Code Patterns & Standards
- **Imports**: Absolute imports (`@/components/...`).
- **Components**: Functional components, typed props.
- **Styling**: Utility-first (Tailwind) with `cn()` helper for class merging.

## 14. Integration Points
- **AI API**: POST `/api/chat` (Expects JSON response with build details).
- **LocalStorage**: Key `pc-builds`.

## 15. Build & Deployment
- **Build**: `npm run build` (Vite).
- **Output**: `dist/`.

## 16. Development Guide
1. **Adding Components**: Use `src/components/ui` for atoms.
2. **Theming**: Update `tailwind.config.js` and `src/index.css` variables.
3. **Data**: Update `src/data/superiorParts.ts`.

## 17. Known Issues & Future Considerations
- **Compatibility**: Logic is basic (CPU + Mobo check only).
- **API**: AI endpoint needs backend implementation.
- **Performance**: Large data set loaded client-side.

## Appendix A: Code Snippets
**Button Variant Example:**
```tsx
const buttonVariants = cva(
  "inline-flex items-center... rounded-md...",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm",
        // ...
      },
    },
  }
)
```

## Appendix B: Design Assets
- **Font**: Inter.
- **Primary Color**: Blue (`#2563EB`).
- **Background**: Cream (`#FAFAF9`).
- **Corner Radius**: `0.5rem` (8px).
