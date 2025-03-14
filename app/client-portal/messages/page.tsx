"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"
import { Bell, MessageSquare, Send } from "lucide-react"

interface Message {
  id: number
  subject: string
  message: string
  date: string
  sender: "client" | "company"
  read: boolean
}

interface Notification {
  id: number
  title: string
  message: string
  date: string
  type: "booking" | "service" | "payment" | "other"
  read: boolean
}

export default function MessagesPage() {
  const { toast } = useToast()
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      subject: "Upcoming Service Reminder",
      message: "This is a reminder about your scheduled cleaning service tomorrow at 2:00 PM.",
      date: "2024-02-19",
      sender: "company",
      read: false,
    },
    {
      id: 2,
      subject: "Service Feedback",
      message: "Thank you for your recent feedback! We appreciate your input.",
      date: "2024-02-18",
      sender: "company",
      read: true,
    },
  ])

  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: 1,
      title: "Booking Confirmed",
      message: "Your cleaning service for Feb 25 has been confirmed.",
      date: "2024-02-19",
      type: "booking",
      read: false,
    },
    {
      id: 2,
      title: "Payment Received",
      message: "Payment of $150 has been processed successfully.",
      date: "2024-02-18",
      type: "payment",
      read: true,
    },
  ])

  const handleSendMessage = async (formData: FormData) => {
    const newMessage: Message = {
      id: messages.length + 1,
      subject: formData.get("subject") as string,
      message: formData.get("message") as string,
      date: new Date().toISOString().split("T")[0],
      sender: "client",
      read: true,
    }

    setMessages([newMessage, ...messages])
    toast({
      title: "Message Sent",
      description: "Your message has been sent successfully.",
    })
  }

  const markAsRead = (messageId: number) => {
    setMessages(messages.map((message) => (message.id === messageId ? { ...message, read: true } : message)))
  }

  const markNotificationAsRead = (notificationId: number) => {
    setNotifications(
      notifications.map((notification) =>
        notification.id === notificationId ? { ...notification, read: true } : notification,
      ),
    )
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Messages & Notifications</h1>
        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <MessageSquare className="mr-2 h-4 w-4" />
              New Message
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Send Message</DialogTitle>
            </DialogHeader>
            <form action={(formData) => handleSendMessage(formData)} className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="subject">Subject</Label>
                <Input id="subject" name="subject" required />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="type">Message Type</Label>
                <Select name="type">
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="general">General Inquiry</SelectItem>
                    <SelectItem value="booking">Booking Related</SelectItem>
                    <SelectItem value="service">Service Related</SelectItem>
                    <SelectItem value="billing">Billing Related</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="message">Message</Label>
                <Textarea id="message" name="message" required />
              </div>
              <Button type="submit" className="w-full">
                <Send className="mr-2 h-4 w-4" />
                Send Message
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Messages</CardTitle>
            <CardDescription>Communication with our team</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`rounded-lg border p-4 ${!message.read ? "bg-muted" : ""}`}
                  onClick={() => markAsRead(message.id)}
                >
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium">{message.subject}</h3>
                    <span className="text-sm text-muted-foreground">{message.date}</span>
                  </div>
                  <p className="mt-2 text-sm text-muted-foreground">{message.message}</p>
                  <div className="mt-2 flex items-center justify-between">
                    <span className={`text-sm ${message.sender === "company" ? "text-blue-600" : "text-green-600"}`}>
                      {message.sender === "company" ? "Company" : "You"}
                    </span>
                    {!message.read && (
                      <span className="rounded-full bg-blue-100 px-2 py-1 text-xs font-medium text-blue-600">New</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Notifications</CardTitle>
            <CardDescription>Updates and alerts about your services</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`rounded-lg border p-4 ${!notification.read ? "bg-muted" : ""}`}
                  onClick={() => markNotificationAsRead(notification.id)}
                >
                  <div className="flex items-center gap-2">
                    <Bell className="h-4 w-4 text-blue-500" />
                    <h3 className="font-medium">{notification.title}</h3>
                  </div>
                  <p className="mt-2 text-sm text-muted-foreground">{notification.message}</p>
                  <div className="mt-2 flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">{notification.date}</span>
                    {!notification.read && (
                      <span className="rounded-full bg-blue-100 px-2 py-1 text-xs font-medium text-blue-600">New</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

