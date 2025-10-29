"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import {
  Bell,
  Calendar,
  Check,
  Clock,
  Filter,
  MailOpen,
  MessageSquare,
  Search,
  Trash,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/components/ui/use-toast"; 

export default function NotificationsPage() {
  const { toast } = useToast(); // ✅ Initialize toast
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const doctorId = "68c235ce14ca10cc6264565b"; // 🔄 Replace later with logged-in doctor ID

  // 🟢 Fetch notifications
  const fetchNotifications = async () => {
    try {
      const res = await axios.get(
        `http://localhost:5001/api/notifications/user/${doctorId}`
      );
      setNotifications(res.data.data || []);
    } catch (error) {
      console.error("Error fetching notifications:", error);
      toast({
        title: "Fetch Failed",
        description: "Unable to load notifications.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  // ✅ Mark all as read
  const handleMarkAllRead = async () => {
    try {
      await axios.put(
        `http://localhost:5001/api/notifications/mark-all/${doctorId}`
      );
      setNotifications(notifications.map((n) => ({ ...n, read: true })));
      toast({ title: "Success", description: "All notifications marked as read!" });
    } catch {
      toast({
        title: "Failed",
        description: "Could not mark all as read.",
        variant: "destructive",
      });
    }
  };

  const filteredNotifications = notifications.filter((n) =>
    n.title?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const counts = {
    unread: notifications.filter((n) => !n.read).length,
    appointment: notifications.filter((n) => n.type === "appointment").length,
    message: notifications.filter((n) => n.type === "message").length,
    system: notifications.filter((n) => n.type === "system").length,
  };

  if (loading)
    return (
      <div className="flex items-center justify-center h-screen text-gray-500">
        Loading notifications...
      </div>
    );

  return (
    <div className="flex flex-col gap-5 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Notifications</h1>
          <p className="text-muted-foreground">
            Manage your alerts and messages
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="relative w-64">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search..."
              className="w-full pl-9"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button variant="outline">
            <Filter className="mr-2 h-4 w-4" /> Filter
          </Button>
          <Button variant="outline" onClick={handleMarkAllRead}>
            <Check className="mr-2 h-4 w-4" /> Mark All Read
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="all" className="space-y-4">
        <TabsList>
          {[
            { value: "all", icon: Bell, label: "All", count: notifications.length },
            { value: "unread", icon: MailOpen, label: "Unread", count: counts.unread },
            {
              value: "appointments",
              icon: Calendar,
              label: "Appointments",
              count: counts.appointment,
            },
            {
              value: "messages",
              icon: MessageSquare,
              label: "Messages",
              count: counts.message,
            },
            { value: "system", icon: Bell, label: "System", count: counts.system },
          ].map((tab) => (
            <TabsTrigger key={tab.value} value={tab.value}>
              <tab.icon className="mr-2 h-4 w-4" /> {tab.label}
              <Badge variant="outline" className="ml-2 bg-primary/10 text-xs">
                {tab.count}
              </Badge>
            </TabsTrigger>
          ))}
        </TabsList>

        {/* Tab contents */}
        <TabsContent value="all">
          <NotificationCard
            notifications={filteredNotifications}
            refresh={fetchNotifications}
          />
        </TabsContent>
        <TabsContent value="unread">
          <NotificationCard
            notifications={filteredNotifications.filter((n) => !n.read)}
            refresh={fetchNotifications}
          />
        </TabsContent>
        <TabsContent value="appointments">
          <NotificationCard
            notifications={filteredNotifications.filter(
              (n) => n.type === "appointment"
            )}
            refresh={fetchNotifications}
          />
        </TabsContent>
        <TabsContent value="messages">
          <NotificationCard
            notifications={filteredNotifications.filter(
              (n) => n.type === "message"
            )}
            refresh={fetchNotifications}
          />
        </TabsContent>
        <TabsContent value="system">
          <NotificationCard
            notifications={filteredNotifications.filter(
              (n) => n.type === "system"
            )}
            refresh={fetchNotifications}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}

function NotificationCard({
  notifications,
  refresh,
}: {
  notifications: any[];
  refresh: () => void;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Notifications</CardTitle>
      </CardHeader>
      <CardContent>
        {notifications.length === 0 ? (
          <p className="text-center text-sm text-muted-foreground">
            No notifications found
          </p>
        ) : (
          <div className="divide-y">
            {notifications.map((n) => (
              <NotificationItem key={n._id} notification={n} refresh={refresh} />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function NotificationItem({
  notification,
  refresh,
}: {
  notification: any;
  refresh: () => void;
}) {
  const [isRead, setIsRead] = useState(notification.read);
  const { toast } = useToast();

  const toggleRead = async () => {
    try {
      await axios.put(
        `http://localhost:5001/api/notifications/${notification._id}`,
        { read: !isRead }
      );
      setIsRead(!isRead);
      toast({
        title: "Updated",
        description: `Marked as ${!isRead ? "read" : "unread"}`,
      });
    } catch {
      toast({
        title: "Error",
        description: "Failed to update read status.",
        variant: "destructive",
      });
    }
  };

  const deleteNotification = async () => {
    try {
      await axios.delete(
        `http://localhost:5001/api/notifications/${notification._id}`
      );
      toast({ title: "Deleted", description: "Notification removed." });
      refresh();
    } catch {
      toast({
        title: "Error",
        description: "Failed to delete notification.",
        variant: "destructive",
      });
    }
  };

  const getIcon = (type: string) =>
    type === "appointment" ? (
      <Calendar className="h-5 w-5 text-blue-500" />
    ) : type === "message" ? (
      <MessageSquare className="h-5 w-5 text-green-500" />
    ) : (
      <Bell className="h-5 w-5 text-amber-500" />
    );

  return (
    <div
      className={`flex items-start gap-4 p-4 ${
        !isRead ? "bg-primary/5" : ""
      } hover:bg-accent/50 transition`}
    >
      <Checkbox checked={isRead} onCheckedChange={toggleRead} className="mt-1" />
      <div className="flex-shrink-0 mt-1">{getIcon(notification.type)}</div>
      <div className="flex-1 min-w-0">
        <h4 className={`font-medium ${!isRead ? "text-primary" : ""}`}>
          {notification.title}
        </h4>
        <p className="text-sm text-muted-foreground mt-1">
          {notification.message}
        </p>
        <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
          <Clock className="h-3 w-3 mr-1" />
          {new Date(notification.createdAt).toLocaleString()}
        </div>
      </div>
      <div className="flex items-center gap-1">
        <Button variant="ghost" size="icon" onClick={toggleRead}>
          <MailOpen className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="icon" onClick={deleteNotification}>
          <Trash className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
