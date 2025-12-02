import { useState } from "react";
import Navigation from "@/components/Navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, Send, Sparkles, Save, Bot, User } from "lucide-react";
import { toast } from "sonner";
import { buildStorage } from "@/lib/buildStorage";

// BEFORE: Dark chat interface with heavy gradients
// AFTER: Clean, professional chat interface with distinct message bubbles
// KEY CHANGES:
// - Updated message bubbles for better readability (Blue for user, White for AI)
// - Cleaned up input area and quick prompts
// - Improved typography and spacing
// - Added professional loading states

interface Message {
  role: "user" | "assistant";
  content: string;
}

// Helper function to generate system prompt with parts data
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

Example User Query: "I need a gaming PC for under $1000"

Example JSON Response:
{
  "cpu": { "name": "AMD Ryzen 5 5600X", "price": 199.99 },
  "motherboard": { "name": "MSI B550-A PRO", "price": 139.99 },
  "gpu": { "name": "NVIDIA GeForce RTX 3060", "price": 329.99 },
  "ram": { "name": "Corsair Vengeance LPX 16GB (2x8GB) DDR4-3200", "price": 54.99 },
  "storage": { "name": "Western Digital Blue SN570 1TB NVMe SSD", "price": 79.99 },
  "psu": { "name": "EVGA 600 W1, 80+ WHITE 600W", "price": 49.99 },
  "case": { "name": "NZXT H510", "price": 79.99 },
  "totalCost": 934.93,
  "explanation": "This build provides excellent 1080p gaming performance and stays comfortably under your $1000 budget. The Ryzen 5 5600X is a great value CPU, and the RTX 3060 can handle most modern games at high settings."
}
`;
};



const AssistantMessage = ({ content }: { content: string }) => {
  try {
    const build = JSON.parse(content);

    // Ensure build is an object
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
        <p className="mb-4 text-foreground/80 leading-relaxed">{explanation || "Here is a build based on your request:"}</p>
        <div className="bg-secondary/50 rounded-lg p-4 border border-border">
          <ul className="space-y-3">
            {components.map((component) => (
              component.value && (
                <li key={component.name} className="flex justify-between items-start gap-4 text-sm">
                  <span className="min-w-0 break-words flex-1 text-muted-foreground">
                    <strong className="text-foreground font-medium">{component.name}:</strong> {component.value?.name || "Unknown Part"}
                  </span>
                  <span className="whitespace-nowrap font-semibold text-primary">
                    {typeof component.value?.price === 'number'
                      ? `$${component.value.price.toFixed(2)}`
                      : 'Price N/A'}
                  </span>
                </li>
              )
            ))}
          </ul>
          <hr className="my-4 border-border" />
          <div className="flex justify-between font-bold text-lg">
            <span>Total Cost:</span>
            <span className="text-primary">
              {typeof totalCost === 'number'
                ? `$${totalCost.toFixed(2)}`
                : 'N/A'}
            </span>
          </div>
        </div>
      </div>
    );
  } catch (error) {
    // If parsing fails, render as plain text with basic formatting
    return (
      <div className="space-y-2 text-foreground/90">
        {content.split('\n').map((line, i) => {
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
          if (line.includes('**')) {
            const parts = line.split(/(\*\*.*?\*\*)/g);
            return (
              <div key={i}>
                {parts.map((part, j) =>
                  part.startsWith('**') && part.endsWith('**') ? (
                    <strong key={j} className="font-semibold text-foreground">{part.slice(2, -2)}</strong>
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
    );
  }
};

const AIBuild = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content:
        "Hello! I'm Trinity, your Creative Build Assistant. 🚀\n\nI can help you design the perfect workstation or gaming rig based on your specific creative needs. Tell me what you want to create!",
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

  // --- Main Send Handler ---

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
        let errorMessage = `API Error: ${response.statusText} (Status: ${response.status})`;
        try {
          const errorResult = await response.json();
          errorMessage = errorResult.error || errorMessage;
        } catch (parseError) {
          // If we can't parse the error response as JSON, use the default message
          console.warn('Could not parse error response as JSON:', parseError);
        }
        throw new Error(errorMessage);
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
      console.error(error);
      // Remove the user's message if the API call failed
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
      console.error("Failed to parse AI response:", error);
      return { components: {}, totalCost: 0 };
    }
  };

  const handleSaveConversation = () => {
    if (!buildName.trim()) {
      toast.error("Please enter a build name");
      return;
    }

    try {
      // Extract parts from the AI conversation
      const { components, totalCost } = extractPartsFromConversation();

      // Save the AI conversation as a build record
      buildStorage.saveBuild({
        name: buildName,
        totalCost,
        components,
        source: "ai",
        conversation: messages, // Store the entire conversation for reference
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
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navigation />

      <main className="container py-8 flex-grow">
        <div className="mb-8 text-center animate-fade-in-up">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-orange-100 text-orange-600 mb-4 shadow-sm">
            <Sparkles className="w-8 h-8" />
          </div>
          <h1 className="mb-3 text-4xl font-bold text-slate-900">Creative Assistant</h1>
          <p className="text-lg text-slate-500 max-w-2xl mx-auto">
            Describe your dream workflow, and let Trinity design the perfect machine for you.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-[300px_1fr] max-w-6xl mx-auto">
          <div className="space-y-6 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
            {/* Quick Prompts Card */}
            <Card className="h-fit border-0 shadow-xl shadow-slate-200/50 bg-white/80 backdrop-blur-sm sticky top-24">
              <CardHeader className="pb-4 border-b border-slate-100">
                <CardTitle className="flex items-center gap-2 text-lg text-slate-900">
                  <Sparkles className="h-5 w-5 text-orange-500" />
                  Quick Starts
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 pt-4">
                {quickPrompts.map((prompt, index) => (
                  <Button
                    key={index}
                    variant="ghost"
                    className="w-full justify-start text-left h-auto p-3 hover:bg-orange-50 hover:text-orange-700 rounded-xl transition-all group"
                    onClick={() => handleSend(prompt)}
                    disabled={isLoading}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full bg-slate-200 group-hover:bg-orange-400 transition-colors"></div>
                      <span className="text-sm font-medium text-slate-600 group-hover:text-orange-700">{prompt}</span>
                    </div>
                  </Button>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Chat Card */}
          <Card className="flex flex-col border-0 shadow-2xl shadow-slate-200/60 h-[700px] min-w-0 bg-white rounded-3xl overflow-hidden animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            <CardHeader className="pb-4 border-b border-slate-100 bg-white z-10">
              <CardTitle className="text-lg flex items-center gap-3 text-slate-900">
                <div className="relative">
                  <div className="w-3 h-3 rounded-full bg-green-500 border-2 border-white absolute -right-0.5 -bottom-0.5"></div>
                  <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center text-orange-600">
                    <Bot className="w-6 h-6" />
                  </div>
                </div>
                <div>
                  <div className="font-bold">Trinity AI</div>
                  <div className="text-xs font-normal text-slate-500">Always active</div>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-1 flex-col p-0 min-h-0 min-w-0 bg-slate-50/50">
              <div className="flex-1 min-h-0 overflow-y-auto p-6 scrollbar-thin">
                <div className="space-y-8">
                  {messages.map((message, index) => (
                    <div
                      key={index}
                      className={`flex ${message.role === "user" ? "justify-end" : "justify-start"} animate-fade-in-up`}
                    >
                      <div className={`flex gap-4 max-w-[85%] ${message.role === "user" ? "flex-row-reverse" : "flex-row"}`}>
                        <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center shadow-sm ${message.role === "user"
                            ? "bg-gradient-to-br from-orange-500 to-red-500 text-white"
                            : "bg-white text-orange-600 border border-slate-100"
                          }`}>
                          {message.role === "user" ? <User className="w-5 h-5" /> : <Bot className="w-6 h-6" />}
                        </div>

                        <div
                          className={`rounded-2xl p-6 shadow-sm text-[15px] leading-relaxed ${message.role === "user"
                              ? "bg-slate-900 text-white rounded-tr-none shadow-slate-200/50"
                              : "bg-white text-slate-700 border border-slate-100 rounded-tl-none shadow-sm"
                            }`}
                        >
                          {message.role === 'assistant' ? (
                            <AssistantMessage content={message.content} />
                          ) : (
                            <div>{message.content}</div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                  {isLoading && (
                    <div className="flex justify-start animate-pulse">
                      <div className="flex gap-4">
                        <div className="flex-shrink-0 w-10 h-10 rounded-full bg-white text-orange-600 border border-slate-100 flex items-center justify-center shadow-sm">
                          <Bot className="w-6 h-6" />
                        </div>
                        <div className="rounded-2xl rounded-tl-none bg-white border border-slate-100 p-4 flex items-center gap-3 shadow-sm">
                          <Loader2 className="h-5 w-5 animate-spin text-orange-500" />
                          <span className="text-sm text-slate-500 font-medium">Trinity is designing your build...</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="p-4 bg-white border-t border-slate-100">
                <div className="relative flex items-center gap-2 max-w-3xl mx-auto">
                  <Input
                    placeholder="Type your request here..."
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSend()}
                    disabled={isLoading}
                    className="flex-1 h-14 pl-6 pr-14 rounded-full border-slate-200 bg-slate-50 focus:bg-white text-base shadow-inner"
                  />
                  <Button
                    onClick={() => handleSend()}
                    disabled={isLoading || !input.trim()}
                    size="icon"
                    className="absolute right-2 w-10 h-10 rounded-full bg-orange-500 hover:bg-orange-600 shadow-md transition-transform hover:scale-105"
                  >
                    {isLoading ? (
                      <Loader2 className="h-5 w-5 animate-spin text-white" />
                    ) : (
                      <Send className="h-5 w-5 text-white" />
                    )}
                  </Button>
                </div>
                <div className="text-center mt-3">
                  <Button
                    onClick={() => setShowSaveDialog(true)}
                    disabled={messages.length <= 1}
                    variant="ghost"
                    className="text-xs text-slate-400 hover:text-orange-600 hover:bg-transparent"
                    size="sm"
                  >
                    <Save className="h-3 w-3 mr-1.5" />
                    Save this conversation
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Save Build Dialog */}
        {showSaveDialog && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            <Card className="w-full max-w-md bg-white border-0 shadow-2xl rounded-3xl overflow-hidden">
              <CardHeader className="bg-slate-50 border-b border-slate-100 pb-6">
                <CardTitle className="text-xl text-slate-900">Save Your Build</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6 pt-6">
                <div>
                  <label className="text-sm font-semibold mb-2 block text-slate-700">Name your masterpiece</label>
                  <Input
                    placeholder="e.g., The Orange Beast"
                    value={buildName}
                    onChange={(e) => setBuildName(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSaveConversation()}
                    autoFocus
                    className="h-12 bg-slate-50 border-slate-200"
                  />
                </div>
                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    className="flex-1 h-12 rounded-xl border-slate-200 hover:bg-slate-50 text-slate-600"
                    onClick={() => {
                      setShowSaveDialog(false);
                      setBuildName("");
                    }}
                  >
                    Cancel
                  </Button>
                  <Button
                    className="flex-1 h-12 rounded-xl bg-orange-500 hover:bg-orange-600 text-white shadow-lg shadow-orange-500/20"
                    onClick={handleSaveConversation}
                  >
                    Save Build
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
