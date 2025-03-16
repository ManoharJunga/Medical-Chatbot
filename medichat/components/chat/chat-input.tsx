"use client"

import type React from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Send, Mic } from "lucide-react"

interface ChatInputProps {
  input: string
  isLoading: boolean
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void
}

export function ChatInput({ input, isLoading, onInputChange, onSubmit }: ChatInputProps) {
  return (
    <form onSubmit={onSubmit} className="flex w-full space-x-2">
      <Input
        value={input}
        onChange={onInputChange}
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
  )
}

