"use client"

import { DialogTitle } from "@/components/ui/dialog"

import { DialogHeader } from "@/components/ui/dialog"

import { DialogContent } from "@/components/ui/dialog"

import { Dialog } from "@/components/ui/dialog"

import type React from "react"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MoreHorizontal, Search, Plus, Edit, Eye, ToggleLeft } from "lucide-react"
import { useRouter } from "next/navigation"

// Define the Client type directly here to ensure it's available
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

export function ClientList() {
  const [clients, setClients] = useState<Client[]>(initialClients)
  const [searchQuery, setSearchQuery] = useState("")
  const [activeTab, setActiveTab] = useState("all")
  const [editingClient, setEditingClient] = useState<Client | null>(null)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)

  const router = useRouter()

  const filteredClients = clients.filter((client) => {
    // Filter by search query
    const matchesSearch =
      client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      client.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      client.phone.includes(searchQuery)

    // Filter by active status tab
    if (activeTab === "active") {
      return matchesSearch && client.isActive
    } else if (activeTab === "inactive") {
      return matchesSearch && !client.isActive
    }

    return matchesSearch
  })

  const handleEditClient = (client: Client) => {
    setEditingClient(client)
    setIsEditDialogOpen(true)
  }

  const handleToggleStatus = (clientId: number) => {
    setClients(clients.map((client) => (client.id === clientId ? { ...client, isActive: !client.isActive } : client)))
  }

  const handleViewClient = (clientId: number) => {
    router.push(`/clients/${clientId}`)
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Clients</h2>
        <Button>
          <Plus className="mr-2 h-4 w-4" /> Add New Client
        </Button>
      </div>

      <div className="flex items-center space-x-2">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search clients..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <Tabs defaultValue="all" onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="all">All Clients</TabsTrigger>
          <TabsTrigger value="active">Active</TabsTrigger>
          <TabsTrigger value="inactive">Inactive</TabsTrigger>
        </TabsList>
        <TabsContent value="all" className="mt-4">
          <ClientTable
            clients={filteredClients}
            onEdit={handleEditClient}
            onToggleStatus={handleToggleStatus}
            onView={handleViewClient}
          />
        </TabsContent>
        <TabsContent value="active" className="mt-4">
          <ClientTable
            clients={filteredClients}
            onEdit={handleEditClient}
            onToggleStatus={handleToggleStatus}
            onView={handleViewClient}
          />
        </TabsContent>
        <TabsContent value="inactive" className="mt-4">
          <ClientTable
            clients={filteredClients}
            onEdit={handleEditClient}
            onToggleStatus={handleToggleStatus}
            onView={handleViewClient}
          />
        </TabsContent>
      </Tabs>

      {editingClient && (
        <EditClientDialog
          client={editingClient}
          open={isEditDialogOpen}
          onOpenChange={setIsEditDialogOpen}
          onSave={(updatedClient) => {
            setClients(clients.map((client) => (client.id === updatedClient.id ? updatedClient : client)))
          }}
        />
      )}
    </div>
  )
}

interface ClientTableProps {
  clients: Client[]
  onEdit: (client: Client) => void
  onToggleStatus: (clientId: number) => void
  onView: (clientId: number) => void
}

function ClientTable({ clients, onEdit, onToggleStatus, onView }: ClientTableProps) {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Phone</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Type</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {clients.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center py-6 text-muted-foreground">
                No clients found
              </TableCell>
            </TableRow>
          ) : (
            clients.map((client) => (
              <TableRow key={client.id}>
                <TableCell className="font-medium">{client.name}</TableCell>
                <TableCell>{client.email}</TableCell>
                <TableCell>{client.phone}</TableCell>
                <TableCell>
                  <Badge variant={client.isActive ? "default" : "secondary"}>
                    {client.isActive ? "Active" : "Inactive"}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge variant={client.clientType === "regular" ? "outline" : "secondary"}>
                    {client.clientType === "regular" ? "Regular" : "One-time"}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                        <span className="sr-only">Open menu</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => onView(client.id)}>
                        <Eye className="mr-2 h-4 w-4" />
                        View Details
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => onEdit(client)}>
                        <Edit className="mr-2 h-4 w-4" />
                        Edit Client
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => onToggleStatus(client.id)}>
                        <ToggleLeft className="mr-2 h-4 w-4" />
                        {client.isActive ? "Mark as Inactive" : "Mark as Active"}
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  )
}

// Add the EditClientDialog component inline to ensure it's available
function EditClientDialog({
  client,
  open,
  onOpenChange,
  onSave,
}: {
  client: Client
  open: boolean
  onOpenChange: (open: boolean) => void
  onSave: (client: Client) => void
}) {
  const [isPending, setIsPending] = useState(false)
  const [formData, setFormData] = useState({
    name: client.name,
    email: client.email,
    phone: client.phone,
    address: client.address,
    notes: client.notes || "",
    isActive: client.isActive,
    clientType: client.clientType,
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleToggleChange = (checked: boolean) => {
    setFormData((prev) => ({ ...prev, isActive: checked }))
  }

  const handleTypeChange = (value: "regular" | "one-time") => {
    setFormData((prev) => ({ ...prev, clientType: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsPending(true)

    try {
      // In a real app, you would make an API call to update the client
      // For now, we'll just simulate a delay
      await new Promise((resolve) => setTimeout(resolve, 1000))

      const updatedClient: Client = {
        ...client,
        ...formData,
      }

      onSave(updatedClient)
      onOpenChange(false)
    } catch (error) {
      console.error("Failed to update client:", error)
    } finally {
      setIsPending(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Edit Client</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-4">
            <div className="grid grid-cols-1 gap-4">
              <div className="space-y-2">
                <label htmlFor="name" className="text-sm font-medium">
                  Name
                </label>
                <Input id="name" name="name" value={formData.name} onChange={handleChange} required />
              </div>

              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium">
                  Email
                </label>
                <Input id="email" name="email" type="email" value={formData.email} onChange={handleChange} required />
              </div>

              <div className="space-y-2">
                <label htmlFor="phone" className="text-sm font-medium">
                  Phone
                </label>
                <Input id="phone" name="phone" value={formData.phone} onChange={handleChange} required />
              </div>

              <div className="space-y-2">
                <label htmlFor="address" className="text-sm font-medium">
                  Address
                </label>
                <Input id="address" name="address" value={formData.address} onChange={handleChange} required />
              </div>

              <div className="space-y-2">
                <label htmlFor="notes" className="text-sm font-medium">
                  Notes
                </label>
                <textarea
                  id="notes"
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  className="w-full min-h-[100px] px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Client Type</label>
                <div className="flex space-x-4">
                  <label className="flex items-center space-x-2">
                    <input
                      type="radio"
                      checked={formData.clientType === "regular"}
                      onChange={() => handleTypeChange("regular")}
                      className="h-4 w-4"
                    />
                    <span>Regular</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input
                      type="radio"
                      checked={formData.clientType === "one-time"}
                      onChange={() => handleTypeChange("one-time")}
                      className="h-4 w-4"
                    />
                    <span>One-time</span>
                  </label>
                </div>
              </div>

              <div className="flex items-center justify-between rounded-lg border p-4">
                <div>
                  <h4 className="text-sm font-medium">Active Status</h4>
                  <p className="text-sm text-muted-foreground">
                    {formData.isActive ? "Client is currently active" : "Client is currently inactive"}
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isActive}
                    onChange={(e) => handleToggleChange(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                </label>
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}

