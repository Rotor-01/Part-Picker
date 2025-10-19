const express = require('express');
const app = express();
require('dotenv').config(); // Load environment variables from .env
const { GoogleGenerativeAI } = require('@google/generative-ai');

// --- Gemini API Setup ---
// Ensure you have GEMINI_API_KEY in your .env file
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
// ------------------------
…
// Export the app for Vercel
module.exports = app;
