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

## Backend

The AI chat functionality is powered by a Vercel serverless function located in `api/chat.ts`. This function acts as a proxy to the Google Gemini API, ensuring that the API key is not exposed on the client-side.

## Environment Variables

For AI functionality, you need to set environment variables.

### Client-Side (Vite)

For local development, create a `.env.local` file in the root of the project and add your Gemini API key:

```
VITE_GEMINI_API_KEY=your_gemini_api_key
```

### Server-Side (Vercel)

For the deployed application on Vercel, you need to set the `GEMINI_API_KEY` environment variable in your Vercel project settings. The serverless function will use this key to authenticate with the Google Gemini API.


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
