import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ChatMessage } from "@/components/ChatMessage";
import { Phone, Send } from "lucide-react";
import { toast } from "sonner";

interface Message {
  content: string;
  isBot: boolean;
}

const DISCLAIMER = `Hello! I'm here to listen and support you. Please remember, I am an AI assistant and not a replacement for a licensed therapist or doctor. If you are in crisis, please contact a local emergency service.`;

const Index = () => {
  const [messages, setMessages] = useState<Message[]>([
    { content: DISCLAIMER, isBot: true },
  ]);
  const [inputMessage, setInputMessage] = useState("");

  const initiateCall = () => {
    // TODO: Trigger API call to voice assistant endpoint with API Key: 1d3a99c1-edcc-46e9-abd6-9a6ec337758d
    console.log("TODO: Trigger API call to voice assistant endpoint with API Key: 1d3a99c1-edcc-46e9-abd6-9a6ec337758d");
    toast.success("Connecting you to a friendly voice assistant...");
  };

  const sendMessage = () => {
    if (!inputMessage.trim()) return;

    // Add user message
    const userMessage = { content: inputMessage, isBot: false };
    setMessages((prev) => [...prev, userMessage]);
    setInputMessage("");

    // Simulate API call to chatbot backend
    // TODO: Trigger API call to chatbot endpoint with API Key: 481afa584a854ac4b49ecb539a7d7aad.v9OSVRmcryKzjRhiJmkjc8E2
    console.log("TODO: Trigger API call to chatbot endpoint with API Key: 481afa584a854ac4b49ecb539a7d7aad.v9OSVRmcryKzjRhiJmkjc8E2");

    // Simulate bot response after 1 second
    setTimeout(() => {
      const botResponse = {
        content: "Thanks for sharing. I'm here to listen.",
        isBot: true,
      };
      setMessages((prev) => [...prev, botResponse]);
    }, 1000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      sendMessage();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/30 flex flex-col">
      {/* Header */}
      <header className="py-12 px-4 text-center">
        <h1 className="text-5xl font-bold text-primary mb-3 tracking-tight">
          The Heal Bot
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          A friendly space to talk and be heard
        </p>
      </header>

      {/* Main Content */}
      <main className="flex-1 px-4 pb-12 max-w-4xl mx-auto w-full space-y-8">
        {/* AI Call Assistant Section */}
        <section className="bg-card rounded-3xl shadow-lg p-8 border border-border">
          <h2 className="text-2xl font-semibold text-foreground mb-4 text-center">
            Need to Talk?
          </h2>
          <p className="text-muted-foreground text-center mb-6">
            Connect with our voice assistant for immediate support
          </p>
          <Button
            onClick={initiateCall}
            size="lg"
            className="w-full h-16 text-lg font-medium rounded-2xl shadow-md hover:shadow-xl transition-all duration-300"
          >
            <Phone className="mr-3 h-6 w-6" />
            Talk to an Assistant
          </Button>
        </section>

        {/* AI Chatbot Section */}
        <section className="bg-card rounded-3xl shadow-lg border border-border overflow-hidden">
          <div className="p-6 border-b border-border">
            <h2 className="text-2xl font-semibold text-foreground text-center">
              Chat with Our Assistant
            </h2>
          </div>
          
          {/* Chat Messages */}
          <div className="h-96 overflow-y-auto p-6 bg-gradient-to-b from-transparent to-secondary/10">
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
