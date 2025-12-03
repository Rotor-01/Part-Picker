import { useState } from "react";
import Navigation from "@/components/Navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, Send, Sparkles, Save, Bot, User } from "lucide-react";
import { toast } from "sonner";
import { buildStorage } from "@/lib/buildStorage";

interface Message {
  role: "user" | "assistant";
  content: string;
}

const generateSystemPrompt = (): string => {
  return `
You are 'Trinity', an expert PC building assistant. Your primary goal is to help users build a PC by providing a list of components that match their budget, needs (e.g., gaming, video editing, office work), and preferences.

When a user asks for a PC build, you MUST respond with ONLY a valid JSON object. Do not include any other text, greetings, or explanations outside of the JSON structure.

The JSON object must have the following structure:
{
  "cpu": { "name": "Part Name", "price": 123.45 },
  "motherboard": { "name": "Part Name", "price": 123.45 },
  "gpu": { "name": "Part Name", "price": 123.45 },
  "ram": { "name": "Part Name", "price": 123.45 },
  "storage": { "name": "Part Name", "price": 123.45 },
  "psu": { "name": "Part Name", "price": 123.45 },
  "case": { "name": "Part Name", "price": 123.45 },
  "totalCost": 1234.56,
  "explanation": "A brief explanation of why these parts were chosen for the user's specific needs."
}
`;
};

const AssistantMessage = ({ content }: { content: string }) => {
  try {
    const build = JSON.parse(content);

    if (!build || typeof build !== 'object') {
      throw new Error('Invalid build data');
    }

    const { cpu, motherboard, gpu, ram, storage, psu, 'case': casePart, totalCost, explanation } = build;

    const components = [
      { name: 'CPU', value: cpu },
      { name: 'Motherboard', value: motherboard },
      { name: 'GPU', value: gpu },
      { name: 'RAM', value: ram },
      { name: 'Storage', value: storage },
      { name: 'PSU', value: psu },
      { name: 'Case', value: casePart },
    ];

    return (
      <div className="w-full">
        <p className="mb-6 text-lg font-medium leading-relaxed">{explanation || "Here is a build based on your request:"}</p>
        <div className="border-2 border-black p-6 bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
          <ul className="space-y-4">
            {components.map((component) => (
              component.value && (
                <li key={component.name} className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b border-border pb-2 last:border-0">
                  <span className="font-bold uppercase tracking-wider text-sm text-muted-foreground w-32">
                    {component.name}
                  </span>
                  <span className="font-bold text-foreground flex-1 text-right sm:text-left">
                    {component.value?.name || "Unknown Part"}
                  </span>
                  <span className="font-mono font-bold bg-black text-white px-2 py-0.5 text-sm">
                    {typeof component.value?.price === 'number'
                      ? `$${component.value.price.toFixed(2)}`
                      : 'N/A'}
                  </span>
                </li>
              )
            ))}
          </ul>
          <div className="mt-6 pt-4 border-t-2 border-black flex justify-between items-center">
            <span className="font-bold uppercase tracking-widest text-lg">Total Cost</span>
            <span className="text-2xl font-bold font-display text-accent">
              {typeof totalCost === 'number'
                ? `$${totalCost.toFixed(2)}`
                : 'N/A'}
            </span>
          </div>
        </div>
      </div>
    );
  } catch (error) {
    return (
      <div className="space-y-2 text-foreground font-medium">
        {content.split('\n').map((line, i) => (
          <div key={i}>{line}</div>
        ))}
      </div>
    );
  }
};

