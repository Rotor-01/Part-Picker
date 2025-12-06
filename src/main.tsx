import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './app.css'; // Import the main CSS file

console.log("DEBUG: App Version 2025-12-06 08:58 - Background Fix");

// Ensure the root element exists before creating the app.
const rootElement = document.getElementById('root');

if (rootElement) {
  ReactDOM.createRoot(rootElement).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
  );
} else {
  console.error("Failed to find the root element in index.html.");
}
