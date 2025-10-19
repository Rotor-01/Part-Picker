document.addEventListener('DOMContentLoaded', function() {
    const chatForm = document.getElementById('chat-form');
    const userInput = document.getElementById('user-input');
    const chatBox = document.getElementById('chat-box');
    const partsGallery = document.getElementById('parts-gallery');
    
    const buildComponents = document.getElementById('build-components');
    const totalCostElement = document.getElementById('total-cost');
    const compatibilityStatus = document.getElementById('compatibility-status');
    const componentTypeFilter = document.getElementById('component-type');
    const componentSearch = document.getElementById('component-search');
    const componentGallery = document.getElementById('component-gallery');
    
    let isProcessing = false;
    let pcData = {};
    let currentBuild = {
        cpu: null,
        motherboard: null,
        gpu: null,
        ram: { name: "16GB DDR5 (Estimated)", price: 100 },
        storage: null,
        psu: null,
        case: null
    };

    initializeApp();
    
    function initializeApp() {
        console.log('🚀 Initializing PC Part Picker...');
        testServerConnection();
        loadPCData().then(() => {
            console.log('✅ Data loaded successfully');
            initializeBuilder();
            loadPartsGallery();
        }).catch(error => {
            console.error('❌ Failed to load data:', error);
            showDataLoadError();
        });
        setupEventListeners();
        showWelcomeMessage();
    }
    
    function setupEventListeners() {
        if (chatForm) {
            chatForm.addEventListener('submit', handleChatSubmit);
        }
        if (userInput) {
            userInput.addEventListener('keydown', handleInputKeydown);
            userInput.addEventListener('input', handleInputChange);
            setTimeout(() => userInput.focus(), 1000);
        }
        
        if (componentTypeFilter) {
            componentTypeFilter.addEventListener('change', filterComponents);
        }
        if (componentSearch) {
            componentSearch.addEventListener('input', filterComponents);
        }
    }
    
    async function loadPCData() {
        try {
            console.log('📥 Fetching data from /data.json...');
            const response = await fetch('/data.json');
            
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
            
            const data = await response.json();
            
            if (!data || typeof data !== 'object') {
                throw new Error('Invalid data: Expected object');
            }
            
            pcData = data;
            console.log('✅ PC data structure:', {
                categories: Object.keys(pcData),
                totalItems: Object.values(pcData).reduce((sum, arr) => sum + (arr?.length || 0), 0)
            });
            
            return data;
            
        } catch (error) {
            console.error('❌ Error loading PC data:', error);

            try {
                console.log('🔄 Trying debug endpoint...');
                const debugResponse = await fetch('/api/debug-data'); // <-- CHANGED
                const debugData = await debugResponse.json();
                console.log('🔍 Debug data:', debugData);
            } catch (debugError) {
                console.error('❌ Debug endpoint also failed:', debugError);
            }
            
            throw error;
        }
    }
    
    function showDataLoadError() {
        const errorHtml = `
            <div class="error-state">
                <h3>⚠️ Data Load Error</h3>
                <p>Failed to load component data. This could be because:</p>
                <ul>
                    <li>The server is not running</li>
                    <li>data.json file is missing or has errors</li>
                    <li>Browser is blocking the request</li>
                </ul>
                <p><strong>Quick fix:</strong> Make sure you ran <code>node server.js</code> and are visiting <code>http://localhost:3000</code></p>
                <button onclick="location.reload()" style="padding: 10px 20px; background: #6a26ad; color: white; border: none; border-radius: 5px; cursor: pointer;">Retry</button>
            </div>
        `;
        
        if (partsGallery) partsGallery.innerHTML = errorHtml;
        if (componentGallery) componentGallery.innerHTML = errorHtml;
    }
    
    function initializeBuilder() {
        if (componentGallery) {
            console.log('🏗️ Initializing builder with data:', Object.keys(pcData));
            renderComponentGallery();
            updateBuildSummary();
            checkCompatibility();
        }
    }
    
    function renderComponentGallery(filteredData = null) {
        if (!componentGallery) return;
        
        const data = filteredData || pcData;
        componentGallery.innerHTML = '';
        
        let hasComponents = false;
        
        if (!data || Object.keys(data).length === 0) {
            componentGallery.innerHTML = `
                <div class="no-components">
                    <p>No component data available. Please check your data.json file.</p>
                </div>
            `;
            return;
        }
        
        for (const [category, items] of Object.entries(data)) {
            if (!items || !Array.isArray(items) || items.length === 0) {
                console.log(`⚠️ No items in category: ${category}`);
                continue;
            }
            
            console.log(`📦 Rendering ${items.length} items in ${category}`);
            
            items.forEach(item => {
                if (!item || typeof item !== 'object') {
                    console.warn('⚠️ Invalid item in', category, item);
                    return;
                }
                
                const card = createBuilderPartCard(item, category);
                componentGallery.appendChild(card);
                hasComponents = true;
            });
        }
        
        if (!hasComponents) {
            componentGallery.innerHTML = `
                <div class="no-components">
                    <p>No components found. Check your data.json file structure.</p>
                </div>
            `;
        }
    }
    
    function createBuilderPartCard(part, category) {
        const card = document.createElement('div');
        card.className = 'builder-part-card';
        card.dataset.category = category;
        card.dataset.id = part.name;
        
        const details = getPartDetails(part, category);
        const imageUrl = part.image || 'images/placeholder.jpg';
        const isSelected = isComponentSelected(category, part.name);
        
        if (isSelected) {
            card.classList.add('selected');
        }
        
        card.innerHTML = `
            <div class="builder-part-image">
                <img src="${imageUrl}" alt="${part.name}" 
                     onerror="this.src='images/placeholder.jpg'">
            </div>
            <div class="builder-part-info">
                <h4>${part.name || 'Unnamed Component'}</h4>
                <p class="builder-part-brand">${part.brand || 'Unknown Brand'}</p>
                <p class="builder-part-price">$${part.price || 0}</p>
                <div class="builder-part-details">
                    ${details.map(detail => `<span class="detail">${detail}</span>`).join('')}
                </div>
                <button class="select-component ${isSelected ? 'selected' : ''}" 
                        onclick="window.builderManager.selectComponent('${category}', '${(part.name || '').replace(/'/g, "\\'")}')">
                    ${isSelected ? 'Remove' : 'Select'}
                </button>
            </div>
        `;
        
        return card;
    }
    
    function isComponentSelected(category, componentName) {
        const buildKey = getBuildKeyFromCategory(category);
        return currentBuild[buildKey]?.name === componentName;
    }
    
    function getBuildKeyFromCategory(category) {
        const mapping = {
            'CPUs': 'cpu',
            'Motherboards': 'motherboard',
            'GPUs': 'gpu',
            'PSUs': 'psu',
            'Storage': 'storage',
            'Cases': 'case'
        };
        return mapping[category] || category.toLowerCase();
    }
    
    window.builderManager = {
        selectComponent: function(category, componentName) {
            console.log('🔧 Selecting component:', category, componentName);
            
            const buildKey = getBuildKeyFromCategory(category);
            const component = pcData[category]?.find(item => item.name === componentName);
            
            if (!component) {
                console.error('❌ Component not found:', componentName, 'in', category);
                return;
            }
            
            if (currentBuild[buildKey]?.name === componentName) {
                currentBuild[buildKey] = null;
                console.log('🔧 Deselected:', componentName);
            } else {
                currentBuild[buildKey] = component;
                console.log('🔧 Selected:', componentName);
            }
            
            updateBuildSummary();
            renderComponentGallery();
            checkCompatibility();
        },
        
        removeComponent: function(componentType) {
            console.log('🔧 Removing component:', componentType);
            currentBuild[componentType] = null;
            updateBuildSummary();
            renderComponentGallery();
            checkCompatibility();
        }
    };
    
    function updateBuildSummary() {
        if (!buildComponents || !totalCostElement) return;
        
        let totalCost = 0;
        
        for (const [type, component] of Object.entries(currentBuild)) {
            const element = buildComponents.querySelector(`[data-type="${type}"]`);
            if (!element) continue;
            
            const placeholder = element.querySelector('.component-placeholder');
            const selectedDiv = element.querySelector('.component-selected');
            
            if (component) {
                if (!selectedDiv) {
                    const newSelected = document.createElement('div');
                    newSelected.className = 'component-selected';
                    newSelected.innerHTML = `
                        <div>${component.name}</div>
                        <div class="component-details">$${component.price}</div>
                        <button class="remove-component" onclick="window.builderManager.removeComponent('${type}')">
                            Remove
                        </button>
                    `;
                    if (placeholder) {
                        placeholder.replaceWith(newSelected);
                    } else {
                        element.appendChild(newSelected);
                    }
                } else {
                    selectedDiv.innerHTML = `
                        <div>${component.name}</div>
                        <div class="component-details">$${component.price}</div>
                        <button class="remove-component" onclick="window.builderManager.removeComponent('${type}')">
                            Remove
                        </button>
                    `;
                }
                element.classList.add('selected');
                totalCost += component.price || 0;
            } else {
                if (selectedDiv) {
                    const newPlaceholder = document.createElement('div');
                    newPlaceholder.className = 'component-placeholder';
                    newPlaceholder.textContent = 'Not Selected';
                    selectedDiv.replaceWith(newPlaceholder);
                }
                element.classList.remove('selected');
            }
        }
        
        totalCostElement.textContent = totalCost;
    }
    
    function checkCompatibility() {
        if (!compatibilityStatus) return;
        
        const issues = [];

        if (currentBuild.cpu && currentBuild.motherboard) {
            if (currentBuild.cpu.socket !== currentBuild.motherboard.socket) {
                issues.push(`CPU socket (${currentBuild.cpu.socket}) doesn't match motherboard socket (${currentBuild.motherboard.socket})`);
            }
        }
        
        if (currentBuild.motherboard && currentBuild.case) {
            if (currentBuild.motherboard.formfactor !== currentBuild.case.formfactor) {
                issues.push(`Motherboard form factor (${currentBuild.motherboard.formfactor}) doesn't match case (${currentBuild.case.formfactor})`);
            }
        }
        
        if (currentBuild.psu) {
            const estimatedPower = calculatePowerRequirement();
            if (currentBuild.psu.wattage < estimatedPower) {
                issues.push(`Power supply (${currentBuild.psu.wattage}W) may be insufficient for your components`);
            }
        }
        
        if (!currentBuild.cpu) issues.push("CPU is required");
        if (!currentBuild.motherboard) issues.push("Motherboard is required");
        if (!currentBuild.psu) issues.push("Power supply is required");
        
        updateCompatibilityStatus(issues);
    }
    
    function calculatePowerRequirement() {
        let power = 0;
        if (currentBuild.cpu) power += 150;
        if (currentBuild.gpu) power += (currentBuild.gpu.powerdraw || 250);
        power += 100;
        return Math.ceil(power / 50) * 50;
    }
    
    function updateCompatibilityStatus(issues) {
        if (issues.length === 0 && currentBuild.cpu && currentBuild.motherboard && currentBuild.psu) {
            compatibilityStatus.className = 'compatibility-status compatibility-compatible';
            compatibilityStatus.textContent = '✓ All components are compatible';
        } else if (issues.length === 0) {
            compatibilityStatus.className = 'compatibility-status compatibility-unknown';
            compatibilityStatus.textContent = 'Select more components to check compatibility';
        } else if (issues.some(issue => issue.includes("doesn't match") || issue.includes("insufficient"))) {
            compatibilityStatus.className = 'compatibility-status compatibility-error';
            compatibilityStatus.textContent = `⚠ ${issues[0]}`;
        } else {
            compatibilityStatus.className = 'compatibility-status compatibility-warning';
            compatibilityStatus.textContent = `ℹ ${issues[0]}`;
        }
        
        if (issues.length > 1) {
            compatibilityStatus.title = issues.join('\n');
        } else {
            compatibilityStatus.removeAttribute('title');
        }
    }
    
    function filterComponents() {
        const typeFilter = componentTypeFilter?.value || 'all';
        const searchFilter = componentSearch?.value.toLowerCase() || '';
        
        let filteredData = {};
        
        if (typeFilter === 'all') {
            filteredData = { ...pcData };
        } else {
            filteredData[typeFilter] = pcData[typeFilter] || [];
        }
        
        for (const [category, items] of Object.entries(filteredData)) {
            if (!items || !Array.isArray(items)) continue;
            
            filteredData[category] = items.filter(item => 
                item.name && item.name.toLowerCase().includes(searchFilter) ||
                item.brand && item.brand.toLowerCase().includes(searchFilter) ||
                (item.category && item.category.toLowerCase().includes(searchFilter))
            );
        }
        
        renderComponentGallery(filteredData);
    }

    async function handleChatSubmit(e) {
        e.preventDefault();
        
        const message = userInput.value.trim();
        if (!message || isProcessing) return;
        
        await sendMessage(message);
    }
    
    function handleInputKeydown(e) {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            chatForm.dispatchEvent(new Event('submit'));
        }
    }
    
    function handleInputChange() {
        if (userInput.value.length > 500) {
            userInput.value = userInput.value.substring(0, 500);
        }
    }
    
    async function sendMessage(message) {
        isProcessing = true;
        
        addMessage('user', message);
        userInput.value = '';
        
        const loadingId = showLoadingIndicator();
        
        try {
            const response = await fetch('/api/ask', { // <-- CHANGED
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ message: message })
            });
            
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}`);
            }
            
            const data = await response.json();
            removeLoadingIndicator(loadingId);
            addMessage('bot', data.reply);
            
        } catch (error) {
            console.error('Chat error:', error);
            removeLoadingIndicator(loadingId);
            handleChatError(error);
        } finally {
            isProcessing = false;
        }
    }
    
    function addMessage(sender, content) {
        if (!chatBox) return;
        
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${sender}-message`;
        
        const timestamp = new Date().toLocaleTimeString([], { 
            hour: '2-digit', 
            minute: '2-digit' 
        });
        
        messageDiv.innerHTML = `
            <div class="message-content">
                <div class="message-header">
                    <strong>${sender === 'user' ? 'You' : 'AI'}</strong>
                    <span class="message-time">${timestamp}</span>
                </div>
                <div class="message-text">${formatMessage(content)}</div>
            </div>
        `;
        
        chatBox.appendChild(messageDiv);
        scrollToBottom();
    }
    
    function formatMessage(content) {
        return content
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/\*(.*?)\*/g, '<em>$1</em>')
            .replace(/•/g, '•')
            .replace(/\n/g, '<br>')
            .replace(/`(.*?)`/g, '<code>$1</code>');
    }
    
    function showLoadingIndicator() {
        if (!chatBox) return null;
        
        const loadingDiv = document.createElement('div');
        loadingDiv.className = 'message bot-message loading';
        loadingDiv.id = 'loading-' + Date.now();
        
        loadingDiv.innerHTML = `
            <div class="message-content">
                <div class="message-header">
                    <strong>AI</strong>
                </div>
                <div class="message-text">
                    <div class="typing-indicator">
                        <span></span>
                        <span></span>
                        <span></span>
                    </div>
                </div>
            </div>
        `;
        
        chatBox.appendChild(loadingDiv);
        scrollToBottom();
        return loadingDiv.id;
    }
    
    function removeLoadingIndicator(id) {
        const element = document.getElementById(id);
        if (element) {
            element.remove();
        }
    }
    
    function handleChatError(error) {
        const errorMessage = `
            ❌ <strong>Connection Issue</strong><br><br>
            I'm having trouble connecting to the server. Please check:<br><br>
            • The server is running (<code>node server.js</code>)<br>
            • You're accessing from <code>http://localhost:3000</code><br>
            • No firewall is blocking the connection<br><br>
            <em>Error: ${error.message}</em>
        `;
        
        addMessage('bot', errorMessage);
    }
    
    async function testServerConnection() {
        try {
            const response = await fetch('/api/health'); // <-- CHANGED
            if (response.ok) {
                const data = await response.json();
                console.log('✅ Server connected:', data);
            }
        } catch (error) {
            console.error('❌ Server connection failed:', error);
            if (chatBox) {
                addMessage('bot', '⚠️ <strong>Server Offline</strong><br>Please start the server with: <code>node server.js</code>');
            }
        }
    }
    
    async function loadPartsGallery() {
        if (!partsGallery) return;
        
        try {
            const response = await fetch('/data.json'); // <-- NO CHANGE
            if (!response.ok) throw new Error('Failed to load data');
            
            const data = await response.json();
            renderPartsGallery(data);
            
        } catch (error) {
            console.error('Error loading parts:', error);
            partsGallery.innerHTML = `
                <div class="error-state">
                    <h3>⚠️ Parts Unavailable</h3>
                    <p>Failed to load component data. Please check your data.json file.</p>
                </div>
            `;
        }
    }
    
    function renderPartsGallery(data) {
        if (!partsGallery) return;
        
        partsGallery.innerHTML = '';
        
        for (const [category, items] of Object.entries(data)) {
            if (!items || items.length === 0) continue;
            
            const categorySection = createCategorySection(category, items);
            partsGallery.appendChild(categorySection);
        }
        
        if (partsGallery.children.length === 0) {
            partsGallery.innerHTML = '<p class="no-parts">No parts data available.</p>';
        }
    }
    
    function createCategorySection(category, items) {
        const section = document.createElement('div');
        section.className = 'category-section';
        
        const header = document.createElement('h3');
        header.className = 'category-header';
        header.textContent = `${category} (${items.length})`;
        
        const grid = document.createElement('div');
        grid.className = 'parts-grid';
        
        items.forEach(item => {
            const card = createPartCard(item, category);
            grid.appendChild(card);
        });
        
        section.appendChild(header);
        section.appendChild(grid);
        return section;
    }
    
    function createPartCard(part, category) {
        const card = document.createElement('div');
        card.className = 'part-card';
        
        const details = getPartDetails(part, category);
        const imageUrl = part.image || 'images/placeholder.jpg';
        
        card.innerHTML = `
            <div class="part-image">
                <img src="${imageUrl}" alt="${part.name}" 
                     onerror="this.src='images/placeholder.jpg'">
            </div>
            <div class="part-info">
                <h4 class="part-name">${part.name}</h4>
                <p class="part-brand">${part.brand}</p>
                <p class="part-price">$${part.price}</p>
                <div class="part-details">
                    ${details.map(detail => `<span class="detail">${detail}</span>`).join('')}
                </div>
                ${part.link ? `
                    <a href="${part.link}" target="_blank" class="part-link">
                        More Info ↗
                    </a>
                ` : ''}
            </div>
        `;
        
        card.addEventListener('click', () => {
            if (userInput) {
                userInput.value = `Tell me about ${part.name}`;
                userInput.focus();
            }
        });
        
        return card;
    }
    
    function getPartDetails(part, category) {
        const details = [];
        
        switch (category) {
            case 'CPUs':
                if (part.cores) details.push(`${part.cores}C/${part.threads}T`);
                if (part.socket) details.push(part.socket);
                if (part.category) details.push(part.category);
                break;
            case 'GPUs':
                if (part.vram) details.push(`${part.vram}GB VRAM`);
                if (part.powerdraw) details.push(`${part.powerdraw}W`);
                break;
            case 'Motherboards':
                if (part.socket) details.push(part.socket);
                if (part.formfactor) details.push(part.formfactor);
                break;
            case 'PSUs':
                if (part.wattage) details.push(`${part.wattage}W`);
                if (part.rating) details.push(part.rating);
                break;
            case 'Storage':
                if (part.capacity) details.push(part.capacity);
                if (part.socket) details.push(part.socket);
                break;
            case 'Cases':
                if (part.formfactor) details.push(part.formfactor);
                if (part.color) details.push(part.color);
                break;
        }
        
        return details.slice(0, 3);
    }
    
    function showWelcomeMessage() {
        setTimeout(() => {
            const welcomeMessage = `
                🤖 <strong>Welcome to PC Part Picker!</strong><br><br>
                I can help you build the perfect computer in two ways:<br><br>
                • <strong>AI Build Assistant:</strong> Tell me your budget and needs<br>
                • <strong>Manual Builder:</strong> Select components yourself with compatibility checks<br>
                • <strong>Browse Parts:</strong> Explore all available components<br><br>
                Try the new manual builder for complete control over your build! 🛠️
            `;
            
            addMessage('bot', welcomeMessage);
        }, 1000);
    }
    
    function scrollToBottom() {
        if (chatBox) {
            chatBox.scrollTop = chatBox.scrollHeight;
        }
    }
    
    window.addSampleQuestion = function(question) {
        if (userInput) {
            userInput.value = question;
            userInput.focus();
        }
    };
});
