const express = require('express');
const app = express();
require('dotenv').config();
const { GoogleGenerativeAI } = require('@google/generative-ai');
const fs = require('fs');
const path = require('path');

// --- Gemini API Setup ---
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
// ------------------------

// CORS middleware
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    if (req.method === 'OPTIONS') {
        return res.sendStatus(200);
    }
    next();
});

// --- Load the JSON data using 'fs' ---
let pcData;
try {
    // This path now looks for 'data.json' in the *same* folder (api/data.json)
    const dataPath = path.join(__dirname, './data.json'); 
    
    const data = fs.readFileSync(dataPath, 'utf-8');
    pcData = JSON.parse(data);
    console.log('✅ PC parts data loaded successfully from api/data.json');
} catch (error) {
    console.error('❌ Failed to read or parse data.json:', error);
    pcData = {}; 
}
// ------------------------------------------

app.use(express.json());

app.get('/api/health', (req, res) => {
    res.json({
        status: 'online',
        data: {
            categories: Object.keys(pcData).length,
            totalParts: Object.values(pcData).reduce((sum, arr) => sum + (arr?.length || 0), 0)
        },
        timestamp: new Date().toISOString()
    });
});

app.post('/api/ask', async (req, res) => {
    const userMessage = req.body.message?.trim();
    
    if (!userMessage) {
        return res.status(400).json({ reply: 'Please enter a message.' });
    }

    if (!process.env.GEMINI_API_KEY) {
        console.error('Server Error: API key is not configured.');
        return res.status(500).json({ reply: 'Server Error: API key is not configured.' });
    }

    if (Object.keys(pcData).length === 0) {
        console.error('Server Error: pcData is empty, cannot process request.');
        return res.status(500).json({ reply: 'Server Error: Could not load component database.' });
    }

    console.log('💬 AI Chat request:', userMessage);

    try {
        const prompt = `
          You are a helpful PC build expert. A user will provide a request, and you will be given a JSON object of *all available parts*.
          
          Your task is to create a complete PC build recommendation based *only* on the parts from the provided JSON.
          
          Follow these rules strictly:
          1.  **Use Only Provided Parts:** Do not recommend any part or part category (like RAM) that is not in the JSON.
          2.  **Check Compatibility:** Ensure the CPU socket matches the motherboard socket. Ensure the motherboard form factor matches the case form factor.
          3.  **Calculate Total:** Sum the price of all selected components.
          4.  **Handle Missing Parts:** If a required part isn't available (e.g., no compatible motherboard), you *must* state that you cannot complete the build with the available parts.
          5.  **Format:** You *must* format your response in Markdown using this exact structure:
          
              🎯 **PC Build Recommendation**
          
              **Use Case:** (e.g., Gaming, Editing, etc.)
              **Target Budget:** (e.g., $1000)
              **Estimated Cost:** (Your calculated total)
          
              **Recommended Components:**
              • **CPU:** (Part Name) - $(Price)
              • **GPU:** (Part Name) - $(Price)
              • **Motherboard:** (Part Name) - $(Price)
              • **RAM:** (Part Name) - $(Price)
              • **Storage:** (Part Name) - $(Price)
              • **Power Supply:** (Part Name) - $(Price)
              • **Case:** (Part Name) - $(Price)
          
              **Rationale:**
              (A *brief* explanation of why you chose these parts for the user's request)

          ---
          HERE IS THE AVAILABLE PARTS DATA (JSON):
          ${JSON.stringify(pcData)}
          ---
          HERE IS THE USER'S REQUEST:
          "${userMessage}"
        `;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const aiReply = response.text();
        
        res.json({ reply: aiReply });

    } catch (error) {
        console.error('Error generating response:', error);
        res.status(500).json({ 
            reply: 'I encountered an error while processing your request. The AI model may be unavailable. Please try again.' 
        });
    }
});

app.get('/api/debug-data', (req, res) => {
    try {
        res.json({
            success: true,
            fileExists: true,
            categories: Object.keys(pcData),
            itemCounts: Object.keys(pcData).reduce((acc, key) => {
                acc[key] = pcData[key]?.length || 0;
                return acc;
            }, {})
        });
    } catch (error) {
        res.json({
            success: false,
            error: error.message,
            fileExists: false
        });
    }
});

module.exports = app;
