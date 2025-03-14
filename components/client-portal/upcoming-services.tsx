"use client"

import { CalendarIcon, ChevronRightIcon } from "lucide-react"
import Link from "next/link"
import { useEffect, useState } from "react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { getUpcomingBookings } from "@/lib/services/booking-service"

interface Service {
  id: string
  service: string
  date: string
  time: string
  status: string
}

export function UpcomingServices() {
  const [services, setServices] = useState<Service[]>([])
  const [loading, setLoading] = useState(false) // Changed from true to false initially

  useEffect(() => {
    const fetchServices = async () => {
      try {
        setLoading(true)
        // Simulate data fetch - replace with actual Firebase fetch
        const data = await getUpcomingBookings()
        setServices(data)
      } catch (error) {
        console.error("Error fetching upcoming services:", error)
      } finally {
        setLoading(false)
      }
    }

    // Immediately invoke the function
    fetchServices()

    // Add a cleanup function to prevent state updates on unmounted component
    return () => {
      // Cleanup logic if needed
    }
  }, []) // Empty dependency array means this runs once on mount

  // Provide fallback data if services is empty to prevent loading state
  const displayServices =
    services.length > 0
      ? services
      : [
          {
            id: "placeholder-1",
            service: "No upcoming services",
            date: "N/A",
            time: "N/A",
            status: "none",
          },
        ]

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Upcoming Services</CardTitle>
          <CardDescription>Your scheduled cleaning services</CardDescription>
        </div>
        <Link href="/client-portal/services">
          <Button variant="ghost" className="gap-1">
            View All
            <ChevronRightIcon className="h-4 w-4" />
          </Button>
        </Link>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex justify-center py-8">
            <div className="h-6 w-6 animate-spin rounded-full border-b-2 border-primary"></div>
          </div>
        ) : (
          <div className="space-y-4">
            {displayServices.map((service) => (
              <div key={service.id} className="flex items-center justify-between rounded-lg border p-3">
                <div className="flex items-center gap-4">
                  <div className="rounded-full bg-primary/10 p-2">
                    <CalendarIcon className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <div className="font-medium">{service.service}</div>
                    <div className="text-sm text-muted-foreground">
                      {service.date} at {service.time}
                    </div>
                  </div>
                </div>
                {service.status !== "none" && (
                  <Link href={`/client-portal/services/${service.id}`}>
                    <Button variant="ghost" size="sm">
                      Details
                    </Button>
                  </Link>
                )}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

