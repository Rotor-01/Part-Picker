const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(__dirname));


app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    if (req.method === 'OPTIONS') {
        return res.sendStatus(200);
    }
    next();
});

let pcData = {};
try {
    const rawData = fs.readFileSync(path.join(__dirname, 'data.json'), 'utf8');
    pcData = JSON.parse(rawData);
    console.log('✅ PC parts data loaded successfully');
} catch (error) {
    console.error('❌ Failed to load data.json:', error.message);
    pcData = {
        CPUs: [],
        GPUs: [],
        Motherboards: [],
        PSUs: [],
        Storage: [],
        Cases: []
    };
}

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/health', (req, res) => {
    res.json({
        status: 'online',
        port: PORT,
        data: {
            categories: Object.keys(pcData).length,
            totalParts: Object.values(pcData).reduce((sum, arr) => sum + arr.length, 0)
        },
        timestamp: new Date().toISOString()
    });
});

app.get('/data.json', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.json(pcData);
});

app.post('/ask', (req, res) => {
    const userMessage = req.body.message?.trim();
    
    if (!userMessage) {
        return res.status(400).json({ reply: 'Please enter a message.' });
    }

    console.log('💬 Chat request:', userMessage);

    try {
        const response = generatePCRecommendation(userMessage, pcData);
        res.json({ reply: response });
    } catch (error) {
        console.error('Error generating response:', error);
        res.json({ 
            reply: 'I encountered an error while processing your request. Please try again.' 
        });
    }
});

function generatePCRecommendation(message, data) {
    const lowerMessage = message.toLowerCase();
    const budget = extractBudget(lowerMessage);
    const useCase = determineUseCase(lowerMessage);
    const brandPreference = determineBrandPreference(lowerMessage);

    let recommendation = buildPCRecommendation(data, budget, useCase, brandPreference);
    
    return recommendation;
}

function extractBudget(message) {
    const budgetMatches = message.match(/\$?(\d+)/g);
    if (budgetMatches) {
        const numbers = budgetMatches.map(m => parseInt(m.replace('$', ''))).filter(n => n > 0);
        return Math.max(...numbers);
    }
    
    if (message.includes('budget') || message.includes('cheap') || message.includes('low cost')) return 800;
    if (message.includes('mid') || message.includes('medium')) return 1200;
    if (message.includes('high') || message.includes('premium') || message.includes('expensive')) return 2000;
    
    return 1000;
}

function determineUseCase(message) {
    if (message.includes('gaming') || message.includes('game')) return 'gaming';
    if (message.includes('edit') || message.includes('video') || message.includes('render')) return 'editing';
    if (message.includes('workstation') || message.includes('3d') || message.includes('cad')) return 'workstation';
    if (message.includes('office') || message.includes('productivity') || message.includes('work')) return 'office';
    if (message.includes('stream') || message.includes('content')) return 'streaming';
    
    return 'general';
}

function determineBrandPreference(message) {
    if (message.includes('amd') && message.includes('intel')) return 'both';
    if (message.includes('amd')) return 'amd';
    if (message.includes('intel')) return 'intel';
    if (message.includes('nvidia')) return 'nvidia';
    
    return 'any';
}

function buildPCRecommendation(data, budget, useCase, brandPreference) {
    let totalCost = 0;
    let parts = {};
    
    parts.cpu = selectCPU(data.CPUs, budget, useCase, brandPreference);
    totalCost += parts.cpu?.price || 0;
    
    parts.gpu = selectGPU(data.GPUs, budget, useCase, brandPreference);
    totalCost += parts.gpu?.price || 0;
    
    parts.motherboard = selectMotherboard(data.Motherboards, parts.cpu?.socket);
    totalCost += parts.motherboard?.price || 0;
    
    parts.psu = selectPSU(data.PSUs, parts.gpu?.powerdraw);
    totalCost += parts.psu?.price || 0;
    
    parts.storage = selectStorage(data.Storage, useCase);
    totalCost += parts.storage?.price || 0;
    
    parts.case = selectCase(data.Cases, parts.motherboard?.formfactor);
    totalCost += parts.case?.price || 0;
    
    return formatRecommendation(parts, totalCost, budget, useCase);
}

function selectCPU(cpus, budget, useCase, brandPreference) {
    if (!cpus || cpus.length === 0) return null;
    
    let filtered = cpus.filter(cpu => {
        if (brandPreference === 'amd' && cpu.brand !== 'AMD') return false;
        if (brandPreference === 'intel' && cpu.brand !== 'Intel') return false;
        if (brandPreference === 'both') return true;
        
        const cpuBudget = budget * 0.15;
        return cpu.price <= cpuBudget * 1.5;
    });
    
    if (filtered.length === 0) filtered = cpus;
    
    if (useCase === 'gaming') {
        return filtered.find(cpu => cpu.category === 'Gaming') || 
               filtered.sort((a, b) => b.cores - a.cores)[0];
    }
    if (useCase === 'editing' || useCase === 'workstation') {
        return filtered.find(cpu => cpu.category === 'Editing') ||
               filtered.sort((a, b) => (b.cores * b.threads) - (a.cores * a.threads))[0];
    }
    
    return filtered.find(cpu => cpu.category === 'Budget') || filtered[0];
}

function selectGPU(gpus, budget, useCase, brandPreference) {
    if (!gpus || gpus.length === 0) return null;
    
    let filtered = gpus.filter(gpu => {
        if (brandPreference === 'nvidia' && gpu.brand !== 'NVIDIA') return false;
        if (brandPreference === 'amd' && gpu.brand !== 'AMD') return false;
        
        const gpuBudget = budget * 0.35;
        return gpu.price <= gpuBudget * 1.5;
    });
    
    if (filtered.length === 0) filtered = gpus;
    
    if (useCase === 'gaming' || useCase === 'streaming') {
        return filtered.sort((a, b) => b.vram - a.vram)[0];
    }
    
    return filtered[0];
}

