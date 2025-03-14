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
import { Map, Users, Plus } from "lucide-react"

interface BusinessSettings {
  companyName: string
  email: string
  phone: string
  address: string
  businessHours: {
    [key: string]: {
      open: string
      close: string
      closed: boolean
    }
  }
  serviceAreas: string[]
}

interface NotificationSettings {
  email: {
    newBooking: boolean
    bookingReminder: boolean
    customerReview: boolean
  }
  sms: {
    newBooking: boolean
    bookingReminder: boolean
  }
}

export default function SettingsPage() {
  const { toast } = useToast()
  const [businessSettings, setBusinessSettings] = useState<BusinessSettings>({
    companyName: "CleanPro Services",
    email: "info@cleanpro.com",
    phone: "(555) 123-4567",
    address: "123 Main St, Anytown, USA",
    businessHours: {
      monday: { open: "09:00", close: "17:00", closed: false },
      tuesday: { open: "09:00", close: "17:00", closed: false },
      wednesday: { open: "09:00", close: "17:00", closed: false },
      thursday: { open: "09:00", close: "17:00", closed: false },
      friday: { open: "09:00", close: "17:00", closed: false },
      saturday: { open: "10:00", close: "15:00", closed: false },
      sunday: { open: "00:00", close: "00:00", closed: true },
    },
    serviceAreas: ["Downtown", "North Side", "South Side", "West End"],
  })

  const [notificationSettings, setNotificationSettings] = useState<NotificationSettings>({
    email: {
      newBooking: true,
      bookingReminder: true,
      customerReview: true,
    },
    sms: {
      newBooking: true,
      bookingReminder: false,
    },
  })

  const handleUpdateBusinessSettings = async (formData: FormData) => {
    const updatedSettings = {
      ...businessSettings,
      companyName: formData.get("companyName") as string,
      email: formData.get("email") as string,
      phone: formData.get("phone") as string,
      address: formData.get("address") as string,
    }

    setBusinessSettings(updatedSettings)
    toast({
      title: "Settings Updated",
      description: "Your business settings have been updated successfully.",
    })
  }

  const handleToggleNotification = (type: "email" | "sms", setting: string, value: boolean) => {
    setNotificationSettings((prev) => ({
      ...prev,
      [type]: {
        ...prev[type],
        [setting]: value,
      },
    }))
    toast({
      title: "Notification Setting Updated",
      description: "Your notification preferences have been saved.",
    })
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
      </div>

      <Tabs defaultValue="business">
        <TabsList>
          <TabsTrigger value="business">Business</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="system">System</TabsTrigger>
        </TabsList>

        <TabsContent value="business" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Business Information</CardTitle>
              <CardDescription>Manage your company details and settings</CardDescription>
            </CardHeader>
            <CardContent>
              <form action={(formData) => handleUpdateBusinessSettings(formData)} className="space-y-4">
                <div className="grid gap-2">
                  <Label htmlFor="companyName">Company Name</Label>
                  <Input id="companyName" name="companyName" defaultValue={businessSettings.companyName} />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" name="email" type="email" defaultValue={businessSettings.email} />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input id="phone" name="phone" type="tel" defaultValue={businessSettings.phone} />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="address">Address</Label>
                  <Textarea id="address" name="address" defaultValue={businessSettings.address} />
                </div>
                <Button type="submit">Save Changes</Button>
              </form>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Business Hours</CardTitle>
              <CardDescription>Set your operating hours</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {Object.entries(businessSettings.businessHours).map(([day, hours]) => (
                  <div key={day} className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0">
                    <div className="flex items-center gap-4">
                      <p className="w-24 font-medium capitalize">{day}</p>
                      <div className="flex items-center gap-2">
                        <Select defaultValue={hours.open} disabled={hours.closed}>
                          <SelectTrigger className="w-32">
                            <SelectValue placeholder="Opening time" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="09:00">9:00 AM</SelectItem>
                            <SelectItem value="10:00">10:00 AM</SelectItem>
                            <SelectItem value="11:00">11:00 AM</SelectItem>
                          </SelectContent>
                        </Select>
                        <span>to</span>
                        <Select defaultValue={hours.close} disabled={hours.closed}>
                          <SelectTrigger className="w-32">
                            <SelectValue placeholder="Closing time" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="17:00">5:00 PM</SelectItem>
                            <SelectItem value="18:00">6:00 PM</SelectItem>
                            <SelectItem value="19:00">7:00 PM</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Label htmlFor={`closed-${day}`}>Closed</Label>
                      <Switch
                        id={`closed-${day}`}
                        checked={hours.closed}
                        onCheckedChange={(checked) => {
                          setBusinessSettings((prev) => ({
                            ...prev,
                            businessHours: {
                              ...prev.businessHours,
                              [day]: {
                                ...prev.businessHours[day],
                                closed: checked,
                              },
                            },
                          }))
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Service Areas</CardTitle>
              <CardDescription>Manage your service coverage areas</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {businessSettings.serviceAreas.map((area) => (
                  <div key={area} className="flex items-center justify-between rounded-lg border p-4">
                    <div className="flex items-center gap-2">
                      <Map className="h-4 w-4 text-muted-foreground" />
                      <span>{area}</span>
                    </div>
                    <Button variant="outline" size="sm">
                      Remove
                    </Button>
                  </div>
                ))}
                <Button className="w-full">
                  <Plus className="mr-2 h-4 w-4" />
                  Add Service Area
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Email Notifications</CardTitle>
              <CardDescription>Manage your email notification preferences</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {Object.entries(notificationSettings.email).map(([key, value]) => (
                  <div key={key} className="flex items-center justify-between">
                    <Label htmlFor={`email-${key}`} className="flex-1">
                      {key
                        .split(/(?=[A-Z])/)
                        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                        .join(" ")}
                    </Label>
                    <Switch
                      id={`email-${key}`}
                      checked={value}
                      onCheckedChange={(checked) => handleToggleNotification("email", key, checked)}
                    />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>SMS Notifications</CardTitle>
              <CardDescription>Manage your SMS notification preferences</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {Object.entries(notificationSettings.sms).map(([key, value]) => (
                  <div key={key} className="flex items-center justify-between">
                    <Label htmlFor={`sms-${key}`} className="flex-1">
                      {key
                        .split(/(?=[A-Z])/)
                        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                        .join(" ")}
                    </Label>
                    <Switch
                      id={`sms-${key}`}
                      checked={value}
                      onCheckedChange={(checked) => handleToggleNotification("sms", key, checked)}
                    />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="users" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>User Management</CardTitle>
              <CardDescription>Manage system users and roles</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Button className="w-full">
                  <Users className="mr-2 h-4 w-4" />
                  Invite New User
                </Button>
                {/* Add user list and management here */}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="system" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>System Preferences</CardTitle>
              <CardDescription>Configure system-wide settings</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="darkMode">Dark Mode</Label>
                  <Switch id="darkMode" />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="autoBackup">Automatic Backups</Label>
                  <Switch id="autoBackup" defaultChecked />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="language">Language</Label>
                  <Select defaultValue="en">
                    <SelectTrigger>
                      <SelectValue placeholder="Select language" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="es">Spanish</SelectItem>
                      <SelectItem value="fr">French</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

