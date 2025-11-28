import { GoogleGenerativeAI } from "@google/generative-ai";
import * as dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';

// Try to load .env.local
const envPath = path.resolve(process.cwd(), '.env.local');
if (fs.existsSync(envPath)) {
    const envConfig = dotenv.parse(fs.readFileSync(envPath));
    for (const k in envConfig) {
        process.env[k] = envConfig[k];
    }
}

const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
    console.error("Error: GEMINI_API_KEY not found in environment variables or .env.local");
    process.exit(1);
}

const genAI = new GoogleGenerativeAI(apiKey);

async function listModels() {
    try {
        // We need to access the model list via the API directly or use a helper if available.
        // The SDK doesn't expose listModels directly on the main class in older versions, 
        // but let's try to just use a known working model to test connection first, 
        // or use the model.getGenerativeModel logic.

        // Actually, let's try to fetch the models list using fetch directly to be sure.
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`);

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        console.log("Available Models:");
        if (data.models) {
            data.models.forEach(m => {
                console.log(`- ${m.name} (Supported methods: ${m.supportedGenerationMethods.join(', ')})`);
            });
        } else {
            console.log("No models found in response:", data);
        }

    } catch (error) {
        console.error("Error listing models:", error);
    }
}

listModels();
