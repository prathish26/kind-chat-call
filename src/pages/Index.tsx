import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ChatMessage } from "@/components/ChatMessage";
import { Phone, Send, Home, MessageCircle } from "lucide-react";
import { toast } from "sonner";

type Section = "home" | "call" | "chat";

interface Message {
  content: string;
  isBot: boolean;
}

const DISCLAIMER = `Hello! I'm here to listen and support you. Please remember, I am an AI assistant and not a replacement for a licensed therapist or doctor. If you are in crisis, please contact a local emergency service.`;

const Index = () => {
  const [currentSection, setCurrentSection] = useState<Section>("home");
  const [messages, setMessages] = useState<Message[]>([
    { content: DISCLAIMER, isBot: true },
  ]);
  const [inputMessage, setInputMessage] = useState("");

  const initiateCall = () => {
    /*
     * [CALL API INTEGRATION POINT]
     * Trigger API call to voice assistant endpoint.
     * API KEY: 1d3a99c1-edcc-46e9-abd6-9a6ec337758d
     * e.g., fetch('https://api.callservice.com/v1/initiate', {
     *   method: 'POST',
     *   headers: { 'Authorization': 'Bearer 1d3a99c1-edcc-46e9-abd6-9a6ec337758d' }
     * });
     */
    console.log("[CALL API] API Key: 1d3a99c1-edcc-46e9-abd6-9a6ec337758d");
    toast.success("Connecting you to a friendly voice assistant...");
  };

  const sendMessage = () => {
    if (!inputMessage.trim()) return;

    // Add user message
    const userMessage = { content: inputMessage, isBot: false };
    setMessages((prev) => [...prev, userMessage]);
    const userText = inputMessage;
    setInputMessage("");

    // Simulate API call to chatbot
    fetch('https://api.chatservice.com/v2/query', {
      method: 'POST',
      body: JSON.stringify({ message: userText }),
      headers: {
        'Content-Type': 'application/json',
        // API Key for this module.
        // In a real app, this would be 'Bearer 481afa584a854ac4b49ecb539a7d7aad.v9OSVRmcryKzjRhiJmkjc8E2'
        'X-API-Key': '481afa584a854ac4b49ecb539a7d7aad.v9OSVRmcryKzjRhiJmkjc8E2'
      }
    })
    .then(res => res.json())
    .then(() => {
      // In a real app, 'data.response' would be the AI's message
      // For now, we simulate the friendly response.
      displayBotMessage("Thanks for sharing. I'm here to listen.");
    })
    .catch(err => {
      console.error("API simulation error:", err);
      displayBotMessage("Sorry, I'm having a little trouble connecting right now.");
    });
  };

  const displayBotMessage = (message: string) => {
    const botResponse = { content: message, isBot: true };
    setMessages((prev) => [...prev, botResponse]);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      sendMessage();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/30 flex flex-col">
      {/* Navigation Bar */}
      <nav className="sticky top-0 z-50 bg-card border-b border-border shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-primary">The Heal Bot</h1>
          <div className="flex gap-6">
            <button
              onClick={() => setCurrentSection("home")}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                currentSection === "home"
                  ? "bg-primary text-primary-foreground"
                  : "text-foreground hover:bg-secondary"
              }`}
            >
              <Home className="h-5 w-5" />
              <span>Home</span>
            </button>
            <button
              onClick={() => setCurrentSection("call")}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                currentSection === "call"
                  ? "bg-primary text-primary-foreground"
                  : "text-foreground hover:bg-secondary"
              }`}
            >
              <Phone className="h-5 w-5" />
              <span>Talk (Voice)</span>
            </button>
            <button
              onClick={() => setCurrentSection("chat")}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                currentSection === "chat"
                  ? "bg-primary text-primary-foreground"
                  : "text-foreground hover:bg-secondary"
              }`}
            >
              <MessageCircle className="h-5 w-5" />
              <span>Chat (Text)</span>
            </button>
          </div>
        </div>
      </nav>

      {/* Home Section */}
      {currentSection === "home" && (
        <main className="flex-1 flex items-center justify-center px-4">
          <div className="text-center animate-fade-in">
            <h2 className="text-6xl font-bold text-primary mb-6 tracking-tight">
              Welcome to The Heal Bot
            </h2>
            <p className="text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              A friendly space to talk and be heard
            </p>
            <p className="text-lg text-muted-foreground mt-8 max-w-2xl mx-auto">
              Choose "Talk (Voice)" to speak with our voice assistant, or "Chat (Text)" 
              for a text-based conversation.
            </p>
          </div>
        </main>
      )}

      {/* Call Module Section */}
      {currentSection === "call" && (
        <main className="flex-1 flex items-center justify-center px-4">
          <div className="max-w-2xl w-full animate-fade-in">
            <section className="bg-card rounded-3xl shadow-lg p-12 border border-border text-center">
              <h2 className="text-3xl font-semibold text-foreground mb-6">
                Need to Talk?
              </h2>
              <p className="text-muted-foreground text-lg mb-8">
                Connect with our voice assistant for immediate support
              </p>
              <Button
                onClick={initiateCall}
                size="lg"
                className="w-full h-20 text-xl font-medium rounded-2xl shadow-md hover:shadow-xl transition-all duration-300"
              >
                <Phone className="mr-4 h-8 w-8" />
                Click to Talk to an Assistant
              </Button>
            </section>
          </div>
        </main>
      )}

      {/* Chat Module Section */}
      {currentSection === "chat" && (
        <main className="flex-1 px-4 py-8 max-w-4xl mx-auto w-full animate-fade-in">
          <section className="bg-card rounded-3xl shadow-lg border border-border overflow-hidden h-full max-h-[calc(100vh-200px)] flex flex-col">
            <div className="p-6 border-b border-border">
              <h2 className="text-2xl font-semibold text-foreground text-center">
                Chat with Our Assistant
              </h2>
            </div>
            
            {/* Chat Messages */}
            <div className="flex-1 overflow-y-auto p-6 bg-gradient-to-b from-transparent to-secondary/10">
              {messages.map((message, index) => (
                <ChatMessage
                  key={index}
                  content={message.content}
                  isBot={message.isBot}
                />
              ))}
            </div>

            {/* Chat Input */}
            <div className="p-6 border-t border-border bg-card">
              <div className="flex gap-3">
                <Input
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Type your message here..."
                  className="flex-1 h-12 rounded-xl border-2 focus:border-primary transition-colors"
                />
                <Button
                  onClick={sendMessage}
                  size="lg"
                  className="h-12 px-6 rounded-xl shadow-md hover:shadow-lg transition-all"
                >
                  <Send className="h-5 w-5" />
                </Button>
              </div>
            </div>
          </section>
        </main>
      )}

      {/* Footer with Disclaimer */}
      <footer className="py-8 px-4 text-center border-t border-border bg-card/50">
        <p className="text-sm text-muted-foreground max-w-3xl mx-auto leading-relaxed">
          <strong>Important:</strong> The Heal Bot is an AI assistant designed to provide supportive conversation 
          and general wellness guidance. It is not a substitute for professional medical advice, diagnosis, or treatment. 
          If you are experiencing a mental health crisis, please contact your local emergency services or a crisis hotline immediately.
        </p>
      </footer>
    </div>
  );
};

export default Index;
