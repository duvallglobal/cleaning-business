"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Pencil, Plus, Trash } from "lucide-react"
import { Textarea } from "@/components/ui/textarea"
import { useState } from "react"
import { InvoiceGenerator } from "@/components/invoice-generator"

const services = [
  {
    id: 1,
    name: "Deep Cleaning",
    description: "Thorough cleaning of all surfaces, including hard-to-reach areas",
    duration: "4-6 hours",
    basePrice: 200,
    pricingOptions: {
      bedroomPrice: 50,
      bathroomPrice: 75,
    },
  },
  {
    id: 2,
    name: "Regular Maintenance",
    description: "Weekly or bi-weekly cleaning to maintain cleanliness",
    duration: "2-3 hours",
    basePrice: 100,
    pricingOptions: {
      bedroomPrice: 25,
      bathroomPrice: 40,
    },
  },
  {
    id: 3,
    name: "Window Cleaning",
    description: "Professional cleaning of all windows, inside and out",
    duration: "2-4 hours",
    basePrice: 150,
    pricingOptions: {
      bedroomPrice: 20,
      bathroomPrice: 0,
    },
  },
  {
    id: 4,
    name: "Carpet Cleaning",
    description: "Deep cleaning of carpets using professional equipment",
    duration: "3-5 hours",
    basePrice: 200,
    pricingOptions: {
      bedroomPrice: 40,
      bathroomPrice: 0,
    },
  },
]

export default function ServicesPage() {
  const [invoiceDialogOpen, setInvoiceDialogOpen] = useState(false)
  const [selectedService, setSelectedService] = useState<(typeof services)[0] | null>(null)

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Services</h1>
        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Service
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Service</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Service Name</Label>
                <Input id="name" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="description">Description</Label>
                <Textarea id="description" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="duration">Duration</Label>
                <Input id="duration" placeholder="e.g., 2-3 hours" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="basePrice">Base Price ($)</Label>
                <Input id="basePrice" type="number" min="0" step="0.01" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="bedroomPrice">Per Bedroom Price ($)</Label>
                  <Input id="bedroomPrice" type="number" min="0" step="0.01" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="bathroomPrice">Per Bathroom Price ($)</Label>
                  <Input id="bathroomPrice" type="number" min="0" step="0.01" />
                </div>
              </div>
              <Button>Save Service</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {services.map((service) => (
          <Card key={service.id}>
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-semibold">{service.name}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">{service.description}</p>
                </div>
                <div className="flex gap-2">
                  <Button variant="ghost" size="icon">
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon">
                    <Trash className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <div className="mt-4 flex items-center justify-between text-sm">
                <div className="text-muted-foreground">Duration: {service.duration}</div>
                <div className="font-medium">${service.basePrice}</div>
              </div>
              <div className="mt-2 space-y-2 rounded-md bg-muted p-3 text-sm">
                <h4 className="font-medium">Pricing Options:</h4>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <span className="text-muted-foreground">Per Bedroom:</span> ${service.pricingOptions.bedroomPrice}
                  </div>
                  <div>
                    <span className="text-muted-foreground">Per Bathroom:</span> ${service.pricingOptions.bathroomPrice}
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-2 w-full"
                  onClick={() => {
                    setSelectedService(service)
                    setInvoiceDialogOpen(true)
                  }}
                >
                  Generate Invoice
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      {selectedService && (
        <InvoiceGenerator
          open={invoiceDialogOpen}
          onOpenChange={setInvoiceDialogOpen}
          serviceId={selectedService.id}
          serviceName={selectedService.name}
          basePrice={selectedService.basePrice}
          bedroomPrice={selectedService.pricingOptions.bedroomPrice}
          bathroomPrice={selectedService.pricingOptions.bathroomPrice}
        />
      )}
    </div>
  )
}

