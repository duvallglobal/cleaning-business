"use client"

import { useState, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Download, Search, Star, RefreshCw, FileText, Calendar, DollarSign, Clock } from "lucide-react"
import { useClientAuth } from "@/components/client-portal/auth-provider"
import { useToast } from "@/components/ui/use-toast"
import { downloadInvoice, submitServiceReview } from "@/lib/api/client-portal"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

interface ServiceRecord {
  id: number
  service: string
  date: string
  time: string
  cost: string
  team: string
  rating?: number
  review?: string
  invoiceUrl?: string
  details?: {
    bedrooms: number
    bathrooms: number
    additionalServices: string[]
  }
  invoiceId?: string
  paymentStatus?: "paid" | "pending" | "overdue"
  paymentDate?: string
}

interface Invoice {
  id: number
  invoiceId: string
  serviceId: number
  date: string
  dueDate: string
  amount: number
  status: "paid" | "pending" | "overdue"
  paymentDate?: string
  serviceName: string
  serviceDate: string
  lineItems: {
    description: string
    quantity: number
    unitPrice: number
    total: number
  }[]
}

const mockServiceHistory = [
  {
    id: 1,
    service: "Deep Cleaning",
    date: "2024-01-15",
    time: "09:00",
    cost: "$350",
    team: "Team A",
    rating: 5,
    review: "Excellent service! Very thorough and professional.",
    invoiceUrl: "/invoices/INV-001.pdf",
    details: {
      bedrooms: 3,
      bathrooms: 2,
      additionalServices: ["Window Cleaning"],
    },
    invoiceId: "INV-001",
    paymentStatus: "paid" as const,
    paymentDate: "2024-01-16",
  },
  {
    id: 2,
    service: "Window Cleaning",
    date: "2024-01-30",
    time: "14:00",
    cost: "$200",
    team: "Team B",
    rating: 4,
    review: "Good job overall. Windows are sparkling clean.",
    invoiceUrl: "/invoices/INV-002.pdf",
    details: {
      bedrooms: 0,
      bathrooms: 0,
      additionalServices: [],
    },
    invoiceId: "INV-002",
    paymentStatus: "paid" as const,
    paymentDate: "2024-01-31",
  },
  {
    id: 3,
    service: "Regular Maintenance",
    date: "2024-02-15",
    time: "10:00",
    cost: "$150",
    team: "Team A",
    invoiceUrl: "/invoices/INV-003.pdf",
    details: {
      bedrooms: 3,
      bathrooms: 2,
      additionalServices: [],
    },
    invoiceId: "INV-003",
    paymentStatus: "pending" as const,
  },
]

const mockInvoices: Invoice[] = [
  {
    id: 1,
    invoiceId: "INV-001",
    serviceId: 1,
    date: "2024-01-15",
    dueDate: "2024-01-22",
    amount: 350,
    status: "paid",
    paymentDate: "2024-01-16",
    serviceName: "Deep Cleaning",
    serviceDate: "2024-01-15",
    lineItems: [
      { description: "Base Cleaning Service", quantity: 1, unitPrice: 200, total: 200 },
      { description: "Bedroom Cleaning", quantity: 3, unitPrice: 30, total: 90 },
      { description: "Bathroom Cleaning", quantity: 2, unitPrice: 30, total: 60 },
    ],
  },
  {
    id: 2,
    invoiceId: "INV-002",
    serviceId: 2,
    date: "2024-01-30",
    dueDate: "2024-02-06",
    amount: 200,
    status: "paid",
    paymentDate: "2024-01-31",
    serviceName: "Window Cleaning",
    serviceDate: "2024-01-30",
    lineItems: [{ description: "Window Cleaning Service", quantity: 1, unitPrice: 200, total: 200 }],
  },
  {
    id: 3,
    invoiceId: "INV-003",
    serviceId: 3,
    date: "2024-02-15",
    dueDate: "2024-02-22",
    amount: 150,
    status: "pending",
    serviceName: "Regular Maintenance",
    serviceDate: "2024-02-15",
    lineItems: [
      { description: "Regular Maintenance Service", quantity: 1, unitPrice: 100, total: 100 },
      { description: "Bedroom Cleaning", quantity: 3, unitPrice: 10, total: 30 },
      { description: "Bathroom Cleaning", quantity: 2, unitPrice: 10, total: 20 },
    ],
  },
]

