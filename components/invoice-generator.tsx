"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/components/ui/use-toast"
import { Calendar, Clock, DollarSign, Home, User } from "lucide-react"

interface InvoiceGeneratorProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  serviceId: number
  serviceName: string
  basePrice: number
  bedroomPrice: number
  bathroomPrice: number
}

export function InvoiceGenerator({
  open,
  onOpenChange,
  serviceId,
  serviceName,
  basePrice,
  bedroomPrice,
  bathroomPrice,
}: InvoiceGeneratorProps) {
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    clientId: "",
    clientName: "",
    serviceDate: new Date().toISOString().split("T")[0],
    bedrooms: 2,
    bathrooms: 1,
    additionalItems: [] as { name: string; price: number }[],
    additionalItemName: "",
    additionalItemPrice: 0,
    discount: 0,
    notes: "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]:
        name === "bedrooms" || name === "bathrooms" || name === "discount" || name === "additionalItemPrice"
          ? Number.parseFloat(value)
          : value,
    }))
  }

  const handleClientChange = (value: string) => {
    // In a real app, you would fetch client details based on the selected ID
    const clientNames: Record<string, string> = {
      "1": "Sarah Thompson",
      "2": "Michael Rodriguez",
      "3": "Emily Chen",
    }

    setFormData((prev) => ({
      ...prev,
      clientId: value,
      clientName: clientNames[value] || "",
    }))
  }

  const addAdditionalItem = () => {
    if (formData.additionalItemName && formData.additionalItemPrice > 0) {
      setFormData((prev) => ({
        ...prev,
        additionalItems: [...prev.additionalItems, { name: prev.additionalItemName, price: prev.additionalItemPrice }],
        additionalItemName: "",
        additionalItemPrice: 0,
      }))
    }
  }

  const removeAdditionalItem = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      additionalItems: prev.additionalItems.filter((_, i) => i !== index),
    }))
  }

  const calculateTotal = () => {
    const bedroomTotal = formData.bedrooms * bedroomPrice
    const bathroomTotal = formData.bathrooms * bathroomPrice
    const additionalTotal = formData.additionalItems.reduce((sum, item) => sum + item.price, 0)
    const subtotal = basePrice + bedroomTotal + bathroomTotal + additionalTotal
    const discountAmount = (formData.discount / 100) * subtotal
    return subtotal - discountAmount
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // In a real app, this would be an API call to create an invoice
      await new Promise((resolve) => setTimeout(resolve, 1000))

      toast({
        title: "Invoice Generated",
        description: `Invoice for ${formData.clientName} has been generated successfully.`,
      })
      onOpenChange(false)
    } catch (error) {
      console.error("Failed to generate invoice:", error)
      toast({
        title: "Error",
        description: "Failed to generate invoice. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Generate Invoice for {serviceName}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="clientId">Client</Label>
              <Select value={formData.clientId} onValueChange={handleClientChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Select client" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">Sarah Thompson</SelectItem>
                  <SelectItem value="2">Michael Rodriguez</SelectItem>
                  <SelectItem value="3">Emily Chen</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="serviceDate">Service Date</Label>
              <Input
                id="serviceDate"
                name="serviceDate"
                type="date"
                value={formData.serviceDate}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="rounded-md border p-4">
            <h3 className="mb-4 font-medium">Service Details</h3>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="bedrooms">Number of Bedrooms</Label>
                <Input
                  id="bedrooms"
                  name="bedrooms"
                  type="number"
                  min="0"
                  value={formData.bedrooms}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="bathrooms">Number of Bathrooms</Label>
                <Input
                  id="bathrooms"
                  name="bathrooms"
                  type="number"
                  min="0"
                  value={formData.bathrooms}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
          </div>

          <div className="rounded-md border p-4">
            <h3 className="mb-4 font-medium">Additional Items</h3>
            <div className="grid gap-4 md:grid-cols-3">
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="additionalItemName">Item Description</Label>
                <Input
                  id="additionalItemName"
                  name="additionalItemName"
                  value={formData.additionalItemName}
                  onChange={handleChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="additionalItemPrice">Price ($)</Label>
                <div className="flex gap-2">
                  <Input
                    id="additionalItemPrice"
                    name="additionalItemPrice"
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.additionalItemPrice || ""}
                    onChange={handleChange}
                  />
                  <Button type="button" onClick={addAdditionalItem} className="shrink-0">
                    Add
                  </Button>
                </div>
              </div>
            </div>

            {formData.additionalItems.length > 0 && (
              <div className="mt-4 space-y-2">
                <h4 className="text-sm font-medium">Added Items:</h4>
                <div className="rounded-md bg-muted p-2">
                  {formData.additionalItems.map((item, index) => (
                    <div key={index} className="flex items-center justify-between py-1">
                      <span>{item.name}</span>
                      <div className="flex items-center gap-2">
                        <span>${item.price.toFixed(2)}</span>
                        <Button type="button" variant="ghost" size="sm" onClick={() => removeAdditionalItem(index)}>
                          Remove
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="discount">Discount (%)</Label>
              <Input
                id="discount"
                name="discount"
                type="number"
                min="0"
                max="100"
                value={formData.discount}
                onChange={handleChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="notes">Notes</Label>
              <Input
                id="notes"
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                placeholder="Any special instructions or notes"
              />
            </div>
          </div>

          <div className="rounded-md bg-muted p-4">
            <h3 className="mb-4 font-medium">Invoice Summary</h3>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <span>Client:</span>
                </div>
                <span className="font-medium">{formData.clientName || "Not selected"}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span>Date:</span>
                </div>
                <span>{formData.serviceDate}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Home className="h-4 w-4 text-muted-foreground" />
                  <span>Service:</span>
                </div>
                <span>{serviceName}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span>Base Price:</span>
                </div>
                <span>${basePrice.toFixed(2)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>
                  Bedrooms ({formData.bedrooms} × ${bedroomPrice}):
                </span>
                <span>${(formData.bedrooms * bedroomPrice).toFixed(2)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>
                  Bathrooms ({formData.bathrooms} × ${bathroomPrice}):
                </span>
                <span>${(formData.bathrooms * bathroomPrice).toFixed(2)}</span>
              </div>
              {formData.additionalItems.length > 0 && (
                <div className="flex items-center justify-between">
                  <span>Additional Items:</span>
                  <span>${formData.additionalItems.reduce((sum, item) => sum + item.price, 0).toFixed(2)}</span>
                </div>
              )}
              {formData.discount > 0 && (
                <div className="flex items-center justify-between">
                  <span>Discount ({formData.discount}%):</span>
                  <span className="text-green-600">-${((formData.discount / 100) * calculateTotal()).toFixed(2)}</span>
                </div>
              )}
              <div className="flex items-center justify-between border-t pt-2">
                <div className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4 text-green-600" />
                  <span className="font-medium">Total:</span>
                </div>
                <span className="text-lg font-bold">${calculateTotal().toFixed(2)}</span>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading || !formData.clientId}>
              {isLoading ? "Generating..." : "Generate Invoice"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}

