import { useState, useRef, useEffect } from "react";
import { Navigation } from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, Sparkles, Save, Bot, Cpu, Zap, ArrowUp } from "lucide-react";
import { toast } from "sonner";
import { buildStorage } from "@/lib/buildStorage";
import { cn } from "@/lib/utils";

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
      { name: 'CPU', value: cpu, icon: Cpu },
      { name: 'GPU', value: gpu, icon: Zap },
      { name: 'Motherboard', value: motherboard },
      { name: 'RAM', value: ram },
      { name: 'Storage', value: storage },
      { name: 'PSU', value: psu },
      { name: 'Case', value: casePart },
    ];

    return (
      <div className="w-full animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="glass rounded-3xl overflow-hidden border border-white/10 shadow-2xl">
          {/* Header */}
          <div className="bg-white/5 p-6 border-b border-white/5 backdrop-blur-xl">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-liquid-blue to-liquid-purple flex items-center justify-center shadow-lg">
                  <Bot className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-lg text-white">System Configuration</h3>
                  <p className="text-xs text-white/40 font-mono uppercase tracking-wider">Optimized Build</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-xs text-white/40 font-mono uppercase tracking-wider mb-1">Total Estimate</p>
                <p className="text-2xl font-bold text-liquid-teal">
                  {typeof totalCost === 'number' ? `$${totalCost.toFixed(2)}` : 'N/A'}
                </p>
              </div>
            </div>
            <p className="text-white/70 leading-relaxed text-sm">{explanation}</p>
          </div>

          {/* Components List */}
          <div className="p-2">
            {components.map((component, index) => (
              component.value && (
                <div
                  key={component.name}
                  className="group flex items-center gap-4 p-4 rounded-2xl hover:bg-white/5 transition-all duration-300"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center border border-white/5 group-hover:border-white/20 transition-colors">
                    {component.icon ? (
                      <component.icon className="w-5 h-5 text-white/60 group-hover:text-white transition-colors" />
                    ) : (
                      <div className="w-2 h-2 rounded-full bg-white/20 group-hover:bg-white/60 transition-colors" />
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-white/40 font-mono uppercase tracking-wider mb-0.5">{component.name}</p>
                    <p className="text-white font-medium truncate group-hover:text-liquid-blue transition-colors">
                      {component.value?.name || "Unknown Part"}
                    </p>
                  </div>

                  <div className="text-right">
                    <span className="font-mono text-sm font-medium text-white/60 bg-white/5 px-3 py-1 rounded-lg border border-white/5">
                      {typeof component.value?.price === 'number' ? `$${component.value.price.toFixed(2)}` : 'N/A'}
                    </span>
                  </div>
                </div>
              )
            ))}
          </div>
        </div>
      </div>
    );
  } catch (error) {
    return (
      <div className="glass rounded-2xl p-6 text-white/80 leading-relaxed animate-in fade-in">
        {content.split('\n').map((line, i) => (
          <p key={i} className="mb-2 last:mb-0">{line}</p>
        ))}
      </div>
    );
  }
};