export default function HistoryPage() {
  const { client } = useClientAuth()
  const { toast } = useToast()
  const [searchTerm, setSearchTerm] = useState("")
  const [serviceHistory, setServiceHistory] = useState<ServiceRecord[]>([])
  const [invoices, setInvoices] = useState<Invoice[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedService, setSelectedService] = useState<ServiceRecord | null>(null)
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null)
  const [downloadingId, setDownloadingId] = useState<number | null>(null)
  const [reviewData, setReviewData] = useState({
    rating: 5,
    review: "",
  })

  const fetchData = useCallback(async () => {
    if (!client?.id) return

    setIsLoading(true)
    setError(null)
    try {
      // const data = await fetchServiceHistory(client.id)
      // setServiceHistory(data)
      setServiceHistory(mockServiceHistory)
      setInvoices(mockInvoices)
    } catch (err) {
      console.error("Error fetching service history:", err)
      setError("Failed to load service history. Please try again.")
      toast({
        title: "Error",
        description: "Failed to load service history. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }, [client?.id, toast])

  useEffect(() => {
    if (client) {
      fetchData()
    }
  }, [client, fetchData])

  const handleDownload = async (serviceId: number) => {
    setDownloadingId(serviceId)
    try {
      const success = await downloadInvoice(serviceId)
      if (success) {
        toast({
          title: "Invoice Downloaded",
          description: "The invoice has been downloaded successfully.",
        })
      } else {
        throw new Error("Download failed")
      }
    } catch (err) {
      console.error("Error downloading invoice:", err)
      toast({
        title: "Download Failed",
        description: "There was an error downloading the invoice. Please try again.",
        variant: "destructive",
      })
    } finally {
      setDownloadingId(null)
    }
  }

  const handleAddReview = async (serviceId: number) => {
    try {
      await submitServiceReview(serviceId, reviewData.rating, reviewData.review)

      // Update local state
      setServiceHistory(
        serviceHistory.map((record) =>
          record.id === serviceId ? { ...record, rating: reviewData.rating, review: reviewData.review } : record,
        ),
      )

      toast({
        title: "Review Submitted",
        description: "Thank you for your feedback!",
      })

      // Reset form
      setReviewData({ rating: 5, review: "" })
      setSelectedService(null)
    } catch (err) {
      console.error("Error submitting review:", err)
      toast({
        title: "Submission Failed",
        description: "There was an error submitting your review. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleViewInvoice = (invoice: Invoice) => {
    setSelectedInvoice(invoice)
  }

  if (!client) {
    return <div>Loading...</div>
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Service History</h1>
        <div className="flex items-center gap-2">
          <div className="relative w-64">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search history..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8"
            />
          </div>
          <Button variant="outline" onClick={fetchData} disabled={isLoading} className="flex items-center gap-2">
            <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
            Refresh
          </Button>
        </div>
      </div>

      {error && <div className="rounded-md bg-destructive/15 p-4 text-destructive">{error}</div>}

      <Tabs defaultValue="services">
        <TabsList>
          <TabsTrigger value="services">Services</TabsTrigger>
          <TabsTrigger value="invoices">Invoices</TabsTrigger>
        </TabsList>

        <TabsContent value="services" className="space-y-4">
          {isLoading ? (
            <div className="space-y-4">
              <div className="h-40 animate-pulse rounded bg-muted"></div>
              <div className="h-40 animate-pulse rounded bg-muted"></div>
            </div>
          ) : serviceHistory.length === 0 ? (
            <div className="flex h-40 items-center justify-center rounded-lg border border-dashed">
              <p className="text-center text-muted-foreground">No service history found</p>
            </div>
          ) : (
            serviceHistory
              .filter((record) => record.service.toLowerCase().includes(searchTerm.toLowerCase()))
              .map((record) => (
                <Card key={record.id}>
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold">{record.service}</h3>
                          {record.paymentStatus && (
                            <Badge
                              variant={
                                record.paymentStatus === "paid"
                                  ? "outline"
                                  : record.paymentStatus === "pending"
                                    ? "secondary"
                                    : "destructive"
                              }
                            >
                              {record.paymentStatus}
                            </Badge>
                          )}
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Calendar className="h-4 w-4" />
                          <span>
                            {new Date(record.date).toLocaleDateString("en-US", {
                              weekday: "short",
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            })}
                          </span>
                          <Clock className="h-4 w-4 ml-2" />
                          <span>{record.time}</span>
                        </div>
                        <p className="text-sm text-muted-foreground">Team: {record.team}</p>
                        {record.details && (
                          <div className="mt-2 text-sm">
                            <p>
                              {record.details.bedrooms > 0 &&
                                `${record.details.bedrooms} bedroom${record.details.bedrooms !== 1 ? "s" : ""}`}
                              {record.details.bedrooms > 0 && record.details.bathrooms > 0 && ", "}
                              {record.details.bathrooms > 0 &&
                                `${record.details.bathrooms} bathroom${record.details.bathrooms !== 1 ? "s" : ""}`}
                            </p>
                            {record.details.additionalServices.length > 0 && (
                              <p className="text-muted-foreground">
                                Additional services: {record.details.additionalServices.join(", ")}
                              </p>
                            )}
                          </div>
                        )}
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">{record.cost}</p>
                        <div className="mt-2 flex flex-col gap-2">
                          {record.invoiceUrl && (
                            <Button
                              variant="outline"
                              size="sm"
                              className="justify-center"
                              disabled={downloadingId === record.id}
                              onClick={() => handleDownload(record.id)}
                            >
                              <Download className="mr-2 h-4 w-4" />
                              {downloadingId === record.id ? "Downloading..." : "Invoice"}
                            </Button>
                          )}
                          {record.invoiceId && (
                            <Button
                              variant="outline"
                              size="sm"
                              className="justify-center"
                              onClick={() => {
                                const invoice = mockInvoices.find((inv) => inv.invoiceId === record.invoiceId)
                                if (invoice) handleViewInvoice(invoice)
                              }}
                            >
                              <FileText className="mr-2 h-4 w-4" />
                              View Invoice
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                    {record.rating ? (
                      <div className="mt-4 space-y-2 border-t pt-4">
                        <div className="flex items-center gap-1">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star
                              key={i}
                              className={`h-4 w-4 ${
                                i < record.rating! ? "fill-yellow-400 text-yellow-400" : "text-gray-200"
                              }`}
                            />
                          ))}
                          <span className="ml-2 text-sm text-muted-foreground">Your rating</span>
                        </div>
                        {record.review && <p className="text-sm text-muted-foreground">{record.review}</p>}
                      </div>
                    ) : (
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            className="mt-4"
                            onClick={() => setSelectedService(record)}
                          >
                            Add Review
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Leave a Review</DialogTitle>
                          </DialogHeader>
                          <div className="space-y-4 py-4">
                            <div className="space-y-2">
                              <Label>Service</Label>
                              <p className="font-medium">{selectedService?.service}</p>
                              <p className="text-sm text-muted-foreground">
                                {selectedService?.date} at {selectedService?.time}
                              </p>
                            </div>
                            <div className="space-y-2">
                              <Label>Rating</Label>
                              <div className="flex items-center gap-1">
                                {Array.from({ length: 5 }).map((_, i) => (
                                  <button
                                    key={i}
                                    type="button"
                                    onClick={() => setReviewData({ ...reviewData, rating: i + 1 })}
                                    className="focus:outline-none"
                                  >
                                    <Star
                                      className={`h-6 w-6 ${
                                        i < reviewData.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-200"
                                      }`}
                                    />
                                  </button>
                                ))}
                              </div>
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="review">Review</Label>
                              <Textarea
                                id="review"
                                placeholder="Share your experience..."
                                value={reviewData.review}
                                onChange={(e) => setReviewData({ ...reviewData, review: e.target.value })}
                              />
                            </div>
                            <Button
                              className="w-full"
                              onClick={() => selectedService && handleAddReview(selectedService.id)}
                            >
                              Submit Review
                            </Button>
                          </div>
                        </DialogContent>
                      </Dialog>
                    )}
                  </CardContent>
                </Card>
              ))
          )}
        </TabsContent>

        <TabsContent value="invoices" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Invoices</CardTitle>
              <CardDescription>View and download your service invoices</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="space-y-4">
                  <div className="h-20 animate-pulse rounded bg-muted"></div>
                  <div className="h-20 animate-pulse rounded bg-muted"></div>
                </div>
              ) : invoices.length === 0 ? (
                <div className="flex h-20 items-center justify-center rounded-lg border border-dashed">
                  <p className="text-center text-muted-foreground">No invoices found</p>
                </div>
              ) : (
                <div className="overflow-hidden rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Invoice #</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Service</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {invoices
                        .filter(
                          (invoice) =>
                            invoice.serviceName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            invoice.invoiceId.toLowerCase().includes(searchTerm.toLowerCase()),
                        )
                        .map((invoice) => (
                          <TableRow key={invoice.id}>
                            <TableCell className="font-medium">{invoice.invoiceId}</TableCell>
                            <TableCell>{new Date(invoice.date).toLocaleDateString()}</TableCell>
                            <TableCell>{invoice.serviceName}</TableCell>
                            <TableCell>${invoice.amount.toFixed(2)}</TableCell>
                            <TableCell>
                              <Badge
                                variant={
                                  invoice.status === "paid"
                                    ? "outline"
                                    : invoice.status === "pending"
                                      ? "secondary"
                                      : "destructive"
                                }
                              >
                                {invoice.status}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex justify-end gap-2">
                                <Button variant="outline" size="sm" onClick={() => handleViewInvoice(invoice)}>
                                  <FileText className="mr-2 h-4 w-4" />
                                  View
                                </Button>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  disabled={downloadingId === invoice.serviceId}
                                  onClick={() => handleDownload(invoice.serviceId)}
                                >
                                  <Download className="mr-2 h-4 w-4" />
                                  Download
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Invoice Detail Dialog */}
      <Dialog open={!!selectedInvoice} onOpenChange={(open) => !open && setSelectedInvoice(null)}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Invoice {selectedInvoice?.invoiceId}</DialogTitle>
          </DialogHeader>
          {selectedInvoice && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Bill To</h3>
                  <p className="font-medium">{client.name}</p>
                  <p className="text-sm">{client.email}</p>
                  {client.address && <p className="text-sm">{client.address}</p>}
                </div>
                <div className="text-right">
                  <div className="space-y-1">
                    <div className="flex justify-between">
                      <span className="text-sm font-medium text-muted-foreground">Invoice Date:</span>
                      <span>{new Date(selectedInvoice.date).toLocaleDateString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm font-medium text-muted-foreground">Due Date:</span>
                      <span>{new Date(selectedInvoice.dueDate).toLocaleDateString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm font-medium text-muted-foreground">Status:</span>
                      <Badge
                        variant={
                          selectedInvoice.status === "paid"
                            ? "outline"
                            : selectedInvoice.status === "pending"
                              ? "secondary"
                              : "destructive"
                        }
                      >
                        {selectedInvoice.status}
                      </Badge>
                    </div>
                    {selectedInvoice.paymentDate && (
                      <div className="flex justify-between">
                        <span className="text-sm font-medium text-muted-foreground">Payment Date:</span>
                        <span>{new Date(selectedInvoice.paymentDate).toLocaleDateString()}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[50%]">Description</TableHead>
                      <TableHead>Quantity</TableHead>
                      <TableHead>Unit Price</TableHead>
                      <TableHead className="text-right">Total</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {selectedInvoice.lineItems.map((item, index) => (
                      <TableRow key={index}>
                        <TableCell>{item.description}</TableCell>
                        <TableCell>{item.quantity}</TableCell>
                        <TableCell>${item.unitPrice.toFixed(2)}</TableCell>
                        <TableCell className="text-right">${item.total.toFixed(2)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              <div className="flex justify-between border-t pt-4">
                <div>
                  <h3 className="font-medium">Service Details</h3>
                  <p className="text-sm">
                    {selectedInvoice.serviceName} on {new Date(selectedInvoice.serviceDate).toLocaleDateString()}
                  </p>
                </div>
                <div className="text-right">
                  <div className="space-y-1">
                    <div className="flex justify-between">
                      <span className="mr-8 text-sm font-medium text-muted-foreground">Subtotal:</span>
                      <span>${selectedInvoice.amount.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="mr-8 text-sm font-medium text-muted-foreground">Tax:</span>
                      <span>$0.00</span>
                    </div>
                    <div className="flex justify-between font-medium">
                      <span className="mr-8 text-sm">Total:</span>
                      <span>${selectedInvoice.amount.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setSelectedInvoice(null)}>
                  Close
                </Button>
                <Button
                  variant="outline"
                  disabled={downloadingId === selectedInvoice.serviceId}
                  onClick={() => handleDownload(selectedInvoice.serviceId)}
                >
                  <Download className="mr-2 h-4 w-4" />
                  Download PDF
                </Button>
                {selectedInvoice.status === "pending" && (
                  <Button>
                    <DollarSign className="mr-2 h-4 w-4" />
                    Pay Now
                  </Button>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

