"use client"

import { useState } from "react"
import { Bell, Calendar, Check, Clock, Filter, MailOpen, MessageSquare, Search, Trash } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"

export default function NotificationsPage() {
  return (
    <div className="flex flex-col gap-5 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Notifications</h1>
          <p className="text-muted-foreground">Manage your alerts and messages</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="relative w-64">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input type="search" placeholder="Search notifications..." className="w-full pl-9" />
          </div>
          <Button variant="outline">
            <Filter className="mr-2 h-4 w-4" />
            Filter
          </Button>
          <Button variant="outline">
            <Check className="mr-2 h-4 w-4" />
            Mark All Read
          </Button>
        </div>
      </div>

      <Tabs defaultValue="all" className="space-y-4">
        <TabsList>
          <TabsTrigger value="all">
            <Bell className="mr-2 h-4 w-4" />
            All
            <Badge variant="outline" className="ml-2 bg-primary/10 text-xs">
              24
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="unread">
            <MailOpen className="mr-2 h-4 w-4" />
            Unread
            <Badge variant="outline" className="ml-2 bg-primary/10 text-xs">
              12
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="appointments">
            <Calendar className="mr-2 h-4 w-4" />
            Appointments
            <Badge variant="outline" className="ml-2 bg-primary/10 text-xs">
              8
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="messages">
            <MessageSquare className="mr-2 h-4 w-4" />
            Messages
            <Badge variant="outline" className="ml-2 bg-primary/10 text-xs">
              5
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="system">
            <Bell className="mr-2 h-4 w-4" />
            System
            <Badge variant="outline" className="ml-2 bg-primary/10 text-xs">
              3
            </Badge>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          <Card>
            <CardHeader className="px-6 py-4">
              <div className="flex items-center justify-between">
                <CardTitle>All Notifications</CardTitle>
                <div className="flex items-center gap-2">
                  <Select defaultValue="newest">
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Sort by" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="newest">Newest First</SelectItem>
                      <SelectItem value="oldest">Oldest First</SelectItem>
                      <SelectItem value="unread">Unread First</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y">
                {notifications.map((notification) => (
                  <NotificationItem key={notification.id} notification={notification} />
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="unread" className="space-y-4">
          <Card>
            <CardHeader className="px-6 py-4">
              <CardTitle>Unread Notifications</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y">
                {notifications
                  .filter((notification) => !notification.read)
                  .map((notification) => (
                    <NotificationItem key={notification.id} notification={notification} />
                  ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="appointments" className="space-y-4">
          <Card>
            <CardHeader className="px-6 py-4">
              <CardTitle>Appointment Notifications</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y">
                {notifications
                  .filter((notification) => notification.type === "appointment")
                  .map((notification) => (
                    <NotificationItem key={notification.id} notification={notification} />
                  ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="messages" className="space-y-4">
          <Card>
            <CardHeader className="px-6 py-4">
              <CardTitle>Message Notifications</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y">
                {notifications
                  .filter((notification) => notification.type === "message")
                  .map((notification) => (
                    <NotificationItem key={notification.id} notification={notification} />
                  ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="system" className="space-y-4">
          <Card>
            <CardHeader className="px-6 py-4">
              <CardTitle>System Notifications</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y">
                {notifications
                  .filter((notification) => notification.type === "system")
                  .map((notification) => (
                    <NotificationItem key={notification.id} notification={notification} />
                  ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

interface NotificationItemProps {
  notification: {
    id: number
    title: string
    message: string
    time: string
    type: "appointment" | "message" | "system"
    read: boolean
    priority?: "normal" | "high"
  }
}

function NotificationItem({ notification }: NotificationItemProps) {
  const [isRead, setIsRead] = useState(notification.read)

  const getIcon = (type: string) => {
    switch (type) {
      case "appointment":
        return <Calendar className="h-5 w-5 text-blue-500" />
      case "message":
        return <MessageSquare className="h-5 w-5 text-green-500" />
      case "system":
        return <Bell className="h-5 w-5 text-amber-500" />
      default:
        return <Bell className="h-5 w-5" />
    }
  }

  return (
    <div className={`flex items-start gap-4 p-4 ${!isRead ? "bg-primary/5" : ""}`}>
      <Checkbox className="mt-1" onCheckedChange={() => {}} />

      <div className="flex-shrink-0 mt-1">{getIcon(notification.type)}</div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <h4 className={`font-medium ${!isRead ? "text-primary" : ""}`}>{notification.title}</h4>
          {notification.priority === "high" && (
            <Badge variant="destructive" className="text-xs">
              High Priority
            </Badge>
          )}
        </div>
        <p className="text-sm text-muted-foreground mt-1">{notification.message}</p>
        <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
          <div className="flex items-center">
            <Clock className="mr-1 h-3 w-3" />
            {notification.time}
          </div>
          <div className="flex items-center">
            {notification.type === "appointment" && <Calendar className="mr-1 h-3 w-3" />}
            {notification.type === "message" && <MessageSquare className="mr-1 h-3 w-3" />}
            {notification.type === "system" && <Bell className="mr-1 h-3 w-3" />}
            {notification.type.charAt(0).toUpperCase() + notification.type.slice(1)}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-1">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsRead(!isRead)}
          title={isRead ? "Mark as unread" : "Mark as read"}
        >
          <MailOpen className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="icon" title="Delete">
          <Trash className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}

const notifications = [
  {
    id: 1,
    title: "New appointment request",
    message: "Jane Cooper has requested an appointment for tomorrow at 10:00 AM.",
    time: "5 minutes ago",
    type: "appointment",
    read: false,
    priority: "normal",
  },
  {
    id: 2,
    title: "Emergency consultation needed",
    message: "Thomas Harris is reporting severe chest pain and shortness of breath.",
    time: "10 minutes ago",
    type: "appointment",
    read: false,
    priority: "high",
  },
  {
    id: 3,
    title: "New message from patient",
    message: "Emily Johnson has sent you a message regarding her medication.",
    time: "30 minutes ago",
    type: "message",
    read: false,
    priority: "normal",
  },
  {
    id: 4,
    title: "Appointment reminder",
    message: "You have 5 appointments scheduled for today.",
    time: "1 hour ago",
    type: "appointment",
    read: true,
    priority: "normal",
  },
  {
    id: 5,
    title: "Lab results available",
    message: "New lab results are available for John Smith.",
    time: "2 hours ago",
    type: "system",
    read: false,
    priority: "normal",
  },
  {
    id: 6,
    title: "Prescription renewal request",
    message: "Michael Davis has requested a renewal for his hypertension medication.",
    time: "3 hours ago",
    type: "message",
    read: true,
    priority: "normal",
  },
  {
    id: 7,
    title: "System maintenance",
    message: "The system will be undergoing maintenance tonight from 2:00 AM to 4:00 AM.",
    time: "5 hours ago",
    type: "system",
    read: true,
    priority: "normal",
  },
  {
    id: 8,
    title: "New appointment request",
    message: "Sarah Wilson has requested an appointment for tomorrow at 2:15 PM.",
    time: "6 hours ago",
    type: "appointment",
    read: true,
    priority: "normal",
  },
  {
    id: 9,
    title: "Patient feedback received",
    message: "You've received new feedback from Robert Brown regarding his last visit.",
    time: "Yesterday",
    type: "message",
    read: true,
    priority: "normal",
  },
  {
    id: 10,
    title: "Insurance verification needed",
    message: "Please verify insurance information for David Martinez before his appointment.",
    time: "Yesterday",
    type: "system",
    read: true,
    priority: "normal",
  },
]

