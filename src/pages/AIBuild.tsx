import { useState } from "react";
import Navigation from "@/components/Navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Loader2, Send, Sparkles, Brain, Bot, Save } from "lucide-react";
import { toast } from "sonner";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
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

When you recommend a build, you MUST respond with a JSON object with the following structure:
{
  "cpu": { "name": "Part Name", "price": 123.45 },
  "motherboard": { "name": "Part Name", "price": 123.45 },
  "gpu": { "name": "Part Name", "price": 123.45 },
  "ram": { "name": "Part Name", "price": 123.45 },
  "storage": { "name": "Part Name", "price": 123.45 },
  "psu": { "name": "Part Name", "price": 123.45 },
  "case": { "name": "Part Name", "price": 123.45 },
  "totalCost": 1234.56,
  "explanation": "A brief explanation of why these parts were chosen."
}

Do not include any other text in your response.
`;
};



const AssistantMessage = ({ content }: { content: string }) => {
  try {
    const build = JSON.parse(content);
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
      <div>
        <p className="mb-4">{explanation}</p>
        <ul className="space-y-2">
          {components.map((component) => (
            component.value && (
              <li key={component.name} className="flex justify-between">
                <span><strong>{component.name}:</strong> {component.value.name}</span>
                <span>${component.value.price.toFixed(2)}</span>
              </li>
            )
          ))}
        </ul>
        <hr className="my-4" />
        <div className="flex justify-between font-bold text-lg">
          <span>Total Cost:</span>
          <span>${totalCost.toFixed(2)}</span>
        </div>
      </div>
    );
  } catch (error) {
    // If parsing fails, render as plain text with basic formatting
    return (
      <div className="space-y-2">
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
    );
  }
};

const AIBuild = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content:
        "Hello! I'm Trinity, your AI PC building assistant. 🚀\n\nI can help you build the perfect PC based on your budget, use case, and preferences. Just tell me what you need!\n\nWhat kind of PC are you looking to build?",
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [buildName, setBuildName] = useState('');

  // API Configuration State
  const [selectedApi, setSelectedApi] =
    useState<ApiProvider>('gemini');

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
          apis: selectedApi,
          systemPrompt: generateSystemPrompt(),
        }),
      });

      if (!response.ok) {
        throw new Error(`API Error: ${response.statusText} (Status: ${response.status})`);
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
                        {message.role === 'assistant' ? (
                              <AssistantMessage content={message.content} />
                            ) : (
                              <div>{message.content}</div>
                            )}
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

