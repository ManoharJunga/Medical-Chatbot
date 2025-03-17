"use client";

import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Trash, MessageSquare, PlusCircle, Send, AlertCircle } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Navbar } from "@/components/navbar";

import { getUserFromLocalStorage } from "./services/userService";
import { fetchChatWindows, createNewWindow, deleteChatWindow } from "./services/chatWindowService";
import { fetchChatHistory, sendMessage } from "./services/chatService";



interface ChatMessage {
  role: "user" | "bot";
  content: string;
}

interface ChatWindow {
  id: string;
  name: string;
  windowId: string;
}

export default function ChatPage() {
  const [user, setUser] = useState<{ id: string } | null>(null);
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
    setUser(getUserFromLocalStorage());
  }, []);

  useEffect(() => {
    if (lastMessageRef.current) {
      lastMessageRef.current.scrollIntoView({ behavior: "smooth", block: "end" });
    }
  }, [messages]); // Runs whenever messages change

  useEffect(() => {
    if (user?.id) {
      fetchChatWindows(user.id).then(setWindows);
    }
  }, [user?.id]);


  useEffect(() => {
    if (activeWindow) {
      fetchChatHistory(activeWindow).then(setMessages);
    }
  }, [activeWindow]);


  const createNewWindow = async () => {
    if (!user || !user.id) {
      console.error("User ID is missing!");
      return;
    }
  
    try {
      const response = await axios.post("http://localhost:5001/api/chat-windows/new", { userId: user.id });
  
      const newWindow = response.data;
  
      // Ensure the window is stored with `windowId`
      const updatedWindows = [...windows, { windowId: newWindow.windowId, name: `Chat ${windows.length + 1}` }];
  
      setWindows(updatedWindows);
      setActiveWindow(newWindow.windowId);
      localStorage.setItem("activeWindow", newWindow.windowId); // Ensure storage update
  
      console.log("Created new window:", newWindow.windowId);
    } catch (error) {
      console.error("Error creating chat window:", error);
    }
  };
  

  const deleteChatWindow = async (windowId: string) => {
    try {
      await axios.delete(`http://localhost:5001/api/chat-windows/window/${windowId}`);
      setWindows((prev) => prev.filter((win) => win.windowId !== windowId)); // Remove deleted window from state
    } catch (error) {
      console.error("Error deleting chat window:", error);
    }
  };

  const handleWindowSwitch = (windowId: string) => {
    setActiveWindow(windowId);
    localStorage.setItem("activeWindow", windowId); // Persist active window
    fetchChatHistory(windowId);
    console.log("Switched to window:", windowId);
  };  

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  };

  const handleManualSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!input.trim()) return;
  
    const userId = user?.id;
    const windowId = localStorage.getItem("activeWindow") || window.location.pathname;
  
    if (!userId) {
      setMessages((prev) => [...prev, { role: "bot", content: "Error: User not found. Please log in again." }]);
      return;
    }
  
    const userMessage = { role: "user" as const, content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);
  
    console.log("User input:", input); // ✅ Log user input
  
    try {
      // Send user message to AI chat API
      const botMessage = await sendMessage(userId, windowId, input);
      console.log("Chat API Response:", botMessage); // ✅ Log API response
      console.log("Sending message to windowId:", windowId);

  
      setMessages((prev) => [...prev, { role: "bot", content: botMessage }]);
  
      // Extract symptoms from bot response
      const extractedSymptoms = extractSymptoms(botMessage);
      console.log("Extracted Symptoms:", extractedSymptoms); // ✅ Log extracted symptoms
  
      if (extractedSymptoms.length > 0) {
        console.log("Fetching doctors for symptoms:", extractedSymptoms); // ✅ Log doctor search request
  
        // Fetch doctor recommendations
        const doctorResponse = await fetch("http://localhost:5001/api/doctors/find", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ symptoms: extractedSymptoms }),
        });
  
        const doctorData = await doctorResponse.json();
        console.log("Doctor API Response:", doctorData); // ✅ Log doctor response
  
        if (!doctorResponse.ok) throw new Error(doctorData.error || "Failed to fetch doctors");
  
        // Display bot message + doctor recommendations
        setMessages((prev) => [
          ...prev,
          { role: "bot", content: `Based on your symptoms, here are some recommended doctors:`, doctors: doctorData }
        ]);
      }
  
    } catch (error) {
      console.error("Error:", error);
      setMessages((prev) => [...prev, { role: "bot", content: "Sorry, something went wrong. Please try again." }]);
    } finally {
      setIsLoading(false);
    }
  };
  

  const extractSymptoms = (message: string) => {
    const symptomList = [
      "migraine", "seizures", "dizziness", "fever", "cough", "pain", "fatigue", "anxiety",
      "headache", "nausea", "vomiting", "shortness of breath", "chest pain", "sore throat",
      "runny nose", "stuffy nose", "sneezing", "muscle pain", "joint pain", "back pain",
      "abdominal pain", "diarrhea", "constipation", "bloating", "indigestion", "loss of appetite",
      "weight loss", "weight gain", "insomnia", "night sweats", "chills", "skin rash",
      "itching", "swelling", "redness", "burning sensation", "blurred vision", "double vision",
      "sensitivity to light", "ringing in ears", "hearing loss", "difficulty swallowing",
      "hoarseness", "palpitations", "high blood pressure", "low blood pressure", "weakness",
      "numbness", "tingling", "loss of balance", "confusion", "memory loss", "depression",
      "irritability", "mood swings", "hallucinations", "tremors", "cold hands and feet",
      "excessive thirst", "frequent urination", "dry mouth", "chest tightness", "breathlessness",
      "bruising easily", "excessive sweating", "hair loss", "hot flashes", "yellowing of skin",
      "blood in stool", "blood in urine", "fainting", "severe cramps", "difficulty concentrating",
      "acid reflux", "heartburn", "restlessness", "kidney pain"
    ];

    return symptomList.filter(symptom => message.toLowerCase().includes(symptom));
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
                    className={`w-[340px] flex items-center justify-between px-3 py-2 rounded-md cursor-pointer transition-all duration-200 ${activeWindow === window.windowId ? "bg-blue-100 border border-blue-300" : "hover:bg-gray-100"
                      }`}
                    onClick={() => handleWindowSwitch(window.windowId)}
                  >
                    <div className="flex items-center gap-2">
                      <MessageSquare size={16} className="text-gray-600" />
                      <span className="truncate text-sm font-medium">{window.name || "New Chat"}</span> 
                      </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="hover:bg-red-100"
                      onClick={(e) => {
                        e.stopPropagation(); // Prevent chat window from switching when deleting
                        deleteChatWindow(window.windowId);
                      }}
                    >
                      <Trash size={16} className="text-red-500" />
                    </Button>
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
                ref={index === messages.length - 1 ? lastMessageRef : null}
                className={`mb-4 flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[80%] p-3 rounded-lg ${message.role === "user" ? "bg-blue-500 text-white" : "bg-gray-200 text-black"
                    }`}
                >
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>{message.content}</ReactMarkdown>

                  {/* Display doctor recommendations */}
                  {message.doctors && (
                    <div className="mt-2 p-2 bg-white border border-gray-300 rounded-lg">
                      <h3 className="font-semibold text-black mb-1">Recommended Doctors:</h3>
                      {message.doctors.map((doctor, i) => (
                        <div key={i} className="mb-2 p-2 border rounded-lg shadow-sm bg-gray-100">
                          <p><strong>Name:</strong> {doctor.name}</p>
                          <p><strong>Specialty:</strong> {doctor.specialty}</p>
                          <p><strong>Contact:</strong> {doctor.contact}</p>
                        </div>
                      ))}
                    </div>
                  )}
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