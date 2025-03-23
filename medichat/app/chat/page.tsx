"use client";

import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Trash, MessageSquare, PlusCircle, Send, Calendar } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Navbar } from "@/components/navbar";
import { useRouter } from "next/navigation";

import { getUserFromLocalStorage } from "./services/userService";
import { fetchChatWindows, createNewWindow } from "./services/chatWindowService";
import { fetchChatHistory, sendMessage } from "./services/chatService";

interface ChatMessage {
  role: "user" | "bot";
  content: string;
  doctors?: Doctor[];
}
interface Doctor {
  name: string;
  specialty: string;
  contact: string;
  location?: string;
};

interface ChatWindow {
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
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const lastMessageRef = useRef<HTMLDivElement>(null);
  const [isNewChat, setIsNewChat] = useState(false);
  const router = useRouter();



  useEffect(() => {
    const storedWindow = localStorage.getItem("activeWindow");
    if (storedWindow) {
      setActiveWindow(storedWindow); // Restore active window after refresh
    }
  }, []);


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
      fetchChatHistory(activeWindow).then(setMessages).catch(console.error);
    }
  }, [activeWindow]);

  const createChatWindow = async () => {
    if (!user || !user.id) {
      console.error("User ID is missing!");
      return;
    }

    const newWindow = await createNewWindow(user.id); // Pass userId as an argument

    if (!newWindow || !newWindow.windowId) {
      console.error("Invalid response from server:", newWindow);
      return;
    }

    const updatedWindows = [...windows, { windowId: newWindow.windowId, name: `Chat ${windows.length + 1}` }];

    setWindows(updatedWindows);
    setActiveWindow(newWindow.windowId);
    localStorage.setItem("activeWindow", newWindow.windowId);

    console.log("Created new window:", newWindow.windowId);
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
      console.log("User not found. Showing default bot response.");
      setMessages((prev) => [
        ...prev,
        {
          role: "bot",
          content: "Based on your symptoms, here are some recommended doctors:",
          doctors: [] // Empty array to prevent errors
        }
      ]);
      return;
    }

    const userMessage = { role: "user" as const, content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    console.log("User input:", input); // ✅ Log user input

    try {
      // Send user message to AI chat API
      console.log("Sending request to AI chat API...");
      const botMessage = await sendMessage(userId, windowId, input);
      console.log("Chat API Response:", botMessage); // ✅ Log AI chat response
      console.log("Window ID:", windowId);

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
        console.log("Doctor API Response:", doctorData); // ✅ Log doctor API response

        if (!doctorResponse.ok) {
          throw new Error(doctorData.error || "Failed to fetch doctors");
        }

        // Ensure doctors array exists in the response
        if (!doctorData.doctors || doctorData.doctors.length === 0) {
          console.warn("No doctors found in API response."); // ✅ Log empty response
        } else {
          console.log("Doctors fetched successfully:", doctorData.doctors); // ✅ Log doctor list
        }

        // Display bot message + doctor recommendations
        setMessages((prev) => [
          ...prev,
          {
            role: "bot",
            content: "Based on your symptoms, here are some recommended doctors:",
            doctors: doctorData.doctors || [] // Ensures it's always an array
          }
        ]);
      }
    } catch (error) {
      console.error("Error fetching doctors:", error);
      setMessages((prev) => [...prev, { role: "bot", content: "Sorry, something went wrong. Please try again." }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAppointment = (doctor: { _id: string }) => {
    router.push(`/bookappointment?doctorId=${doctor._id}`);
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


  const quickActions = [
    { label: "Check Symptoms", prompt: "I want to check my symptoms" },
    { label: "Get Diet Advice", prompt: "Can you give me diet advice for better health?" },
    { label: "Find a Doctor", prompt: "How do I find a specialist doctor?" },
    { label: "Mental Health", prompt: "I'm feeling anxious, what can I do?" },
  ];

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
              <Button
                variant="ghost"
                size="icon"
                className="hover:bg-gray-100"
                onClick={() => createChatWindow()} // Wrap in arrow function
              >
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
          {/* Quick Actions Section (Only appears when there are no messages) */}
          {messages.length === 0 && (
            <div className="flex flex-col items-center justify-center h-full text-center">
              {/* Header Section */}
              <div className="flex items-center gap-3">
                <div className="rounded-full bg-primary/10 p-3">
                  <PlusCircle className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-lg font-semibold">Start a new conversation</h3>
              </div>

              <p className="text-gray-500 text-sm text-center">
                Describe your symptoms or ask health-related questions to get started.
              </p>

              {/* Quick Actions Buttons */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 w-full max-w-md">
                {quickActions.map((action, index) => (
                  <Button
                    key={index}
                    className="w-full text-left px-4 py-2 bg-white text-black rounded-md hover:bg-gray-200 transition-all"
                    onClick={() => setInput(action.prompt)}
                  >
                    {action.label}
                  </Button>
                ))}
              </div>
            </div>
          )}

          {/* Chat Messages */}
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
                      {Array.isArray(message.doctors) && message.doctors.length > 0 ? (
                        <div className="mt-6 space-y-4">
                          {message.doctors.map((doctor) => (
                            <div
                              key={doctor._id}
                              className="flex items-center justify-between p-5 bg-white shadow-lg border border-gray-200 rounded-lg transition-transform hover:scale-[1.02]"
                            >
                              {/* Doctor Details */}
                              <div>
                                <p className="text-xl font-semibold text-gray-900">{doctor.name}</p>
                                <p className="text-gray-600 text-sm mt-1">
                                  <strong className="text-gray-800">Specialty:</strong> {doctor.specialty}
                                </p>
                                <p className="text-gray-600 text-sm mt-1">
                                  <strong className="text-gray-800">Contact:</strong> {doctor.contact || "N/A"}
                                </p>
                                <p className="text-gray-600 text-sm mt-1">
                                  <strong className="text-gray-800">Location:</strong> {doctor.location || "Unknown"}
                                </p>
                              </div>

                              {/* Appointment Button */}
                              <button
                                className="flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-blue-600 transition"
                                onClick={() => handleAppointment(doctor)} // ✅ Pass doctor object here
                                >
                                <Calendar size={20} />
                                <span className="hidden sm:inline">Book Appointment</span>
                              </button>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-gray-500 mt-4 text-center">No doctors found.</p>
                      )}

                    </div>
                  )}
                </div>
              </div>
            ))}
          </ScrollArea>

          <Separator />

          {/* Input Field */}
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