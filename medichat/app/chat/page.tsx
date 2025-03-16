"use client";

import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { MessageSquare, PlusCircle, Send, AlertCircle } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Navbar } from "@/components/navbar";


interface ChatMessage {
  role: "user" | "bot";
  content: string;
}

interface ChatWindow {
  id: string;
  name: string;
}

export default function ChatPage() {
  const [user, setUser] = useState<{ userId: string } | null>(null);
  const [windows, setWindows] = useState<ChatWindow[]>([]);
  const [activeWindow, setActiveWindow] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showDisclaimer, setShowDisclaimer] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const lastMessageRef = useRef<HTMLDivElement>(null);



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
    if (lastMessageRef.current) {
      lastMessageRef.current.scrollIntoView({ behavior: "smooth", block: "end" });
    }
  }, [messages]); // Runs whenever messages change

  useEffect(() => {
    if (user?.id) {
      fetchChatWindows(user.id);
    }
  }, [user?.id]);


  useEffect(() => {
    if (activeWindow) fetchChatHistory(activeWindow);

  }, [activeWindow]);


  const fetchChatHistory = async (windowId: string) => {
    try {
      console.log("Fetching chat history for windowId:", windowId);

      // Clear previous messages before fetching new ones
      setMessages([]);

      const response = await axios.get(`http://localhost:5001/api/chat/history/${windowId}`);

      if (Array.isArray(response.data)) {
        const formattedMessages = response.data.flatMap((message) => [
          { role: "user", content: message.userMessage },
          { role: "bot", content: message.botResponse }
        ]);

        setMessages(formattedMessages);
      }
    } catch (error) {
      console.error("Error fetching chat history:", error);
    }
  };


  const fetchChatWindows = async (userId) => {
    try {
      const response = await axios.get(`http://localhost:5001/api/chat-windows/user/${userId}/windows`);
      setWindows(response.data); // Store chat windows in state
    } catch (error) {
      console.error("Error fetching chat windows:", error);
    }
  };


  const createNewWindow = async () => {
    if (!user || !user.id) {
      console.error("User ID is missing!");
      return;
    }

    try {
      const response = await axios.post("http://localhost:5001/api/chat-windows/new", { userId: user.id });

      const newWindow = response.data;
      setWindows([...windows, { id: newWindow.windowId, name: `Chat ${windows.length + 1}` }]);
      setActiveWindow(newWindow.windowId);
    } catch (error) {
      console.error("Error creating chat window:", error);
    }
  };

  const handleWindowSwitch = (windowId: string) => {
    setActiveWindow(windowId);
    localStorage.setItem("activeWindow", windowId); // Store window ID locally
    fetchChatHistory(windowId);
    console.log("new added console", windowId)
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  };

  const handleManualSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userId = user?.id || user?._id;
    const windowId = localStorage.getItem("activeWindow") || window.location.pathname; // Retrieve saved window ID

    console.log("Submitting message...");
    console.log("User ID:", userId);
    console.log("Window ID:", windowId);
    console.log("Input message:", input);

    if (!userId) {
      console.error("User ID is missing");
      setMessages((prev) => [
        ...prev,
        { role: "bot", content: "Error: User not found. Please log in again." },
      ]);
      return;
    }

    const userMessage = { role: "user", content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      console.log("Sending request to API...");
      const response = await fetch("http://localhost:5001/api/chat/message", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, windowId, message: input }), // Sending windowId
      });

      console.log("Response status:", response.status);

      const data = await response.json();
      console.log("Response data:", data);

      if (!response.ok) throw new Error(data.error || "Failed to get a response");

      setMessages((prev) => [
        ...prev,
        { role: "bot", content: data.message || "I'm sorry, I didn't understand that." },
      ]);

    } catch (error) {
      console.error("Error fetching bot response:", error);
      setMessages((prev) => [
        ...prev,
        { role: "bot", content: "Sorry, something went wrong. Please try again." },
      ]);
    } finally {
      console.log("Request completed.");
      setIsLoading(false);
    }
  };





  return (
    <div className="flex flex-col h-screen">
      {/* Navbar at the top */}
      <Navbar />

      {/* Main Chat Layout */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar for Chats */}
        <Card className="w-1/4 bg-white text-black flex flex-col shadow-md rounded-lg border">
          {/* Header Section */}
          <CardHeader className="py-4 px-4 border-b border-gray-300 flex justify-between items-center bg-white">
            <div className="flex items-center gap-2">
              <span className="text-lg font-semibold">Your Chats</span>
              <Button variant="ghost" size="icon" className="hover:bg-gray-100" onClick={createNewWindow}>
                <PlusCircle size={18} className="text-black" />
              </Button>
            </div>
          </CardHeader>

          {/* Chat List */}
          <ScrollArea className="flex-grow p-2 overflow-y-auto">
            {windows.length > 0 ? (
              <div className="flex flex-col gap-2">
                {windows.map((window) => (
                  <div
                    key={window.windowId}
                    className={`w-[340px] flex items-center gap-2 px-3 py-2 rounded-md cursor-pointer transition-all duration-200 ${activeWindow === window.windowId
                      ? "bg-blue-100 border border-blue-300"
                      : "hover:bg-gray-100"
                      }`}
                    onClick={() => handleWindowSwitch(window.windowId)}
                  >
                    <MessageSquare size={16} className="text-gray-600" />
                    <span className="truncate text-sm font-medium">{window.name || `Chat ${window.windowId}`}</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center text-gray-500 text-sm py-10">
                <MessageSquare size={24} className="mb-2 text-gray-400" />
                <p>No chats yet</p>
              </div>
            )}
          </ScrollArea>
        </Card>



        {/* Chat Area */}
        <div className="flex-1 flex flex-col bg-gray-100 p-4">
          <ScrollArea className="flex-1 overflow-y-auto" ref={scrollRef}>
            {messages.map((message, index) => (
              <div
                key={index}
                ref={index === messages.length - 1 ? lastMessageRef : null} // Attach ref to the last message
                className={`mb-4 flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[80%] p-3 rounded-lg ${message.role === "user" ? "bg-blue-500 text-white" : "bg-gray-200 text-black"
                    }`}
                >
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>{message.content}</ReactMarkdown>
                </div>
              </div>
            ))}
          </ScrollArea>
          <Separator />
          <form onSubmit={handleManualSubmit} className="flex w-full space-x-2 p-2">
            <Input value={input} onChange={handleInputChange} placeholder="Type your message..." disabled={isLoading} />
            <Button type="submit" size="icon" disabled={isLoading}>
              <Send className="h-4 w-4" />
            </Button>
          </form>
        </div>
      </div>
    </div>

  );
}