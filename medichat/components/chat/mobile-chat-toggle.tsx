"use client"
import { Button } from "@/components/ui/button"
import { MessageSquare, PlusCircle } from "lucide-react"

interface MobileChatToggleProps {
  isMobileMenuOpen: boolean
  onToggle: () => void
  onNewChat: () => void
}

export function MobileChatToggle({ isMobileMenuOpen, onToggle, onNewChat }: MobileChatToggleProps) {
  return (
    <div className="md:hidden flex justify-between items-center mb-4">
      <Button variant="outline" className="flex items-center gap-2" onClick={onToggle}>
        <MessageSquare size={16} />
        {isMobileMenuOpen ? "Hide Chats" : "Show Chats"}
      </Button>

      <Button variant="outline" className="flex items-center gap-2" onClick={onNewChat}>
        <PlusCircle size={16} />
        New Chat
      </Button>
    </div>
  )
}

