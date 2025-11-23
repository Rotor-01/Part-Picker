# Part Picker - GEMINI.md

## Project Overview

This is a modern React application for building PCs. It allows users to get AI-powered recommendations for PC builds or to manually select components. The project is built with React, TypeScript, and Vite, and it uses Tailwind CSS for styling.

The main features are:
- **AI Build Assistant**: Get personalized PC builds using Google Gemini or OpenAI ChatGPT.
- **Manual Builder**: Hand-pick components with compatibility checking.
- **Browse Parts**: Explore an extensive catalog of CPUs, GPUs, motherboards, and more.
- **Saved Builds**: Save and manage your PC builds in local storage.

### Architecture

The application is a single-page application (SPA) built with React. It uses React Router for client-side routing. The state management is handled by a combination of React's built-in state management and TanStack Query for server state.

The AI chat functionality is powered by a Vercel serverless function located in `src/api/chat.ts`. This function acts as a proxy to the Google Gemini and OpenAI APIs, ensuring that the API keys are not exposed on the client-side.

The PC parts data is sourced from the `pc-part-dataset-main` directory and is normalized in `src/data/superiorParts.ts` before being used in the application.

## Building and Running

### Prerequisites

- Node.js 18+
- npm or yarn

### Key Commands

- **Install dependencies:**
  ```bash
  npm install
  ```
- **Start the development server:**
  ```bash
  npm run dev
  ```
- **Build for production:**
  ```bash
  npm run build
  ```
- **Run linting:**
  ```bash
  npm run lint
  ```
- **Preview the production build:**
  ```bash
  npm run preview
  ```

## Development Conventions

### Code Style

- The project uses TypeScript for type safety.
- The code is formatted using Prettier (inferred from the presence of `.prettierrc.json`).
- The project follows the standard React component-based architecture.
- The UI is built with a combination of custom components and components from the Radix UI library, styled with Tailwind CSS.
- The project uses `lucide-react` for icons.

### File Structure

- **`src/components`**: Contains reusable UI components.
- **`src/pages`**: Contains the main page components for each route.
- **`src/data`**: Contains the data normalization logic.
- **`src/lib`**: Contains utility functions, such as the local storage management for saved builds.
- **`src/api`**: Contains the serverless function for the AI chat.

### State Management

- React's `useState` and `useEffect` hooks are used for component-level state.
- TanStack Query is used for managing the state of asynchronous operations, such as fetching data from an API.

### Environment Variables

For AI functionality, you need to set the following environment variables in a `.env.local` file:

- `VITE_GEMINI_API_KEY`: Your Google Gemini API key.
- `VITE_OPENAI_API_KEY`: Your OpenAI API key.

Note: For the serverless function, these variables should be set in the Vercel project settings. The current implementation reads them from `process.env` on the server-side.
