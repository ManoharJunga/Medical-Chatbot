"use client";

import { useState, useRef, useEffect } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Send, AlertCircle } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";


export default function Chat() {
  const [messages, setMessages] = useState<{ role: "user" | "bot"; content: string }[]>([]);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const [showDisclaimer, setShowDisclaimer] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error("Error parsing user data:", error);
        localStorage.removeItem("user");
        setUser(null);
      }
    }
  }, []);

  useEffect(() => {
    if (!user) return;

    const fetchChatHistory = async () => {
      try {
        const response = await axios.get(`http://localhost:5001/api/chat/history/${user.id}`);
        
        const formattedMessages = response.data.map(msg => ([
          { role: "user", content: msg.userMessage },
          { role: "bot", content: msg.botResponse }
        ])).flat(); // Flatten to merge user and bot messages
    
        setMessages(formattedMessages);
      } catch (error) {
        console.error("Error fetching chat history:", error);
      }
    };
    

    fetchChatHistory();
  }, [user]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  };

  const handleManualSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!input.trim()) return;

    const storedUser = localStorage.getItem("user");
    const user = storedUser ? JSON.parse(storedUser) : null;
    const userId = user?._id || user?.id;

    if (!userId) {
      console.error("User ID is missing");
      setMessages((prev) => [...prev, { role: "bot", content: "Error: User not found. Please log in again." }]);
      return;
    }

    const userMessage = { role: "user", content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch("http://localhost:5001/api/chat/message", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, message: input }),
      });

      const data = await response.json();

      if (!response.ok) throw new Error(data.error || "Failed to get a response");

      setMessages((prev) => [...prev, { role: "bot", content: data.message || "I'm sorry, I didn't understand that." }]);
    } catch (error) {
      console.error("Error fetching bot response:", error);
      setMessages((prev) => [...prev, { role: "bot", content: "Sorry, something went wrong. Please try again." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1 py-6 px-4 bg-gray-50">
        <div className="container mx-auto max-w-4xl">
        
          <Card className="border-0 shadow-lg ">
            <CardHeader className="border-b">
              <CardTitle className="text-xl">AI Medical Chatbot</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              {showDisclaimer && (
                <div className="bg-amber-50 p-4 flex items-start space-x-3">
                  <AlertCircle className="h-5 w-5 text-amber-500 mt-0.5 flex-shrink-0" />
                  <div className="flex-1">
                    <p className="text-sm text-amber-800">
                      <strong>Medical Disclaimer:</strong> This AI chatbot provides general information only and is not a substitute for professional medical advice.
                    </p>
                    <Button variant="link" size="sm" className="p-0 h-auto text-amber-800" onClick={() => setShowDisclaimer(false)}>
                      Dismiss
                    </Button>
                  </div>
                </div>
              )}
              <div className="p-4 h-[50vh] overflow-y-auto">
                {messages.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-center">
                    <h3 className="text-xl font-medium mb-2">Start a new conversation</h3>
                    <p className="text-gray-500 mb-6 max-w-md">Describe your symptoms or ask health-related questions to get started.</p>
                  </div>
                ) : (
                  messages.map((message, index) => (
                    <div key={index} className={`mb-4 flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
                      <div className={`max-w-[80%] rounded-lg p-3 ${message.role === "user" ? "bg-blue-500 text-white" : "bg-gray-200 text-black"}`}>
                      <ReactMarkdown remarkPlugins={[remarkGfm]}>{message.content}</ReactMarkdown>
                      </div>
                    </div>
                  ))
                )}
                {isLoading && (
                  <div className="flex justify-start mb-4">
                    <div className="max-w-[80%] rounded-lg p-3 bg-gray-200 text-black animate-pulse">Typing...</div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
            </CardContent>
            <CardFooter className="border-t p-4">
              <form onSubmit={handleManualSubmit} className="flex w-full space-x-2">
                <Input value={input} onChange={handleInputChange} placeholder="Type your message..." className="flex-grow" disabled={isLoading} />
                <Button type="submit" size="icon" disabled={isLoading}>
                  <Send className="h-4 w-4" />
                  <span className="sr-only">Send message</span>
                </Button>
              </form>
            </CardFooter>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
}