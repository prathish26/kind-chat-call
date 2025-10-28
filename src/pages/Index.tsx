import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ChatMessage } from "@/components/ChatMessage";
import { Phone, MessageSquare, Home, Send, LogOut } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

type Section = "home" | "call" | "chat";

interface Message {
  content: string;
  isBot: boolean;
}

const Index = () => {
  const [currentSection, setCurrentSection] = useState<Section>("home");
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        setMessages([
          {
            content: "Hi! I'm The Heal Bot. I'm here to listen and support you. How can I help you today?",
            isBot: true,
          },
        ]);
      }
      setIsLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (session?.user && messages.length === 0) {
        setMessages([
          {
            content: "Hi! I'm The Heal Bot. I'm here to listen and support you. How can I help you today?",
            isBot: true,
          },
        ]);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (!isLoading && !user) {
      navigate("/auth");
    }
  }, [user, isLoading, navigate]);

  const navigateTo = (section: Section) => {
    setCurrentSection(section);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast.success("Logged out successfully");
    navigate("/auth");
  };

  const initiateCall = async () => {
    if (!phoneNumber.trim()) {
      toast.error("Please enter a phone number.");
      return;
    }

    const cleanNumber = phoneNumber.replace(/\D/g, "").replace(/^0+/, "");
    const formattedNumber = cleanNumber.startsWith("91") 
      ? `+${cleanNumber}` 
      : `+91${cleanNumber}`;

    const API_URL = "https://api.bland.ai/v1/calls";
    const CALL_API_KEY = "org_ac684c05de0014ad3fc7b9d71a46eb53719c180a1a5be79076c18b0eb16321d4b3bb6d13dbf5a1a1cf2169";
    const PATHWAY_ID = "08a0c2e2-9eb5-4811-b3cd-80e39dd77ca2";

    try {
      toast.info("Connecting your call...");
      
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${CALL_API_KEY}`,
        },
        body: JSON.stringify({
          phone_number: formattedNumber,
          pathway_id: PATHWAY_ID,
        }),
      });

      if (!response.ok) {
        throw new Error(`API call failed: ${response.statusText}`);
      }

      toast.success("Call is on its way!");
    } catch (error) {
      console.error("Error initiating call:", error);
      toast.error("Could not initiate the call. Please try again.");
    }
  };

  const sendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userText = inputMessage;
    const userMessage = { content: userText, isBot: false };
    setMessages((prev) => [...prev, userMessage]);
    setInputMessage("");

    const GEMINI_API_KEY = "AIzaSyABn39rmheS9gcIc61q8Xwf5dRA09-Q7vo";
    const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`;
    
    try {
      const conversationHistory = messages
        .map(msg => ({
          role: msg.isBot ? "model" : "user",
          parts: [{ text: msg.content }]
        }));
      
      conversationHistory.push({
        role: "user",
        parts: [{ text: userText }]
      });
      
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: conversationHistory,
          systemInstruction: {
            parts: [{
              text: "You are a friendly and empathetic mental health support assistant. Your role is to act as a supportive friend, offering a listening ear, providing encouragement, and suggesting general wellness techniques. You are not a medical professional and must never replace a doctor or therapist. Your primary goal is to make the user feel heard and supported. If a user discusses topics involving self-harm, severe crisis, or mentions a serious medical condition, you must immediately and gently guide them to seek professional help and provide a resource, such as the National Suicide Prevention Lifeline or a similar crisis hotline."
            }]
          }
        }),
      });

      if (!response.ok) {
        throw new Error(`Gemini API call failed: ${response.statusText}`);
      }

      const data = await response.json();
      const botText = data.candidates[0]?.content?.parts[0]?.text || "I'm here to listen.";
      
      const botResponse = {
        content: botText,
        isBot: true,
      };
      setMessages((prev) => [...prev, botResponse]);
    } catch (err) {
      console.error("Gemini API error:", err);
      const errorResponse = {
        content: "Sorry, I'm having a little trouble connecting right now.",
        isBot: true,
      };
      setMessages((prev) => [...prev, errorResponse]);
      toast.error("Failed to connect to the chatbot. Please try again.");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      sendMessage();
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 via-background to-secondary/5">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <div className="animate-pulse text-4xl font-bold text-primary mb-4">
            The Heal Bot
          </div>
          <div className="text-muted-foreground">Loading...</div>
        </motion.div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5">
      <nav className="bg-card/80 backdrop-blur-sm border-b border-border sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <motion.h1
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-2xl font-bold text-primary"
            >
              The Heal Bot
            </motion.h1>
            <div className="flex-1 flex justify-center space-x-2 sm:space-x-4">
              <Button
                variant={currentSection === "home" ? "default" : "ghost"}
                size="sm"
                onClick={() => navigateTo("home")}
                className="flex items-center gap-2"
              >
                <Home className="h-4 w-4" />
                <span className="hidden sm:inline">Home</span>
              </Button>
              <Button
                variant={currentSection === "call" ? "default" : "ghost"}
                size="sm"
                onClick={() => navigateTo("call")}
                className="flex items-center gap-2"
              >
                <Phone className="h-4 w-4" />
                <span className="hidden sm:inline">Call</span>
              </Button>
              <Button
                variant={currentSection === "chat" ? "default" : "ghost"}
                size="sm"
                onClick={() => navigateTo("chat")}
                className="flex items-center gap-2"
              >
                <MessageSquare className="h-4 w-4" />
                <span className="hidden sm:inline">Chat</span>
              </Button>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLogout}
              className="flex items-center gap-2"
            >
              <LogOut className="h-4 w-4" />
              <span className="hidden sm:inline">Logout</span>
            </Button>
          </div>
        </div>
      </nav>

      {currentSection === "home" && (
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex-1 flex flex-col items-center justify-center px-4 py-20"
        >
          <div className="text-center max-w-3xl">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-5xl sm:text-6xl font-bold text-foreground mb-6"
            >
              Welcome to The Heal Bot
            </motion.h2>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-xl sm:text-2xl text-muted-foreground"
            >
              A friendly space to talk and be heard
            </motion.p>
          </div>
        </motion.section>
      )}

      {currentSection === "call" && (
        <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex-1 flex items-center justify-center px-4 py-20"
        >
          <div className="bg-card rounded-3xl shadow-lg p-8 sm:p-12 border border-border max-w-2xl w-full">
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
                  onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, ""))}
                  placeholder="9xxxx09879"
                  className="h-14 text-lg"
                />
              </div>
              <Button
                onClick={initiateCall}
                size="lg"
                className="w-full h-16 text-lg font-medium"
              >
                <Phone className="mr-3 h-6 w-6" />
                Click to Talk to an Assistant
              </Button>
            </div>
          </div>
        </motion.section>
      )}

      {currentSection === "chat" && (
        <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex-1 flex items-center justify-center px-4 py-8"
        >
          <div className="bg-card rounded-3xl shadow-lg border border-border overflow-hidden max-w-4xl w-full h-[calc(100vh-12rem)]">
            <div className="p-6 border-b border-border">
              <h2 className="text-2xl font-semibold text-foreground text-center">
                Chat with Our Assistant
              </h2>
            </div>

            <div className="h-[calc(100%-160px)] overflow-y-auto p-6">
              {messages.map((message, index) => (
                <ChatMessage
                  key={index}
                  content={message.content}
                  isBot={message.isBot}
                />
              ))}
            </div>

            <div className="p-6 border-t border-border bg-card">
              <div className="flex gap-3">
                <Input
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Type your message here..."
                  className="flex-1 h-12"
                />
                <Button
                  onClick={sendMessage}
                  size="lg"
                  className="h-12 px-6"
                >
                  <Send className="h-5 w-5" />
                </Button>
              </div>
            </div>
          </div>
        </motion.section>
      )}

      <footer className="py-8 px-4 text-center border-t border-border bg-card/50">
        <p className="text-sm text-muted-foreground max-w-3xl mx-auto leading-relaxed">
          <strong>Important:</strong> The Heal Bot is an AI assistant designed to
          provide supportive conversation and general wellness guidance. It is not a
          substitute for professional medical advice, diagnosis, or treatment. If you
          are experiencing a mental health crisis, please contact your local emergency
          services or a crisis hotline immediately.
        </p>
        <p className="text-xs text-muted-foreground mt-4">
          © {new Date().getFullYear()} All rights reserved by Prathish Raj
        </p>
      </footer>
    </div>
  );
};

export default Index;