const AIBuild = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content:
        "SYSTEM ONLINE. I AM TRINITY. STATE YOUR REQUIREMENTS.",
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [buildName, setBuildName] = useState('');

  const quickPrompts = [
    'Gaming PC under $1500',
    'Workstation for video editing',
    'Budget gaming build $800',
    'High-end gaming rig $3000',
    'Office/Productivity PC $600',
    'Content creation workstation $2000',
  ];

  const handleSend = async (message?: string) => {
    const messageToSend = message || input;
    if (!messageToSend.trim() || isLoading) return;

    const userMessage: Message = { role: 'user', content: messageToSend };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          conversation: newMessages,
          systemPrompt: generateSystemPrompt(),
        }),
      });

      if (!response.ok) {
        throw new Error(`API Error: ${response.statusText}`);
      }

      const result = await response.json();

      const assistantMessage: Message = {
        role: 'assistant',
        content: result.response,
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      toast.error(`Failed to get AI response: ${errorMessage}`);
      setMessages((prev) => prev.slice(0, -1));
    } finally {
      setIsLoading(false);
    }
  };

  const extractPartsFromConversation = () => {
    const lastAssistantMessage = messages.findLast((msg) => msg.role === "assistant");

    if (!lastAssistantMessage) {
      return { components: {}, totalCost: 0 };
    }

    try {
      const jsonResponse = JSON.parse(lastAssistantMessage.content);
      const { totalCost, ...components } = jsonResponse;
      return { components, totalCost };
    } catch (error) {
      return { components: {}, totalCost: 0 };
    }
  };

  const handleSaveConversation = () => {
    if (!buildName.trim()) {
      toast.error("Please enter a build name");
      return;
    }

    try {
      const { components, totalCost } = extractPartsFromConversation();
      buildStorage.saveBuild({
        name: buildName,
        totalCost,
        components,
        source: "ai",
        conversation: messages,
      });
      toast.success(`Build "${buildName}" saved successfully!`);
      setBuildName("");
      setShowSaveDialog(false);
    } catch (error) {
      toast.error("Failed to save build");
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background font-sans">
      <Navigation />

      <main className="container py-12 flex-grow">
        <div className="mb-12 border-b-4 border-black pb-6">
          <h1 className="text-6xl font-bold uppercase tracking-tighter mb-2 font-display">
            AI <span className="text-accent">ARCHITECT</span>
          </h1>
          <p className="text-xl font-mono uppercase tracking-widest text-muted-foreground">
            // Initialize Build Sequence
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-[300px_1fr] max-w-7xl mx-auto">
          <div className="space-y-6">
            {/* Quick Prompts */}
            <div className="border-2 border-black p-6 bg-white shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] sticky top-24">
              <h3 className="font-bold uppercase tracking-widest mb-6 flex items-center gap-2 border-b-2 border-black pb-2">
                <Sparkles className="h-5 w-5" />
                Quick Commands
              </h3>
              <div className="space-y-3">
                {quickPrompts.map((prompt, index) => (
                  <button
                    key={index}
                    className="w-full text-left p-3 border-2 border-transparent hover:border-black hover:bg-accent hover:text-white transition-all font-bold uppercase text-sm tracking-tight"
                    onClick={() => handleSend(prompt)}
                    disabled={isLoading}
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Chat Interface */}
          <div className="flex flex-col border-2 border-black bg-white shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] h-[800px]">
            <div className="p-4 border-b-2 border-black bg-accent text-white flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-green-400 border border-black animate-pulse"></div>
                <span className="font-mono font-bold uppercase tracking-widest">Trinity_Core_v2.0</span>
              </div>
              <Bot className="h-6 w-6" />
            </div>

            <div className="flex-1 overflow-y-auto p-8 space-y-8 scrollbar-thin">
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div className={`max-w-[85%] ${message.role === "user" ? "ml-auto" : "mr-auto"}`}>
                    <div className={`p-6 border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] ${message.role === "user"
                        ? "bg-black text-white"
                        : "bg-white text-black"
                      }`}>
                      {message.role === 'assistant' ? (
                        <AssistantMessage content={message.content} />
                      ) : (
                        <div className="font-medium text-lg">{message.content}</div>
                      )}
                    </div>
                    <div className={`mt-2 font-mono text-xs uppercase tracking-widest text-muted-foreground ${message.role === "user" ? "text-right" : "text-left"
                      }`}>
                      {message.role === "user" ? "User_Input" : "System_Response"}
                    </div>
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="p-6 border-2 border-black bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex items-center gap-3">
                    <Loader2 className="h-5 w-5 animate-spin" />
                    <span className="font-mono font-bold uppercase animate-pulse">Processing Data...</span>
                  </div>
                </div>
              )}
            </div>

            <div className="p-6 border-t-2 border-black bg-slate-50">
              <div className="flex gap-4">
                <Input
                  placeholder="ENTER COMMAND..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSend()}
                  disabled={isLoading}
                  className="h-14 rounded-none border-2 border-black bg-white focus:ring-0 focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-shadow font-mono text-lg placeholder:text-slate-400"
                />
                <Button
                  onClick={() => handleSend()}
                  disabled={isLoading || !input.trim()}
                  className="h-14 w-14 rounded-none border-2 border-black bg-accent hover:bg-black text-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all"
                >
                  {isLoading ? (
                    <Loader2 className="h-6 w-6 animate-spin" />
                  ) : (
                    <Send className="h-6 w-6" />
                  )}
                </Button>
              </div>
              <div className="flex justify-center mt-4">
                <Button
                  onClick={() => setShowSaveDialog(true)}
                  disabled={messages.length <= 1}
                  variant="ghost"
                  className="text-xs uppercase tracking-widest hover:bg-transparent hover:underline"
                >
                  <Save className="h-3 w-3 mr-2" />
                  Save Configuration
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Save Build Dialog */}
        {showSaveDialog && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            <div className="w-full max-w-md bg-white border-2 border-black shadow-[8px_8px_0px_0px_rgba(255,255,255,1)] p-8">
              <h2 className="text-2xl font-bold uppercase tracking-tighter mb-6 font-display">Save Configuration</h2>
              <div className="space-y-6">
                <div>
                  <label className="font-bold uppercase text-sm mb-2 block">Build Identifier</label>
                  <Input
                    placeholder="ENTER NAME..."
                    value={buildName}
                    onChange={(e) => setBuildName(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSaveConversation()}
                    autoFocus
                    className="h-12 rounded-none border-2 border-black font-mono"
                  />
                </div>
                <div className="flex gap-4">
                  <Button
                    variant="outline"
                    className="flex-1 h-12 rounded-none border-2 border-black hover:bg-slate-100 font-bold uppercase"
                    onClick={() => {
                      setShowSaveDialog(false);
                      setBuildName("");
                    }}
                  >
                    Cancel
                  </Button>
                  <Button
                    className="flex-1 h-12 rounded-none bg-accent text-white border-2 border-black hover:bg-black font-bold uppercase shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
                    onClick={handleSaveConversation}
                  >
                    Save
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default AIBuild;
