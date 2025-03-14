"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Edit } from "lucide-react"
import Link from "next/link"

// Define the Client type directly here
interface Client {
  id: number
  name: string
  email: string
  phone: string
  address: string
  isActive: boolean
  clientType: "regular" | "one-time"
  notes?: string
}

// Sample client data
const initialClients: Client[] = [
  {
    id: 1,
    name: "John Smith",
    email: "john.smith@example.com",
    phone: "555-123-4567",
    address: "123 Main St, Anytown, USA",
    isActive: true,
    clientType: "regular",
    notes: "Prefers service on Mondays",
  },
  {
    id: 2,
    name: "Sarah Johnson",
    email: "sarah.j@example.com",
    phone: "555-987-6543",
    address: "456 Oak Ave, Somewhere, USA",
    isActive: true,
    clientType: "regular",
    notes: "Has two dogs",
  },
  {
    id: 3,
    name: "Michael Brown",
    email: "mbrown@example.com",
    phone: "555-456-7890",
    address: "789 Pine Rd, Nowhere, USA",
    isActive: false,
    clientType: "one-time",
    notes: "One-time deep cleaning",
  },
  {
    id: 4,
    name: "Emily Davis",
    email: "emily.davis@example.com",
    phone: "555-789-0123",
    address: "321 Elm St, Anytown, USA",
    isActive: true,
    clientType: "regular",
    notes: "Bi-weekly cleaning",
  },
  {
    id: 5,
    name: "Robert Wilson",
    email: "rwilson@example.com",
    phone: "555-234-5678",
    address: "654 Maple Dr, Somewhere, USA",
    isActive: true,
    clientType: "one-time",
    notes: "Move-out cleaning",
  },
]

export default function ClientDetailPage({ params }: { params: { id: string } }) {
  const [client, setClient] = useState<Client | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // In a real app, you would fetch the client data from an API
    // For now, we'll simulate a delay and use our sample data
    const timer = setTimeout(() => {
      const foundClient = initialClients.find((c) => c.id === Number.parseInt(params.id))
      setClient(foundClient || null)
      setIsLoading(false)
    }, 500)

    return () => clearTimeout(timer)
  }, [params.id])

  const handleToggleStatus = () => {
    if (client) {
      setClient({
        ...client,
        isActive: !client.isActive,
      })
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading client information...</p>
        </div>
      </div>
    )
  }

  if (!client) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold">Client Not Found</h2>
          <p className="mt-2 text-muted-foreground">The client you're looking for doesn't exist or has been removed.</p>
          <Button asChild className="mt-4">
            <Link href="/clients">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Clients
            </Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="icon" asChild>
            <Link href="/clients">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <h1 className="text-2xl font-bold">{client.name}</h1>
          <div className="flex space-x-2">
            <Badge variant={client.isActive ? "default" : "secondary"}>{client.isActive ? "Active" : "Inactive"}</Badge>
            <Badge variant={client.clientType === "regular" ? "outline" : "secondary"}>
              {client.clientType === "regular" ? "Regular" : "One-time"}
            </Badge>
          </div>
        </div>
        <div className="flex space-x-2">
          <Button onClick={handleToggleStatus} variant="outline">
            {client.isActive ? "Mark as Inactive" : "Mark as Active"}
          </Button>
          <Button>
            <Edit className="mr-2 h-4 w-4" />
            Edit Client
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Client Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Email</h3>
              <p>{client.email}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Phone</h3>
              <p>{client.phone}</p>
            </div>
            <div className="md:col-span-2">
              <h3 className="text-sm font-medium text-muted-foreground">Address</h3>
              <p>{client.address}</p>
            </div>
            {client.notes && (
              <div className="md:col-span-2">
                <h3 className="text-sm font-medium text-muted-foreground">Notes</h3>
                <p>{client.notes}</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