const AIBuild = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [buildName, setBuildName] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const quickPrompts = [
    { label: 'Gaming PC under $1500', icon: '🎮' },
    { label: 'Video Editing Workstation', icon: '🎬' },
    { label: 'Budget Build $800', icon: '💰' },
    { label: 'Streaming Setup', icon: '📡' },
  ];

  const handleSend = async (message?: string) => {
    const messageToSend = message || input;
    if (!messageToSend.trim() || isLoading) return;

    const userMessage: Message = { role: 'user', content: messageToSend };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          conversation: [...messages, userMessage],
          systemPrompt: generateSystemPrompt(),
        }),
      });

      if (!response.ok) throw new Error(`API Error: ${response.statusText}`);

      const result = await response.json();
      const assistantMessage: Message = { role: 'assistant', content: result.response };
      setMessages(prev => [...prev, assistantMessage]);
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      toast.error(`Failed to get response: ${errorMessage}`);
    } finally {
      setIsLoading(false);
    }
  };

  const extractPartsFromConversation = () => {
    const lastAssistantMessage = messages.findLast((msg) => msg.role === "assistant");
    if (!lastAssistantMessage) return { components: {}, totalCost: 0 };
    try {
      const jsonResponse = JSON.parse(lastAssistantMessage.content);
      const { totalCost, ...components } = jsonResponse;
      return { components, totalCost };
    } catch {
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
    } catch {
      toast.error("Failed to save build");
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white selection:bg-liquid-blue/30 overflow-hidden">
      {/* Liquid Background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[800px] h-[800px] bg-liquid-blue/20 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[600px] h-[600px] bg-liquid-purple/20 rounded-full blur-[100px] animate-pulse animation-delay-2000" />
      </div>

      <Navigation />

      <main className="relative z-10 h-screen flex flex-col pt-32 pb-6 px-4 max-w-5xl mx-auto">
        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto scrollbar-none px-4 py-6 space-y-8">
          {messages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center animate-in fade-in zoom-in duration-500">
              {/* Central Core Visualization */}
              <div className="relative w-32 h-32 mb-8">
                <div className="absolute inset-0 bg-gradient-to-br from-liquid-blue to-liquid-purple rounded-full blur-2xl opacity-50 animate-pulse" />
                <div className="relative w-full h-full glass rounded-full flex items-center justify-center border border-white/10 shadow-glow">
                  <Sparkles className="w-12 h-12 text-white/80" />
                </div>
              </div>

              <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4 bg-clip-text text-transparent bg-gradient-to-b from-white to-white/40">
                Trinity AI
              </h1>
              <p className="text-lg text-white/40 max-w-md mx-auto mb-12">
                Your personal architect for high-performance computing.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-2xl">
                {quickPrompts.map((prompt, index) => (
                  <button
                    key={index}
                    onClick={() => handleSend(prompt.label)}
                    className={cn(
                      "glass p-4 rounded-xl text-left hover:bg-white/10 hover:scale-[1.02] transition-all duration-300 group border border-white/5",
                      index >= 2 && "hidden sm:block"
                    )}
                  >
                    <span className="text-2xl mb-2 block">{prompt.icon}</span>
                    <span className="font-medium text-white/80 group-hover:text-white transition-colors">
                      {prompt.label}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <>
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={cn(
                    "flex w-full animate-in fade-in slide-in-from-bottom-4 duration-500",
                    message.role === "user" ? "justify-end" : "justify-start"
                  )}
                >
                  <div className={cn(
                    "max-w-[85%] md:max-w-[70%]",
                    message.role === "user" ? "ml-auto" : "mr-auto"
                  )}>
                    {message.role === 'assistant' ? (
                      <AssistantMessage content={message.content} />
                    ) : (
                      <div className="glass bg-liquid-blue/20 border-liquid-blue/30 text-white p-5 rounded-2xl rounded-br-sm backdrop-blur-md shadow-lg">
                        <p className="leading-relaxed">{message.content}</p>
                      </div>
                    )}
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start animate-in fade-in slide-in-from-bottom-2">
                  <div className="glass p-4 rounded-2xl rounded-bl-sm flex items-center gap-3">
                    <div className="flex gap-1">
                      <div className="w-2 h-2 bg-liquid-blue rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                      <div className="w-2 h-2 bg-liquid-purple rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                      <div className="w-2 h-2 bg-liquid-pink rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                    <span className="text-sm font-medium text-white/40">Trinity is thinking...</span>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </>
          )}
        </div>

        {/* Input Dock */}
        <div className="relative mt-4">
          <div className="glass rounded-[2rem] p-2 pr-3 flex items-center gap-2 border border-white/10 shadow-2xl bg-[#1a1a1a]/80 backdrop-blur-xl">
            <Input
              placeholder="Describe your dream build..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              disabled={isLoading}
              className="border-none bg-transparent h-12 px-6 text-lg focus-visible:ring-0 placeholder:text-white/20"
            />

            {messages.length > 1 && (
              <Button
                onClick={() => setShowSaveDialog(true)}
                variant="ghost"
                size="icon"
                className="h-10 w-10 rounded-full text-white/40 hover:text-white hover:bg-white/10 transition-colors"
                title="Save Build"
              >
                <Save className="w-5 h-5" />
              </Button>
            )}

            <Button
              onClick={() => handleSend()}
              disabled={isLoading || !input.trim()}
              className={cn(
                "h-10 w-10 rounded-full transition-all duration-300 shadow-lg",
                input.trim()
                  ? "bg-white text-black hover:scale-105 hover:bg-white/90"
                  : "bg-white/10 text-white/20"
              )}
            >
              {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <ArrowUp className="w-5 h-5" />
              )}
            </Button>
          </div>
        </div>

        {/* Save Dialog */}
        {showSaveDialog && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md p-4 animate-in fade-in duration-200">
            <div className="w-full max-w-md glass bg-[#1a1a1a]/90 border border-white/10 rounded-3xl p-8 shadow-2xl">
              <h2 className="text-2xl font-bold mb-6">Save Configuration</h2>
              <div className="space-y-6">
                <div>
                  <label className="text-sm font-medium mb-2 block text-white/60">Build Name</label>
                  <Input
                    placeholder="e.g., Gaming Beast 2026"
                    value={buildName}
                    onChange={(e) => setBuildName(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSaveConversation()}
                    autoFocus
                    className="h-12 rounded-xl bg-white/5 border-white/10 focus:border-white/20"
                  />
                </div>
                <div className="flex gap-3">
                  <Button
                    variant="ghost"
                    className="flex-1 h-12 rounded-xl hover:bg-white/5"
                    onClick={() => {
                      setShowSaveDialog(false);
                      setBuildName("");
                    }}
                  >
                    Cancel
                  </Button>
                  <Button
                    className="flex-1 h-12 rounded-xl bg-white text-black hover:bg-white/90"
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
