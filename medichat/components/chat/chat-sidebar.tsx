"use client"

import type React from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { MessageSquare, PlusCircle, Trash2 } from "lucide-react"
import type { ChatSession } from "@/types/chat"

interface ChatSidebarProps {
  chatSessions: ChatSession[]
  activeChatId: string
  onChatSelect: (chatId: string) => void
  onChatDelete: (chatId: string, e: React.MouseEvent) => void
  onNewChat: () => void
  isMobile?: boolean
}

export function ChatSidebar({
  chatSessions,
  activeChatId,
  onChatSelect,
  onChatDelete,
  onNewChat,
  isMobile = false,
}: ChatSidebarProps) {
  return (
    <Card className={`border shadow-sm ${isMobile ? "w-full mb-4" : "h-[calc(100vh-200px)] flex flex-col"}`}>
      <CardHeader className={`py-3 ${!isMobile && "flex-shrink-0"}`}>
        <CardTitle className="text-lg">Your Chats</CardTitle>
      </CardHeader>
      <CardContent className={`py-2 px-2 ${isMobile ? "max-h-[300px]" : "flex-grow"} overflow-y-auto`}>
        <div className="space-y-2">
          {chatSessions.map((chat) => (
            <div
              key={chat.id}
              className={`flex items-center justify-between p-2 rounded-md cursor-pointer ${
                chat.id === activeChatId ? "bg-primary/10 border border-primary/20" : "hover:bg-gray-100"
              }`}
              onClick={() => onChatSelect(chat.id)}
            >
              <div className="flex items-center gap-2 truncate">
                <MessageSquare size={16} className="flex-shrink-0" />
                <span className="truncate">{chat.title}</span>
              </div>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={(e) => onChatDelete(chat.id, e)}>
                <Trash2 size={16} className="text-gray-500 hover:text-red-500" />
              </Button>
            </div>
          ))}
        </div>
      </CardContent>
      <CardFooter className={`py-3 border-t ${!isMobile && "flex-shrink-0"}`}>
        <Button variant="outline" className="w-full flex items-center gap-2" onClick={onNewChat}>
          <PlusCircle size={16} />
          New Chat
        </Button>
      </CardFooter>
    </Card>
  )
}

