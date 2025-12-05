import { useState } from "react";
import { Navigation } from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, Send, Sparkles, Save, Bot } from "lucide-react";
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
        <p className="mb-6 text-base leading-relaxed text-foreground/80">{explanation || "Here is a build based on your request:"}</p>
        <div className="border border-border rounded-xl overflow-hidden bg-background shadow-subtle">
          <ul className="divide-y divide-border">
            {components.map((component) => (
              component.value && (
                <li key={component.name} className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 p-4 hover:bg-secondary/50 transition-colors">
                  <span className="text-sm font-medium text-muted-foreground w-32">
                    {component.name}
                  </span>
                  <span className="font-medium text-foreground flex-1 text-right sm:text-left">
                    {component.value?.name || "Unknown Part"}
                  </span>
                  <span className="font-mono text-sm font-medium bg-secondary px-2 py-1 rounded-md">
                    {typeof component.value?.price === 'number'
                      ? `$${component.value.price.toFixed(2)}`
                      : 'N/A'}
                  </span>
                </li>
              )
            ))}
          </ul>
          <div className="p-4 bg-secondary/30 border-t border-border flex justify-between items-center">
            <span className="font-bold text-sm uppercase tracking-wide text-muted-foreground">Total Cost</span>
            <span className="text-xl font-bold text-primary">
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
        "Hello. I am Trinity. Describe your ideal computer, and I will design it for you.",
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
        <div className="mb-12 text-center">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4 font-display">
            AI Architect
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Describe your needs, and let our intelligence engine design the perfect specification.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-[300px_1fr] max-w-6xl mx-auto">
          <div className="space-y-6">
            {/* Quick Prompts */}
            <div className="border border-border rounded-2xl p-6 bg-card shadow-subtle sticky top-24">
              <h3 className="font-semibold mb-4 flex items-center gap-2 text-sm uppercase tracking-wide text-muted-foreground">
                <Sparkles className="h-4 w-4" />
                Quick Commands
              </h3>
              <div className="space-y-2">
                {quickPrompts.map((prompt, index) => (
                  <button
                    key={index}
                    className="w-full text-left p-3 rounded-lg text-sm font-medium text-foreground/80 hover:bg-secondary hover:text-foreground transition-all duration-200"
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
          <div className="flex flex-col border border-border rounded-2xl bg-card shadow-medium h-[800px] overflow-hidden">
            <div className="p-4 border-b border-border bg-secondary/30 flex justify-between items-center backdrop-blur-sm">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="font-medium text-sm text-muted-foreground">Trinity AI v2.0</span>
              </div>
              <Bot className="h-5 w-5 text-muted-foreground" />
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-8 scrollbar-thin">
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div className={`max-w-[85%] ${message.role === "user" ? "ml-auto" : "mr-auto"}`}>
                    <div className={`p-6 rounded-2xl shadow-subtle ${message.role === "user"
                      ? "bg-primary text-primary-foreground rounded-br-none"
                      : "bg-secondary text-foreground rounded-bl-none"
                      }`}>
                      {message.role === 'assistant' ? (
                        <AssistantMessage content={message.content} />
                      ) : (
                        <div className="font-medium text-lg leading-relaxed">{message.content}</div>
                      )}
                    </div>
                    <div className={`mt-2 text-xs font-medium text-muted-foreground ${message.role === "user" ? "text-right" : "text-left"
                      }`}>
                      {message.role === "user" ? "You" : "Trinity"}
                    </div>
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="p-4 rounded-2xl bg-secondary text-foreground rounded-bl-none flex items-center gap-3">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span className="text-sm font-medium">Processing...</span>
                  </div>
                </div>
              )}
            </div>

            <div className="p-4 border-t border-border bg-background">
              <div className="flex gap-3">
                <Input
                  placeholder="Describe your ideal build..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSend()}
                  disabled={isLoading}
                  className="h-12 rounded-full px-6 border-border focus:ring-primary/20 bg-secondary/30"
                />
                <Button
                  onClick={() => handleSend()}
                  disabled={isLoading || !input.trim()}
                  size="icon"
                  className="h-12 w-12 rounded-full shrink-0 shadow-subtle hover:shadow-medium transition-all"
                >
                  {isLoading ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    <Send className="h-5 w-5" />
                  )}
                </Button>
              </div>
              <div className="flex justify-center mt-3">
                <Button
                  onClick={() => setShowSaveDialog(true)}
                  disabled={messages.length <= 1}
                  variant="ghost"
                  size="sm"
                  className="text-xs font-medium text-muted-foreground hover:text-foreground"
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
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            <div className="w-full max-w-md bg-background border border-border rounded-2xl shadow-large p-8">
              <h2 className="text-2xl font-bold tracking-tight mb-6">Save Configuration</h2>
              <div className="space-y-6">
                <div>
                  <label className="text-sm font-medium mb-2 block text-muted-foreground">Build Name</label>
                  <Input
                    placeholder="e.g., Gaming Beast 2024"
                    value={buildName}
                    onChange={(e) => setBuildName(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSaveConversation()}
                    autoFocus
                    className="h-12 rounded-lg"
                  />
                </div>
                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    className="flex-1 h-12 rounded-lg"
                    onClick={() => {
                      setShowSaveDialog(false);
                      setBuildName("");
                    }}
                  >
                    Cancel
                  </Button>
                  <Button
                    className="flex-1 h-12 rounded-lg"
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
