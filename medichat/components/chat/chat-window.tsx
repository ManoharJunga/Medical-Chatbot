"use client"

import type React from "react"
import { useRef, useEffect } from "react"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { ChatMessage } from "@/components/chat/chat-message"
import { ChatInput } from "@/components/chat/chat-input"
import { QuickActions } from "@/components/chat/quick-actions"
import { MedicalDisclaimer } from "@/components/chat/medical-disclaimer"
import type { Message } from "@/types/chat"

interface ChatWindowProps {
  messages: Message[]
  input: string
  isLoading: boolean
  showDisclaimer: boolean
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void
  onQuickAction: (prompt: string) => void
  onDismissDisclaimer: () => void
}

export function ChatWindow({
  messages,
  input,
  isLoading,
  showDisclaimer,
  onInputChange,
  onSubmit,
  onQuickAction,
  onDismissDisclaimer,
}: ChatWindowProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  return (
    <Card className="border-0 shadow-lg flex-grow">
      <CardHeader className="border-b">
        <CardTitle className="text-xl">AI Medical Chatbot</CardTitle>
      </CardHeader>

      <CardContent className="p-0">
        {/* Medical Disclaimer */}
        {showDisclaimer && <MedicalDisclaimer onDismiss={onDismissDisclaimer} />}

        {/* Chat Messages */}
        <div className="p-4 h-[50vh] overflow-y-auto">
          {messages.length === 0 ? (
            <QuickActions onActionClick={onQuickAction} />
          ) : (
            <>
              {messages.map((message, index) => (
                <ChatMessage key={index} message={message} />
              ))}
              <div ref={messagesEndRef} />
            </>
          )}
        </div>
      </CardContent>

      <CardFooter className="border-t p-4">
        <ChatInput input={input} isLoading={isLoading} onInputChange={onInputChange} onSubmit={onSubmit} />
      </CardFooter>
    </Card>
  )
}

