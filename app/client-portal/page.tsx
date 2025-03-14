"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar, Clock, DollarSign, MessageSquare, RefreshCw } from "lucide-react"
import { useClientAuth } from "@/components/client-portal/auth-provider"
import { UpcomingServices } from "@/components/client-portal/upcoming-services"
import { RecentInvoices } from "@/components/client-portal/recent-invoices"
import { QuickActions } from "@/components/client-portal/quick-actions"
import { useToast } from "@/components/ui/use-toast"
import { fetchDashboardData } from "@/lib/api/client-portal"

export default function ClientPortalDashboard() {
  const { toast } = useToast()
  const { client } = useClientAuth()
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [dashboardData, setDashboardData] = useState({
    nextService: {
      date: "",
      service: "",
      time: "",
      duration: "",
    },
    outstandingBalance: {
      amount: 0,
      dueIn: 0,
    },
    newMessages: 0,
    lastUpdated: new Date(),
  })

  const fetchData = async () => {
    setIsLoading(true)
    setError(null)
    try {
      const data = await fetchDashboardData(client?.id)
      setDashboardData(data)
      setLastUpdated(new Date())
    } catch (err) {
      console.error("Error fetching dashboard data:", err)
      setError("Failed to load dashboard data. Please try again.")
      toast({
        title: "Error",
        description: "Failed to load dashboard data. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Initial data fetch
  useEffect(() => {
    if (client) {
      fetchData()
    }
  }, [client, fetchData])

  // Set up polling every 30 seconds
  useEffect(() => {
    if (!client) return

    const intervalId = setInterval(() => {
      fetchData()
    }, 30000) // 30 seconds

    return () => clearInterval(intervalId)
  }, [client, fetchData])

  const [lastUpdated, setLastUpdated] = useState(new Date())

  const handleRefresh = () => {
    fetchData()
    toast({
      title: "Dashboard Refreshed",
      description: "The dashboard data has been updated.",
    })
  }

  if (!client) {
    return <div>Loading...</div>
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Welcome back, {client.name}</h1>
          <p className="text-muted-foreground">Manage your cleaning services and account</p>
        </div>
        <Button variant="outline" onClick={handleRefresh} disabled={isLoading} className="flex items-center gap-2">
          <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
          Refresh
        </Button>
      </div>

      {error && <div className="rounded-md bg-destructive/15 p-4 text-destructive">{error}</div>}

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Next Service</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="h-[52px] animate-pulse rounded bg-muted"></div>
            ) : (
              <>
                <div className="text-2xl font-bold">{dashboardData.nextService.date || "No upcoming service"}</div>
                <p className="text-xs text-muted-foreground">{dashboardData.nextService.service}</p>
              </>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Service Time</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="h-[52px] animate-pulse rounded bg-muted"></div>
            ) : (
              <>
                <div className="text-2xl font-bold">{dashboardData.nextService.time || "N/A"}</div>
                <p className="text-xs text-muted-foreground">{dashboardData.nextService.duration}</p>
              </>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Outstanding Balance</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="h-[52px] animate-pulse rounded bg-muted"></div>
            ) : (
              <>
                <div className="text-2xl font-bold">${dashboardData.outstandingBalance.amount.toFixed(2)}</div>
                <p className="text-xs text-muted-foreground">
                  {dashboardData.outstandingBalance.amount > 0
                    ? `Due in ${dashboardData.outstandingBalance.dueIn} days`
                    : "No outstanding balance"}
                </p>
              </>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">New Messages</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="h-[52px] animate-pulse rounded bg-muted"></div>
            ) : (
              <>
                <div className="text-2xl font-bold">{dashboardData.newMessages}</div>
                <p className="text-xs text-muted-foreground">
                  {dashboardData.newMessages > 0 ? "Last received today" : "No new messages"}
                </p>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <UpcomingServices isLoading={isLoading} clientId={client.id} />
        <RecentInvoices isLoading={isLoading} clientId={client.id} />
      </div>

      <QuickActions />

      <div className="text-center text-xs text-muted-foreground">Last updated: {lastUpdated.toLocaleTimeString()}</div>
    </div>
  )
}