function selectMotherboard(motherboards, cpuSocket) {
    if (!motherboards || motherboards.length === 0) return null;
    
    if (cpuSocket) {
        return motherboards.find(mb => mb.socket === cpuSocket) || motherboards[0];
    }
    
    return motherboards[0];
}

function selectPSU(psus, gpuPower) {
    if (!psus || psus.length === 0) return null;
    
    const requiredWattage = (gpuPower || 250) + 200;
    
    return psus.find(psu => psu.wattage >= requiredWattage) || 
           psus.sort((a, b) => a.wattage - b.wattage)[0];
}

function selectStorage(storage, useCase) {
    if (!storage || storage.length === 0) return null;
    
    if (useCase === 'editing' || useCase === 'workstation') {
        return storage.find(s => s.capacity === '2TB') || storage[0];
    }
    
    return storage.find(s => s.socket === 'M.2') || storage[0];
}

function selectCase(cases, motherboardForm) {
    if (!cases || cases.length === 0) return null;
    
    if (motherboardForm) {
        return cases.find(c => c.formfactor === motherboardForm) || cases[0];
    }
    
    return cases[0];
}

function formatRecommendation(parts, totalCost, budget, useCase) {
    let response = `🎯 **PC Build Recommendation**\n\n`;
    
    response += `**Use Case:** ${useCase.charAt(0).toUpperCase() + useCase.slice(1)}\n`;
    response += `**Target Budget:** $${budget}\n`;
    response += `**Estimated Cost:** $${totalCost}\n\n`;
    
    response += `**Recommended Components:**\n`;
    
    if (parts.cpu) {
        response += `• **CPU:** ${parts.cpu.name} - $${parts.cpu.price}\n`;
    }
    if (parts.gpu) {
        response += `• **GPU:** ${parts.gpu.name} - $${parts.gpu.price}\n`;
    }
    if (parts.motherboard) {
        response += `• **Motherboard:** ${parts.motherboard.name} - $${parts.motherboard.price}\n`;
    }
    if (parts.psu) {
        response += `• **Power Supply:** ${parts.psu.name} - $${parts.psu.price}\n`;
    }
    if (parts.storage) {
        response += `• **Storage:** ${parts.storage.name} - $${parts.storage.price}\n`;
    }
    if (parts.case) {
        response += `• **Case:** ${parts.case.name} - $${parts.case.price}\n`;
    }
    
    response += `\n**Additional Recommendations:**\n`;
    response += `• **RAM:** 16GB DDR5 (Gaming) / 32GB DDR5 (Editing) - ~$100-$150\n`;
    response += `• **Cooling:** Air Cooler - $50 / Liquid Cooler - $100+\n`;
    response += `• **OS:** Windows 11 - $140 (or free Linux)\n`;
    
    if (totalCost > budget * 1.2) {
        response += `\n⚠️ **Note:** This build exceeds your budget. Consider:\n`;
        response += `• Choosing a less expensive ${parts.cpu?.category !== 'Budget' ? 'CPU' : 'GPU'}\n`;
        response += `• Looking for sales or used components\n`;
        response += `• Starting with integrated graphics\n`;
    } else if (totalCost < budget * 0.8) {
        response += `\n💡 **Opportunity:** You're under budget! Consider:\n`;
        response += `• Upgrading to a better ${parts.gpu?.vram < 16 ? 'GPU' : 'CPU'}\n`;
        response += `• Adding more storage or RAM\n`;
        response += `• Investing in better cooling\n`;
    }
    
    response += `\n🛠️ **Next Steps:**\n`;
    response += `• Check compatibility between components\n`;
    response += `• Browse all available parts in the Parts section\n`;
    response += `• Ask me more specific questions!\n`;
    
    return response;
}

app.use((err, req, res, next) => {
    console.error('Server error:', err);
    res.status(500).json({ error: 'Internal server error' });
});

app.use((req, res) => {
    res.status(404).json({ error: 'Endpoint not found' });
});

app.listen(PORT, () => {
    console.log('🚀 ==================================');
    console.log('🚀 PC Part Picker Server Started!');
    console.log('🚀 ==================================');
    console.log(`📍 Local: http://localhost:${PORT}`);
    console.log(`🌐 Network: http://YOUR-IP:${PORT}`);
    console.log(`📊 Categories: ${Object.keys(pcData).length}`);
    console.log(`🔧 Total Parts: ${Object.values(pcData).reduce((sum, arr) => sum + arr.length, 0)}`);
    console.log('💡 Press Ctrl+C to stop');
    console.log('====================================');
});

process.on('SIGINT', () => {
    console.log('\n👋 Server shutting down gracefully...');
    process.exit(0);
});

app.get('/debug-data', (req, res) => {
    try {
        const rawData = fs.readFileSync(path.join(__dirname, 'data.json'), 'utf8');
        const data = JSON.parse(rawData);
        res.json({
            success: true,
            fileExists: true,
            categories: Object.keys(data),
            itemCounts: Object.keys(data).reduce((acc, key) => {
                acc[key] = data[key]?.length || 0;
                return acc;
            }, {})
        });
    } catch (error) {
        res.json({
            success: false,
            error: error.message,
            fileExists: fs.existsSync(path.join(__dirname, 'data.json'))
        });
    }
});