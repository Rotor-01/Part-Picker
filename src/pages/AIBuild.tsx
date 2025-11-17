import { useState } from "react";
import Navigation from "@/components/Navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Loader2, Send, Sparkles, Brain, Bot, Save } from "lucide-react";
import { toast } from "sonner";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import superiorParts from "@/data/superiorParts";
import { buildStorage } from "@/lib/buildStorage";

interface Message {
  role: "user" | "assistant";
  content: string;
}

type ApiProvider = "gemini" | "chatgpt";

// Helper function to generate system prompt with parts data
const generateSystemPrompt = (): string => {
  return `
You are 'Trinity', an expert PC building assistant. Your goal is to help users build a PC based on their budget, needs (like gaming, video editing, or office work), and preferences.

You MUST use the following JSON data as your ONLY source of truth for available PC parts, their specifications, and their prices. Do not invent parts, specifications, or prices. If a user asks for something not in this catalog, inform them it's unavailable and suggest an alternative from the catalog.

When you recommend a build:
1. List each component (CPU, GPU, Motherboard, RAM, Storage, PSU, Case) with **bold** component names
2. State the price of each component clearly
3. Calculate and state the **total price** of the build prominently
4. Briefly explain why the components were chosen for the user's needs
5. Use bullet points (•) for easy reading
6. Format prices as $XXX

Be friendly, helpful, and use emojis occasionally to make responses engaging. Always ensure compatibility between components.

Here is your entire parts catalog:
${JSON.stringify(superiorParts)}
`;
};

// Helper to check for environment variables (Vite convention)
const getInitialKey = (keyName: string): { key: string, isEnv: boolean } => {
  // This attempts to read keys set as VITE_... environment variables during the build process.
  // We use the common import.meta.env convention for Vite.
  const envKey = (import.meta.env as any)[keyName]; 
  
  if (envKey) {
    return { key: envKey, isEnv: true };
  }
  return { key: '', isEnv: false };
};

