"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChevronRightIcon, FileTextIcon } from "lucide-react"
import { downloadInvoice } from "@/lib/api/client-portal"
import { useToast } from "@/components/ui/use-toast"
import Link from "next/link"
import { getRecentInvoices } from "@/lib/services/invoice-service"

interface Invoice {
  id: string
  invoiceId: string
  date: string
  amount: number
  status: "paid" | "pending" | "overdue"
}

export function RecentInvoices() {
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [invoices, setInvoices] = useState<Invoice[]>([])
  const [error, setError] = useState<string | null>(null)
  const [downloadingId, setDownloadingId] = useState<number | null>(null)
  const [loading, setLoading] = useState(false) // Changed from true to false initially

  useEffect(() => {
    const fetchInvoices = async () => {
      try {
        setLoading(true)
        // Simulate data fetch - replace with actual Firebase fetch
        const data = await getRecentInvoices()
        setInvoices(data)
      } catch (error) {
        console.error("Error fetching recent invoices:", error)
      } finally {
        setLoading(false)
      }
    }

    // Immediately invoke the function
    fetchInvoices()

    // Add a cleanup function to prevent state updates on unmounted component
    return () => {
      // Cleanup logic if needed
    }
  }, []) // Empty dependency array means this runs once on mount

  // Provide fallback data if invoices is empty to prevent loading state
  const displayInvoices =
    invoices.length > 0
      ? invoices
      : [
          {
            id: "placeholder-1",
            invoiceId: "No recent invoices",
            date: "N/A",
            amount: 0,
            status: "paid",
          },
        ]

  const handleDownload = async (invoiceId: number) => {
    setDownloadingId(invoiceId)
    try {
      const success = await downloadInvoice(invoiceId)
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

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Recent Invoices</CardTitle>
          <CardDescription>Your recent billing history</CardDescription>
        </div>
        <Link href="/client-portal/invoices">
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
            {displayInvoices.map((invoice) => (
              <div key={invoice.id} className="flex items-center justify-between rounded-lg border p-3">
                <div className="flex items-center gap-4">
                  <div className="rounded-full bg-primary/10 p-2">
                    <FileTextIcon className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <div className="font-medium">{invoice.invoiceId}</div>
                    <div className="text-sm text-muted-foreground">{invoice.date}</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {invoice.amount > 0 && (
                    <>
                      <div className="text-right">
                        <div className="font-medium">${invoice.amount.toFixed(2)}</div>
                        <div
                          className={`text-xs ${
                            invoice.status === "paid"
                              ? "text-green-500"
                              : invoice.status === "overdue"
                                ? "text-red-500"
                                : "text-yellow-500"
                          }`}
                        >
                          {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
                        </div>
                      </div>
                      {invoice.status !== "paid" && (
                        <Button size="sm" variant="default">
                          Pay Now
                        </Button>
                      )}
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

