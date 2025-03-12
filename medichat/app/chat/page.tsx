"use client"

import type React from "react"

import { useChat } from "@ai-sdk/react"
import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Send, Mic, PlusCircle, AlertCircle } from "lucide-react"

export default function Chat() {
  const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat()
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const [showDisclaimer, setShowDisclaimer] = useState(true)

  // Suggested quick actions
  const quickActions = [
    { label: "Check Symptoms", prompt: "I want to check my symptoms" },
    { label: "Get Diet Advice", prompt: "Can you give me diet advice for better health?" },
    { label: "Find a Doctor", prompt: "How do I find a specialist doctor?" },
    { label: "Mental Health", prompt: "I'm feeling anxious, what can I do?" },
  ]

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  // Handle quick action click
  const handleQuickAction = (prompt: string) => {
    const fakeEvent = {
      preventDefault: () => {},
    } as React.FormEvent<HTMLFormElement>

    // Set the input value and submit the form
    handleInputChange({ target: { value: prompt } } as React.ChangeEvent<HTMLInputElement>)
    setTimeout(() => handleSubmit(fakeEvent), 100)
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1 py-6 px-4 bg-gray-50">
        <div className="container mx-auto max-w-4xl">
          <Card className="border-0 shadow-lg">
            <CardHeader className="border-b">
              <CardTitle className="text-xl">AI Medical Chatbot</CardTitle>
            </CardHeader>

            <CardContent className="p-0">
              {/* Medical Disclaimer */}
              {showDisclaimer && (
                <div className="bg-amber-50 p-4 flex items-start space-x-3">
                  <AlertCircle className="h-5 w-5 text-amber-500 mt-0.5 flex-shrink-0" />
                  <div className="flex-1">
                    <p className="text-sm text-amber-800">
                      <strong>Medical Disclaimer:</strong> This AI chatbot provides general information only and is not
                      a substitute for professional medical advice, diagnosis, or treatment. Always seek the advice of
                      your physician or other qualified health provider with any questions you may have regarding a
                      medical condition.
                    </p>
                    <Button
                      variant="link"
                      size="sm"
                      className="p-0 h-auto text-amber-800"
                      onClick={() => setShowDisclaimer(false)}
                    >
                      Dismiss
                    </Button>
                  </div>
                </div>
              )}

              {/* Chat Messages */}
              <div className="p-4 h-[50vh] overflow-y-auto">
                {messages.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-center">
                    <div className="rounded-full bg-primary/10 p-4 mb-4">
                      <PlusCircle className="h-8 w-8 text-primary" />
                    </div>
                    <h3 className="text-xl font-medium mb-2">Start a new conversation</h3>
                    <p className="text-gray-500 mb-6 max-w-md">
                      Describe your symptoms or ask health-related questions to get started
                    </p>

                    {/* Quick Actions */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 w-full max-w-md">
                      {quickActions.map((action, index) => (
                        <Button
                          key={index}
                          variant="outline"
                          className="justify-start"
                          onClick={() => handleQuickAction(action.prompt)}
                        >
                          {action.label}
                        </Button>
                      ))}
                    </div>
                  </div>
                ) : (
                  <>
                    {messages.map((message, index) => (
                      <div
                        key={index}
                        className={`mb-4 flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
                      >
                        <div
                          className={`max-w-[80%] rounded-lg p-3 ${
                            message.role === "user" ? "bg-primary text-primary-foreground" : "bg-muted"
                          }`}
                        >
                          {message.content}
                        </div>
                      </div>
                    ))}
                    <div ref={messagesEndRef} />
                  </>
                )}
              </div>
            </CardContent>

            <CardFooter className="border-t p-4">
              <form onSubmit={handleSubmit} className="flex w-full space-x-2">
                <Input
                  value={input}
                  onChange={handleInputChange}
                  placeholder="Type your message..."
                  className="flex-grow"
                  disabled={isLoading}
                />
                <Button type="button" variant="outline" size="icon" disabled={isLoading}>
                  <Mic className="h-4 w-4" />
                  <span className="sr-only">Voice input</span>
                </Button>
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
  )
}

