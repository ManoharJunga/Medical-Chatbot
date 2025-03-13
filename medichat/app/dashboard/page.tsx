"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { MessageSquare, Clock, Calendar, User } from "lucide-react"

export default function Dashboard() {
  // Mock data for the dashboard
  const recentChats = [
    {
      id: 1,
      topic: "Headache and fever",
      date: "2 hours ago",
      summary: "Possible flu. Rest, hydrate, monitor temperature.",
    },
    {
      id: 2,
      topic: "Skin rash",
      date: "Yesterday",
      summary: "Likely contact dermatitis. Avoid irritants, use hydrocortisone cream.",
    },
    {
      id: 3,
      topic: "Joint pain",
      date: "3 days ago",
      summary: "Could be early arthritis. Take OTC pain relievers, schedule doctor visit.",
    },
  ]

  const savedResponses = [
    { id: 1, topic: "Vitamin D Deficiency", date: "1 week ago" },
    { id: 2, topic: "Exercise Recommendations", date: "2 weeks ago" },
  ]

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1 py-10 px-4 bg-gray-50">
        <div className="container mx-auto max-w-6xl">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold">Dashboard</h1>
              <p className="text-gray-600">Welcome back, John Doe</p>
            </div>
            <div className="mt-4 md:mt-0 flex space-x-4">
              <Link href="/chat">
                <Button>
                  <MessageSquare className="mr-2 h-4 w-4" />
                  Start New Chat
                </Button>
              </Link>
              <Link href="/symptom-checker">
                <Button variant="outline">Check Symptoms</Button>
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Chats</CardTitle>
                <MessageSquare className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">12</div>
                <p className="text-xs text-muted-foreground">+2 from last week</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Saved Responses</CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">5</div>
                <p className="text-xs text-muted-foreground">+1 from last week</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Upcoming Appointments</CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">1</div>
                <p className="text-xs text-muted-foreground">Next: Dr. Smith on Friday</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Health Profile</CardTitle>
                <User className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">70%</div>
                <p className="text-xs text-muted-foreground">Complete your profile</p>
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue="recent-chats" className="space-y-4">
            <TabsList>
              <TabsTrigger value="recent-chats">Recent Chats</TabsTrigger>
              <TabsTrigger value="saved-responses">Saved Responses</TabsTrigger>
              <TabsTrigger value="appointments">Appointments</TabsTrigger>
            </TabsList>

            <TabsContent value="recent-chats" className="space-y-4">
              {recentChats.map((chat) => (
                <Card key={chat.id}>
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-center">
                      <CardTitle>{chat.topic}</CardTitle>
                      <span className="text-sm text-gray-500">{chat.date}</span>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600">{chat.summary}</p>
                    <div className="flex justify-end mt-4">
                      <Link href={`/chat/${chat.id}`}>
                        <Button variant="outline" size="sm">
                          Continue Chat
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </TabsContent>

            <TabsContent value="saved-responses" className="space-y-4">
              {savedResponses.map((response) => (
                <Card key={response.id}>
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-center">
                      <CardTitle>{response.topic}</CardTitle>
                      <span className="text-sm text-gray-500">{response.date}</span>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex justify-end mt-4">
                      <Link href={`/saved-responses/${response.id}`}>
                        <Button variant="outline" size="sm">
                          View Details
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </TabsContent>

            <TabsContent value="appointments">
              <Card>
                <CardHeader>
                  <CardTitle>Upcoming Appointments</CardTitle>
                  <CardDescription>Your scheduled doctor consultations</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="rounded-md border p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium">Dr. Sarah Smith</h3>
                        <p className="text-sm text-gray-500">General Practitioner</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">Friday, March 15</p>
                        <p className="text-sm text-gray-500">10:30 AM</p>
                      </div>
                    </div>
                    <div className="mt-4 flex justify-end space-x-2">
                      <Button variant="outline" size="sm">
                        Reschedule
                      </Button>
                      <Button variant="destructive" size="sm">
                        Cancel
                      </Button>
                    </div>
                  </div>

                  <div className="mt-4 flex justify-center">
                    <Button variant="outline">
                      <Calendar className="mr-2 h-4 w-4" />
                      Schedule New Appointment
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      <Footer />
    </div>
  )
}