const AIBuild = () => {
  // Initialize state from environment variables if they exist
  const initialGemini = getInitialKey('VITE_GEMINI_API_KEY');
  const initialChatGpt = getInitialKey('VITE_CHATGPT_API_KEY');

  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "Hello! I'm Trinity, your AI PC building assistant. 🚀\n\nI can help you build the perfect PC based on your budget, use case, and preferences. Just tell me what you need!\n\nWhat kind of PC are you looking to build?"
    }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [buildName, setBuildName] = useState("");

  // API Configuration State
  const [selectedApi, setSelectedApi] = useState<ApiProvider>("gemini");
  const [geminiApiKey, setGeminiApiKey] = useState(initialGemini.key);
  const [chatGptApiKey, setChatGptApiKey] = useState(initialChatGpt.key);

  const quickPrompts = [
    "Gaming PC under $1500",
    "Workstation for video editing",
    "Budget gaming build $800",
    "High-end gaming rig $3000",
    "Office/Productivity PC $600",
    "Content creation workstation $2000"
  ];

  // --- API Call Functions ---

  /**
   * Retries a fetch request with exponential backoff.
   */
  const fetchWithRetry = async (url: string, options: RequestInit, retries = 3, delay = 1000): Promise<any> => {
    try {
      const response = await fetch(url, options);
      if (!response.ok) {
        if (response.status === 429 && retries > 0) {
          await new Promise(res => setTimeout(res, delay));
          return fetchWithRetry(url, options, retries - 1, delay * 2);
        }
        throw new Error(`API Error: ${response.statusText} (Status: ${response.status})`);
      }
      return response.json();
    } catch (error) {
      if (retries > 0) {
        await new Promise(res => setTimeout(res, delay));
        return fetchWithRetry(url, options, retries - 1, delay * 2);
      }
      throw error;
    }
  };

  /**
   * Calls the Google Gemini API
   */
  const callGeminiApi = async (userMessage: string, history: Message[]): Promise<string> => {
    const apiKey = geminiApiKey;
    if (!apiKey) {
      toast.error("Please enter your Gemini API Key.");
      throw new Error("Missing API key");
    }

    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`;

    const contents = history.map(msg => ({
      role: msg.role === "assistant" ? "model" : "user",
      parts: [{ text: msg.content }]
    }));
    contents.push({
      role: "user",
      parts: [{ text: userMessage }]
    });

    const payload = {
      contents: contents,
      systemInstruction: {
        parts: [{ text: generateSystemPrompt() }]
      }
    };

    const result = await fetchWithRetry(apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    if (result.candidates && result.candidates[0].content?.parts?.[0]?.text) {
      return result.candidates[0].content.parts[0].text;
    } else {
      throw new Error("Invalid response structure from Gemini API.");
    }
  };

  /**
   * Calls the OpenAI (ChatGPT) API
   */
  const callChatGptApi = async (userMessage: string, history: Message[]): Promise<string> => {
    const apiKey = chatGptApiKey;
    if (!apiKey) {
      toast.error("Please enter your ChatGPT API Key.");
      throw new Error("Missing API key");
    }

    const apiUrl = 'https://api.openai.com/v1/chat/completions';

    const messages = [
      { role: "system", content: generateSystemPrompt() },
      ...history.map(msg => ({ role: msg.role, content: msg.content })),
      { role: "user", content: userMessage }
    ];

    const payload = {
      model: "gpt-4o-mini", // Using a cost-effective and powerful model
      messages: messages
    };

    const result = await fetchWithRetry(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify(payload)
    });

    if (result.choices && result.choices[0].message?.content) {
      return result.choices[0].message.content;
    } else {
      throw new Error("Invalid response structure from ChatGPT API.");
    }
  };

  // --- Main Send Handler ---

  const handleSend = async (message?: string) => {
    const messageToSend = message || input;
    if (!messageToSend.trim() || isLoading) return;

    const userMessage: Message = { role: "user", content: messageToSend };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput("");
    setIsLoading(true);

    try {
      let assistantResponse: string;
      const history = newMessages.slice(0, -1); // Get all messages except the last user one

      if (selectedApi === "gemini") {
        assistantResponse = await callGeminiApi(messageToSend, history);
      } else {
        assistantResponse = await callChatGptApi(messageToSend, history);
      }

      const assistantMessage: Message = {
        role: "assistant",
        content: assistantResponse
      };
      
      setMessages(prev => [...prev, assistantMessage]);
    } catch (error: any) {
      toast.error(`Failed to get AI response: ${error.message}`);
      console.error(error);
      // Remove the user's message if the API call failed
      setMessages(prev => prev.slice(0, -1));
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveConversation = () => {
    if (!buildName.trim()) {
      toast.error("Please enter a build name");
      return;
    }

    try {
      // Save the AI conversation as a build record
      buildStorage.saveBuild({
        name: buildName,
        totalCost: 0, // AI builds don't have a calculated total yet
        components: {
          cpu: null,
          motherboard: null,
          gpu: null,
          ram: null,
          storage: null,
          psu: null,
          case: null,
        },
        source: "ai",
      });
      toast.success(`Build "${buildName}" saved successfully!`);
      setBuildName("");
      setShowSaveDialog(false);
    } catch (error) {
      toast.error("Failed to save build");
      console.error(error);
    }
  };

  return (
    <div className="min-h-screen">
      <Navigation />
      
      <main className="container py-6 sm:py-8">
        <div className="mb-6 sm:mb-8 text-center">
          <h1 className="mb-3 sm:mb-4 text-2xl sm:text-3xl lg:text-4xl font-bold text-gradient">AI Build Assistant</h1>
          <p className="text-base sm:text-lg text-muted-foreground px-4">
            Let AI help you build the perfect PC based on your needs
          </p>
        </div>

        <div className="grid gap-4 sm:gap-6 lg:grid-cols-[1fr_2fr]">
          <div className="space-y-4 sm:space-y-6">
            {/* AI Provider Selection */}
            <Card className="card-gradient h-fit border-border">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                  <Bot className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                  AI Provider
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Select value={selectedApi} onValueChange={(val) => setSelectedApi(val as ApiProvider)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select AI Provider" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="gemini">
                      <div className="flex items-center gap-2">
                        <Brain className="h-4 w-4 text-blue-500" /> 
                        <span>Google Gemini</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="chatgpt">
                      <div className="flex items-center gap-2">
                        <Sparkles className="h-4 w-4 text-green-500" /> 
                        <span>OpenAI ChatGPT</span>
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </CardContent>
            </Card>

            {/* Quick Prompts Card */}
            <Card className="card-gradient h-fit border-border">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                  <Sparkles className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                  Quick Prompts
                </CardTitle>
                <p className="text-xs text-muted-foreground">Click any prompt to get started quickly</p>
              </CardHeader>
              <CardContent className="space-y-2 sm:space-y-3">
                {quickPrompts.map((prompt, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    className="w-full justify-start text-left h-auto p-3 hover:bg-primary/5 hover:border-primary/50 transition-all"
                    onClick={() => handleSend(prompt)}
                    disabled={isLoading}
                  >
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-primary/60"></div>
                      <span className="text-sm">{prompt}</span>
                    </div>
                  </Button>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Chat Card */}
          <Card className="card-gradient flex flex-col border-border">
            <CardHeader className="pb-4">
              <CardTitle className="text-base sm:text-lg">
                Chat with Trinity
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-1 flex-col">
              <ScrollArea className="mb-3 sm:mb-4 flex-1 pr-2 sm:pr-4 scrollbar-thin" style={{ height: "400px" }}>
                <div className="space-y-4">
                  {messages.map((message, index) => (
                    <div
                      key={index}
                      className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className={`max-w-[85%] sm:max-w-[80%] rounded-lg p-3 sm:p-4 text-sm sm:text-base ${
                          message.role === "user"
                            ? "bg-primary text-primary-foreground"
                            : "bg-secondary text-secondary-foreground"
                        }`}
                      >
                        {/* Enhanced message formatting */}
                        <div className="space-y-2">
                          {message.content.split('\n').map((line, i) => {
                            // Handle bullet points and numbered lists
                            if (line.trim().match(/^[\d]+\./)) {
                              return (
                                <div key={i} className="flex items-start gap-2">
                                  <span className="text-primary font-semibold mt-0.5">{line.match(/^[\d]+/)?.[0]}.</span>
                                  <span>{line.replace(/^[\d]+\.\s*/, '')}</span>
                                </div>
                              );
                            }
                            if (line.trim().startsWith('•') || line.trim().startsWith('-')) {
                              return (
                                <div key={i} className="flex items-start gap-2">
                                  <span className="text-primary mt-1">•</span>
                                  <span>{line.replace(/^[•-]\s*/, '')}</span>
                                </div>
                              );
                            }
                            // Handle bold text (simple **text** format)
                            if (line.includes('**')) {
                              const parts = line.split(/(\*\*.*?\*\*)/g);
                              return (
                                <div key={i}>
                                  {parts.map((part, j) => 
                                    part.startsWith('**') && part.endsWith('**') ? (
                                      <strong key={j} className="font-semibold">{part.slice(2, -2)}</strong>
                                    ) : (
                                      <span key={j}>{part}</span>
                                    )
                                  )}
                                </div>
                              );
                            }
                            return <div key={i}>{line}</div>;
                          })}
                        </div>
                      </div>
                    </div>
                  ))}
                  {isLoading && (
                    <div className="flex justify-start">
                      <div className="rounded-lg bg-secondary p-4 flex items-center gap-2">
                        <Loader2 className="h-4 w-4 animate-spin text-primary" />
                        <span className="text-sm text-muted-foreground">Trinity is thinking...</span>
                      </div>
                    </div>
                  )}
                </div>
              </ScrollArea>

              <div className="space-y-2">
                <div className="flex gap-2">
                  <Input
                    placeholder="Ask about PC builds..."
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSend()}
                    disabled={isLoading}
                    className="flex-1 text-sm sm:text-base"
                  />
                  <Button 
                    onClick={() => handleSend()} 
                    disabled={isLoading || !input.trim()} 
                    size="sm"
                    className="min-w-[40px]"
                  >
                    {isLoading ? (
                      <Loader2 className="h-3 w-3 sm:h-4 sm:w-4 animate-spin" />
                    ) : (
                      <Send className="h-3 w-3 sm:h-4 sm:w-4" />
                    )}
                  </Button>
                </div>
                <Button 
                  onClick={() => setShowSaveDialog(true)} 
                  disabled={messages.length <= 1}
                  variant="outline"
                  className="w-full"
                  size="sm"
                >
                  <Save className="h-3 w-3 sm:h-4 sm:w-4 mr-2" />
                  Save Build
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Save Build Dialog */}
        {showSaveDialog && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <Card className="w-full max-w-md card-gradient border-border">
              <CardHeader>
                <CardTitle>Save Build</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Build Name</label>
                  <Input
                    placeholder="e.g., Gaming Rig 2024"
                    value={buildName}
                    onChange={(e) => setBuildName(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSaveConversation()}
                    autoFocus
                  />
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() => {
                      setShowSaveDialog(false);
                      setBuildName("");
                    }}
                  >
                    Cancel
                  </Button>
                  <Button
                    className="flex-1"
                    onClick={handleSaveConversation}
                  >
                    Save
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </main>
    </div>
  );
};

export default AIBuild;

