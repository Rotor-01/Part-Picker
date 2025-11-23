# PC Part Picker - AI-Powered PC Builder

A modern React application for building PCs with AI-powered recommendations or manual component selection.

## Features

- **AI Build Assistant**: Get personalized PC builds using Google Gemini
- **Manual Builder**: Hand-pick components with compatibility checking
- **Browse Parts**: Explore an extensive catalog of CPUs, GPUs, motherboards, and more
- **Modern UI**: Built with React, TypeScript, Tailwind CSS, and Radix UI components

## Tech Stack

- React 18 with TypeScript
- Vite for build tooling
- Tailwind CSS for styling
- Radix UI for accessible components
- React Router for navigation
- TanStack Query for state management
- Lucide React for icons

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open [http://localhost:5173](http://localhost:5173) in your browser

### Building for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

## Environment Variables

For AI functionality, you can set these environment variables:

- `VITE_GEMINI_API_KEY`: Your Google Gemini API key


## Deployment on Vercel

This project is configured for easy deployment on Vercel:

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Vercel will automatically detect the Vite configuration
4. The project will build and deploy automatically

### Vercel Configuration

The `vercel.json` file is configured to handle client-side routing by redirecting all routes to `index.html`.

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ui/             # Radix UI based components
│   └── Navigation.tsx  # Main navigation component
├── pages/              # Page components
│   ├── Home.tsx        # Landing page
│   ├── AIBuild.tsx     # AI build assistant
│   ├── ManualBuild.tsx # Manual component selection
│   ├── BrowseParts.tsx # Parts catalog
│   └── NotFound.tsx    # 404 page
├── data/               # Static data
│   └── pc-parts.json   # PC components database
├── lib/                # Utility functions
└── App.tsx             # Main app component
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is open source and available under the MIT License.
