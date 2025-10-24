import { useState, useEffect } from "react";
import Navigation from "@/components/Navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Loader2, Send, Sparkles, Brain, Bot } from "lucide-react";
import { toast } from "sonner";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import pcPartsData from "@/data/pc-parts.json";

interface Message {
  role: "user" | "assistant";
  content: string;
}

type ApiProvider = "gemini" | "chatgpt";

// System prompt to instruct the AI
const SYSTEM_PROMPT = `
You are 'Trinity', an expert PC building assistant. Your goal is to help users build a PC based on their budget, needs (like gaming, video editing, or office work), and preferences.

You MUST use the following JSON data as your ONLY source of truth for available PC parts, their specifications, and their prices. Do not invent parts, specifications, or prices. If a user asks for something not in this catalog, inform them it's unavailable and suggest an alternative from the catalog.

When you recommend a build:
1.  List each component (CPU, GPU, Motherboard, RAM, Storage, PSU, Case).
2.  State the price of each component.
3.  Calculate and state the total price of the build.
4.  Briefly explain why the components were chosen for the user's needs.

Here is your entire parts catalog:
${JSON.stringify(pcPartsData)}
`;

// Helper to check for environment variables (Vite/Vercel convention)
const getInitialKey = (keyName: string): { key: string, isEnv: boolean } => {
  // This attempts to read keys set as VITE_... environment variables during the build process.
  // We use the common process.env convention here.
  const envKey = (process.env as any)[keyName]; 
  
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
      content: "Hello! I'm your AI PC building assistant. Tell me about your needs - budget, use case (gaming, work, content creation), and preferences. Please select your AI provider and enter your API key to begin."
    }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // API Configuration State
  const [selectedApi, setSelectedApi] = useState<ApiProvider>("gemini");
  const [geminiApiKey, setGeminiApiKey] = useState(initialGemini.key);
  const [chatGptApiKey, setChatGptApiKey] = useState(initialChatGpt.key);

  const isGeminiKeyEnv = initialGemini.isEnv;
  const isChatGptKeyEnv = initialChatGpt.isEnv;

  const quickPrompts = [
    "Gaming PC under $1500",
    "Workstation for video editing",
    "Budget gaming build $800",
    "High-end gaming rig $3000"
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
        parts: [{ text: SYSTEM_PROMPT }]
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
      { role: "system", content: SYSTEM_PROMPT },
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

  return (
    <div className="min-h-screen">
      <Navigation />
      
      <main className="container py-8">
        <div className="mb-8 text-center">
          <h1 className="mb-4 text-4xl font-bold text-gradient">AI Build Assistant</h1>
          <p className="text-lg text-muted-foreground">
            Let AI help you build the perfect PC based on your needs
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1fr_2fr]">
          <div className="space-y-6">
            {/* API Configuration Card */}
            <Card className="card-gradient h-fit border-border">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bot className="h-5 w-5 text-primary" />
                  AI Configuration
                  {(isGeminiKeyEnv || isChatGptKeyEnv) && (
                    <span className="ml-2 text-xs font-normal text-green-400">(Key Loaded from ENV)</span>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="api-select">AI Provider</Label>
                  <Select value={selectedApi} onValueChange={(val) => setSelectedApi(val as ApiProvider)}>
                    <SelectTrigger id="api-select">
                      <SelectValue placeholder="Select AI Provider" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="gemini">
                        <div className="flex items-center gap-2">
                          <Brain className="h-4 w-4" /> Google Gemini
                        </div>
                      </SelectItem>
                      <SelectItem value="chatgpt">
                        <div className="flex items-center gap-2">
                          <Sparkles className="h-4 w-4" /> OpenAI ChatGPT
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {selectedApi === 'gemini' && (
                  <div>
                    <Label htmlFor="gemini-key">Gemini API Key</Label>
                    <Input
                      id="gemini-key"
                      type="password"
                      placeholder={isGeminiKeyEnv ? "Key loaded from VITE_GEMINI_API_KEY" : "Enter your Gemini API Key"}
                      value={geminiApiKey}
                      onChange={(e) => setGeminiApiKey(e.target.value)}
                      disabled={isGeminiKeyEnv}
                      className={isGeminiKeyEnv ? "bg-secondary/50 cursor-not-allowed" : ""}
                    />
                  </div>
                )}

                {selectedApi === 'chatgpt' && (
                  <div>
                    <Label htmlFor="chatgpt-key">ChatGPT API Key (OpenAI)</Label>
                    <Input
                      id="chatgpt-key"
                      type="password"
                      placeholder={isChatGptKeyEnv ? "Key loaded from VITE_CHATGPT_API_KEY" : "Enter your OpenAI API Key"}
                      value={chatGptApiKey}
                      onChange={(e) => setChatGptApiKey(e.target.value)}
                      disabled={isChatGptKeyEnv}
                      className={isChatGptKeyEnv ? "bg-secondary/50 cursor-not-allowed" : ""}
                    />
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Quick Prompts Card */}
            <Card className="card-gradient h-fit border-border">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-primary" />
                  Quick Prompts
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {quickPrompts.map((prompt, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    className="w-full justify-start text-left"
                    onClick={() => handleSend(prompt)}
                    disabled={isLoading}
                  >
                    {prompt}
                  </Button>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Chat Card */}
          <Card className="card-gradient flex flex-col border-border">
            <CardHeader>
              <CardTitle>Chat</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-1 flex-col">
              <ScrollArea className="mb-4 flex-1 pr-4" style={{ height: "500px" }}>
                <div className="space-y-4">
                  {messages.map((message, index) => (
                    <div
                      key={index}
                      className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className={`max-w-[80%] rounded-lg p-4 ${
                          message.role === "user"
                            ? "bg-primary text-primary-foreground"
                            : "bg-secondary text-secondary-foreground"
                        }`}
                      >
                        {/* A simple markdown-like renderer for newlines */}
                        {message.content.split('\n').map((line, i) => (
                          <span key={i} className="block">
                            {line}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                  {isLoading && (
                    <div className="flex justify-start">
                      <div className="rounded-lg bg-secondary p-4">
                        <Loader2 className="h-5 w-5 animate-spin" />
                      </div>
                    </div>
                  )}
                </div>
              </ScrollArea>

              <div className="flex gap-2">
                <Input
                  placeholder="Ask about PC builds, components, compatibility..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSend()}
                  disabled={isLoading}
                  className="flex-1"
                />
                <Button onClick={() => handleSend()} disabled={isLoading || !input.trim()}>
                  {isLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Send className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default AIBuild;

