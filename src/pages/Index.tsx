import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ChatMessage } from "@/components/ChatMessage";
import { Phone, Send, Home as HomeIcon } from "lucide-react";
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
  const [phoneNumber, setPhoneNumber] = useState("");

  // Navigation function
  const navigateTo = (section: Section) => {
    setCurrentSection(section);
  };

  // Call Module Logic (Bland.ai Implementation)
  const initiateCall = async () => {
    if (!phoneNumber.trim()) {
      toast.error("Please enter a phone number.");
      return;
    }

    // [CALL API INTEGRATION POINT]
    // This is the JavaScript implementation using bland.ai API
    const API_URL = "https://api.bland.ai/v1/calls";
    const CALL_API_KEY = "1d3a99c1-edcc-46e9-abd6-9a6ec337758d";
    const PATHWAY_ID = "08a0c2e2-9eb5-4811-b3cd-80e39dd77ca2";

    const headers = {
      "Content-Type": "application/json",
      authorization: CALL_API_KEY,
    };

    const body = JSON.stringify({
      phone_number: phoneNumber,
      pathway_id: PATHWAY_ID,
    });

    try {
      toast.info("Connecting your call...");
      console.log("[CALL API] API Key:", CALL_API_KEY);
      
      const response = await fetch(API_URL, {
        method: "POST",
        headers: headers,
        body: body,
      });

      if (!response.ok) {
        throw new Error(`API call failed: ${response.statusText}`);
      }

      const result = await response.json();
      console.log("Call initiated successfully:", result);
      toast.success("Call is on its way!");
    } catch (error) {
      console.error("Error initiating call:", error);
      toast.error("Could not initiate the call. Please check the console for details.");
    }
  };

  // Chat Module Logic (API Integration)
  const sendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userText = inputMessage;
    const userMessage = { content: userText, isBot: false };
    setMessages((prev) => [...prev, userMessage]);
    setInputMessage("");

    // Simulate API call to chatbot with proper fetch implementation
    try {
      // This is a simulation - in production, this would be a real endpoint
      // fetch('https://api.chatservice.com/v2/query', {
      //   method: 'POST',
      //   body: JSON.stringify({ message: userText }),
      //   headers: {
      //     'Content-Type': 'application/json',
      //     'X-API-Key': '481afa584a854ac4b49ecb539a7d7aad.v9OSVRmcryKzjRhiJmkjc8E2'
      //   }
      // })
      
      console.log("[CHAT API] Simulating API call with key: 481afa584a854ac4b49ecb539a7d7aad.v9OSVRmcryKzjRhiJmkjc8E2");
      
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      const botResponse = {
        content: "Thanks for sharing. I'm here to listen.",
        isBot: true,
      };
      setMessages((prev) => [...prev, botResponse]);
    } catch (err) {
      console.error("API simulation error:", err);
      const errorResponse = {
        content: "Sorry, I'm having a little trouble connecting right now.",
        isBot: true,
      };
      setMessages((prev) => [...prev, errorResponse]);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      sendMessage();
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Navigation Bar */}
      <nav className="sticky top-0 z-50 bg-card/95 backdrop-blur-sm border-b border-border shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-primary">The Heal Bot</h1>
          <div className="flex gap-2">
            <Button
              variant={currentSection === "home" ? "default" : "ghost"}
              onClick={() => navigateTo("home")}
              className="gap-2"
            >
              <HomeIcon className="h-4 w-4" />
              Home
            </Button>
            <Button
              variant={currentSection === "call" ? "default" : "ghost"}
              onClick={() => navigateTo("call")}
              className="gap-2"
            >
              <Phone className="h-4 w-4" />
              Talk (Voice)
            </Button>
            <Button
              variant={currentSection === "chat" ? "default" : "ghost"}
              onClick={() => navigateTo("chat")}
              className="gap-2"
            >
              <Send className="h-4 w-4" />
              Chat (Text)
            </Button>
          </div>
        </div>
      </nav>

      {/* Module 1: Home Section (Live and Unique Animation) */}
      {currentSection === "home" && (
        <section
          id="home"
          className="flex-1 gradient-bg flex flex-col items-center justify-center px-4 py-20"
        >
          <div className="text-center max-w-3xl">
            <h2 className="text-6xl font-bold text-foreground mb-6 typing-text">
              Welcome to The Heal Bot
            </h2>
            <p className="text-2xl text-muted-foreground fade-in-delay">
              A friendly space to talk and be heard
            </p>
          </div>
        </section>
      )}

      {/* Module 2: AI Call Module (Bland.ai Implementation) */}
      {currentSection === "call" && (
        <section
          id="call-module"
          className="flex-1 bg-gradient-to-b from-background to-secondary/30 flex items-center justify-center px-4 py-20"
        >
          <div className="bg-card rounded-3xl shadow-lg p-12 border border-border max-w-2xl w-full">
            <h2 className="text-3xl font-semibold text-foreground mb-6 text-center">
              Need to Talk?
            </h2>
            <p className="text-muted-foreground text-center mb-8">
              Connect with our voice assistant for immediate support
            </p>
            <div className="space-y-6">
              <div>
                <label
                  htmlFor="phone-input"
                  className="block text-lg font-medium text-foreground mb-3"
                >
                  Enter your phone number:
                </label>
                <Input
                  id="phone-input"
                  type="tel"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder="+1 (555) 123-4567"
                  className="h-14 text-lg rounded-xl border-2 focus:border-primary transition-colors"
                />
              </div>
              <Button
                onClick={initiateCall}
                size="lg"
                className="w-full h-16 text-lg font-medium rounded-2xl shadow-md hover:shadow-xl transition-all duration-300"
              >
                <Phone className="mr-3 h-6 w-6" />
                Click to Talk to an Assistant
              </Button>
            </div>
          </div>
        </section>
      )}

      {/* Module 3: AI Chat Module */}
      {currentSection === "chat" && (
        <section
          id="chat-module"
          className="flex-1 bg-gradient-to-b from-background to-secondary/30 flex items-center justify-center px-4 py-8"
        >
          <div className="bg-card rounded-3xl shadow-lg border border-border overflow-hidden max-w-4xl w-full h-[calc(100vh-12rem)]">
            <div className="p-6 border-b border-border">
              <h2 className="text-2xl font-semibold text-foreground text-center">
                Chat with Our Assistant
              </h2>
            </div>

            {/* Chat Messages */}
            <div className="h-[calc(100%-160px)] overflow-y-auto p-6 bg-gradient-to-b from-transparent to-secondary/10">
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
          </div>
        </section>
      )}

      {/* Footer with Disclaimer */}
      <footer className="py-8 px-4 text-center border-t border-border bg-card/50">
        <p className="text-sm text-muted-foreground max-w-3xl mx-auto leading-relaxed">
          <strong>Important:</strong> The Heal Bot is an AI assistant designed to
          provide supportive conversation and general wellness guidance. It is not a
          substitute for professional medical advice, diagnosis, or treatment. If you
          are experiencing a mental health crisis, please contact your local emergency
          services or a crisis hotline immediately.
        </p>
      </footer>
    </div>
  );
};

export default Index;
