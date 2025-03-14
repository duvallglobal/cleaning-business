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
import { BarChart, Mail, MessageSquare, Plus, Star, Tags } from "lucide-react"

interface Campaign {
  id: number
  name: string
  type: "email" | "sms"
  status: "draft" | "scheduled" | "sent"
  sendDate?: string
  recipients: number
  openRate?: number
  clickRate?: number
}

interface Promotion {
  id: number
  code: string
  discount: string
  validUntil: string
  usageCount: number
  status: "active" | "expired"
}

interface Review {
  id: number
  clientName: string
  rating: number
  comment: string
  date: string
  status: "published" | "pending"
}

export default function MarketingPage() {
  const { toast } = useToast()
  const [campaigns, setCampaigns] = useState<Campaign[]>([
    {
      id: 1,
      name: "Spring Cleaning Special",
      type: "email",
      status: "sent",
      sendDate: "2024-02-15",
      recipients: 250,
      openRate: 45,
      clickRate: 12,
    },
    {
      id: 2,
      name: "Customer Satisfaction Survey",
      type: "email",
      status: "scheduled",
      sendDate: "2024-02-25",
      recipients: 500,
    },
  ])

  const [promotions, setPromotions] = useState<Promotion[]>([
    {
      id: 1,
      code: "SPRING20",
      discount: "20% off",
      validUntil: "2024-03-31",
      usageCount: 45,
      status: "active",
    },
    {
      id: 2,
      code: "REFER10",
      discount: "$10 off",
      validUntil: "2024-12-31",
      usageCount: 23,
      status: "active",
    },
  ])

  const [reviews, setReviews] = useState<Review[]>([
    {
      id: 1,
      clientName: "Sarah Thompson",
      rating: 5,
      comment: "Excellent service! The team was professional and thorough. Highly recommended!",
      date: "2024-02-18",
      status: "published",
    },
    {
      id: 2,
      clientName: "Michael Chen",
      rating: 4,
      comment: "Great job on the deep cleaning. Will use again!",
      date: "2024-02-17",
      status: "published",
    },
  ])

  const handleCreateCampaign = async (formData: FormData) => {
    const newCampaign: Campaign = {
      id: campaigns.length + 1,
      name: formData.get("name") as string,
      type: formData.get("type") as "email" | "sms",
      status: "draft",
      recipients: Number.parseInt(formData.get("recipients") as string),
    }

    setCampaigns([...campaigns, newCampaign])
    toast({
      title: "Campaign Created",
      description: "The new campaign has been created successfully.",
    })
  }

  const handleCreatePromotion = async (formData: FormData) => {
    const newPromotion: Promotion = {
      id: promotions.length + 1,
      code: formData.get("code") as string,
      discount: formData.get("discount") as string,
      validUntil: formData.get("validUntil") as string,
      usageCount: 0,
      status: "active",
    }

    setPromotions([...promotions, newPromotion])
    toast({
      title: "Promotion Created",
      description: "The new promotion code has been created successfully.",
    })
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Marketing</h1>
        <div className="flex gap-2">
          <Dialog>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                New Campaign
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Campaign</DialogTitle>
              </DialogHeader>
              <form action={(formData) => handleCreateCampaign(formData)} className="space-y-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">Campaign Name</Label>
                  <Input id="name" name="name" required />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="type">Campaign Type</Label>
                  <Select name="type">
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="email">Email Campaign</SelectItem>
                      <SelectItem value="sms">SMS Campaign</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="recipients">Number of Recipients</Label>
                  <Input id="recipients" name="recipients" type="number" required />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="message">Message</Label>
                  <Textarea id="message" name="message" required />
                </div>
                <Button type="submit">Create Campaign</Button>
              </form>
            </DialogContent>
          </Dialog>
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Tags className="mr-2 h-4 w-4" />
                New Promotion
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Promotion</DialogTitle>
              </DialogHeader>
              <form action={(formData) => handleCreatePromotion(formData)} className="space-y-4">
                <div className="grid gap-2">
                  <Label htmlFor="code">Promotion Code</Label>
                  <Input id="code" name="code" required />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="discount">Discount</Label>
                  <Input id="discount" name="discount" required />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="validUntil">Valid Until</Label>
                  <Input id="validUntil" name="validUntil" type="date" required />
                </div>
                <Button type="submit">Create Promotion</Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Campaigns</CardTitle>
            <CardDescription>Manage your marketing campaigns</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {campaigns.map((campaign) => (
                <div key={campaign.id} className="flex items-center justify-between rounded-lg border p-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      {campaign.type === "email" ? (
                        <Mail className="h-4 w-4 text-blue-500" />
                      ) : (
                        <MessageSquare className="h-4 w-4 text-green-500" />
                      )}
                      <p className="font-medium">{campaign.name}</p>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {campaign.recipients} recipients •{" "}
                      {campaign.openRate ? `${campaign.openRate}% open rate` : "Not sent"}
                    </p>
                  </div>
                  <span
                    className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                      campaign.status === "sent"
                        ? "bg-green-100 text-green-700"
                        : campaign.status === "scheduled"
                          ? "bg-blue-100 text-blue-700"
                          : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {campaign.status}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Active Promotions</CardTitle>
            <CardDescription>Track promotion code usage</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {promotions.map((promo) => (
                <div key={promo.id} className="flex items-center justify-between rounded-lg border p-4">
                  <div className="space-y-1">
                    <p className="font-medium">{promo.code}</p>
                    <p className="text-sm text-muted-foreground">
                      {promo.discount} • Valid until {promo.validUntil}
                    </p>
                    <p className="text-sm text-muted-foreground">Used {promo.usageCount} times</p>
                  </div>
                  <span
                    className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                      promo.status === "active" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                    }`}
                  >
                    {promo.status}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Customer Reviews</CardTitle>
            <CardDescription>Recent customer feedback and ratings</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {reviews.map((review) => (
                <div key={review.id} className="flex items-center justify-between rounded-lg border p-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <Star className="h-4 w-4 text-yellow-500" />
                      <p className="font-medium">{review.clientName}</p>
                    </div>
                    <p className="text-sm">{review.comment}</p>
                    <p className="text-sm text-muted-foreground">{review.date}</p>
                  </div>
                  <span
                    className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                      review.status === "published" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {review.status}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Analytics Overview</CardTitle>
            <CardDescription>Marketing performance metrics</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <p className="text-sm font-medium">Email Open Rate</p>
                  <p className="text-2xl font-bold">45%</p>
                  <p className="text-sm text-muted-foreground">+5.2% from last month</p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-medium">SMS Response Rate</p>
                  <p className="text-2xl font-bold">28%</p>
                  <p className="text-sm text-muted-foreground">+2.4% from last month</p>
                </div>
              </div>
              <div className="rounded-lg bg-muted p-4">
                <div className="flex items-center gap-2">
                  <BarChart className="h-5 w-5 text-primary" />
                  <span className="text-sm font-medium">Campaign Performance</span>
                </div>
                <p className="mt-2 text-sm text-muted-foreground">Last campaign performed 23% better than average</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

