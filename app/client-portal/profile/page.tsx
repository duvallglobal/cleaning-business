"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"
import { CreditCard, Key, User } from "lucide-react"

interface Profile {
  name: string
  email: string
  phone: string
  address: string
  preferences: {
    notifications: {
      email: boolean
      sms: boolean
      reminders: boolean
    }
    servicePreferences: {
      petInHome: boolean
      preferredDayOfWeek: string
      preferredTimeOfDay: string
      specialInstructions: string
    }
  }
}

export default function ProfilePage() {
  const { toast } = useToast()
  const [profile, setProfile] = useState<Profile>({
    name: "Sarah Thompson",
    email: "sarah.t@example.com",
    phone: "(555) 123-4567",
    address: "123 Main St, Anytown, USA",
    preferences: {
      notifications: {
        email: true,
        sms: true,
        reminders: true,
      },
      servicePreferences: {
        petInHome: true,
        preferredDayOfWeek: "tuesday",
        preferredTimeOfDay: "morning",
        specialInstructions: "Please use eco-friendly products. Key is under the mat.",
      },
    },
  })

  const handleUpdateProfile = async (formData: FormData) => {
    const updatedProfile = {
      ...profile,
      name: formData.get("name") as string,
      email: formData.get("email") as string,
      phone: formData.get("phone") as string,
      address: formData.get("address") as string,
    }

    setProfile(updatedProfile)
    toast({
      title: "Profile Updated",
      description: "Your profile has been updated successfully.",
    })
  }

  const handleUpdatePreferences = async (formData: FormData) => {
    const updatedProfile = {
      ...profile,
      preferences: {
        ...profile.preferences,
        servicePreferences: {
          ...profile.preferences.servicePreferences,
          preferredDayOfWeek: formData.get("preferredDay") as string,
          preferredTimeOfDay: formData.get("preferredTime") as string,
          specialInstructions: formData.get("instructions") as string,
        },
      },
    }

    setProfile(updatedProfile)
    toast({
      title: "Preferences Updated",
      description: "Your service preferences have been updated successfully.",
    })
  }

  const handleUpdateNotifications = (type: "email" | "sms" | "reminders", value: boolean) => {
    setProfile({
      ...profile,
      preferences: {
        ...profile.preferences,
        notifications: {
          ...profile.preferences.notifications,
          [type]: value,
        },
      },
    })
    toast({
      title: "Notifications Updated",
      description: "Your notification preferences have been saved.",
    })
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Profile Settings</h1>
      </div>

      <Tabs defaultValue="profile">
        <TabsList>
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="preferences">Preferences</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="billing">Billing</TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
              <CardDescription>Update your personal details</CardDescription>
            </CardHeader>
            <CardContent>
              <form action={(formData) => handleUpdateProfile(formData)} className="space-y-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input id="name" name="name" defaultValue={profile.name} />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" name="email" type="email" defaultValue={profile.email} />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input id="phone" name="phone" type="tel" defaultValue={profile.phone} />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="address">Address</Label>
                  <Textarea id="address" name="address" defaultValue={profile.address} />
                </div>
                <Button type="submit">Save Changes</Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="preferences" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Service Preferences</CardTitle>
              <CardDescription>Customize your cleaning service experience</CardDescription>
            </CardHeader>
            <CardContent>
              <form action={(formData) => handleUpdatePreferences(formData)} className="space-y-4">
                <div className="grid gap-2">
                  <Label htmlFor="preferredDay">Preferred Day</Label>
                  <Select name="preferredDay" defaultValue={profile.preferences.servicePreferences.preferredDayOfWeek}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select day" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="monday">Monday</SelectItem>
                      <SelectItem value="tuesday">Tuesday</SelectItem>
                      <SelectItem value="wednesday">Wednesday</SelectItem>
                      <SelectItem value="thursday">Thursday</SelectItem>
                      <SelectItem value="friday">Friday</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="preferredTime">Preferred Time</Label>
                  <Select name="preferredTime" defaultValue={profile.preferences.servicePreferences.preferredTimeOfDay}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select time" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="morning">Morning (8AM-12PM)</SelectItem>
                      <SelectItem value="afternoon">Afternoon (12PM-4PM)</SelectItem>
                      <SelectItem value="evening">Evening (4PM-8PM)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="instructions">Special Instructions</Label>
                  <Textarea
                    id="instructions"
                    name="instructions"
                    defaultValue={profile.preferences.servicePreferences.specialInstructions}
                  />
                </div>
                <Button type="submit">Save Preferences</Button>
              </form>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Notification Settings</CardTitle>
              <CardDescription>Manage your notification preferences</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="emailNotifications">Email Notifications</Label>
                  <Switch
                    id="emailNotifications"
                    checked={profile.preferences.notifications.email}
                    onCheckedChange={(checked) => handleUpdateNotifications("email", checked)}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="smsNotifications">SMS Notifications</Label>
                  <Switch
                    id="smsNotifications"
                    checked={profile.preferences.notifications.sms}
                    onCheckedChange={(checked) => handleUpdateNotifications("sms", checked)}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="serviceReminders">Service Reminders</Label>
                  <Switch
                    id="serviceReminders"
                    checked={profile.preferences.notifications.reminders}
                    onCheckedChange={(checked) => handleUpdateNotifications("reminders", checked)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Security Settings</CardTitle>
              <CardDescription>Manage your account security</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Button variant="outline" className="w-full">
                  <Key className="mr-2 h-4 w-4" />
                  Change Password
                </Button>
                <Button variant="outline" className="w-full">
                  <User className="mr-2 h-4 w-4" />
                  Two-Factor Authentication
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="billing" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Payment Methods</CardTitle>
              <CardDescription>Manage your payment information</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Button variant="outline" className="w-full">
                  <CreditCard className="mr-2 h-4 w-4" />
                  Add Payment Method
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

