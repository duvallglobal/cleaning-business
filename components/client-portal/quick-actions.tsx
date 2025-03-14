import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar, MessageSquare, CreditCard, FileText, Clock, Home } from "lucide-react"
import Link from "next/link"

export function QuickActions() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Quick Actions</CardTitle>
        <CardDescription>Common tasks and actions</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Button variant="outline" className="h-24 flex-col" asChild>
            <Link href="/client-portal/bookings">
              <Calendar className="mb-2 h-5 w-5" />
              Schedule Service
            </Link>
          </Button>
          <Button variant="outline" className="h-24 flex-col" asChild>
            <Link href="/client-portal/messages">
              <MessageSquare className="mb-2 h-5 w-5" />
              Contact Support
            </Link>
          </Button>
          <Button variant="outline" className="h-24 flex-col" asChild>
            <Link href="/client-portal/history?tab=invoices">
              <CreditCard className="mb-2 h-5 w-5" />
              View Invoices
            </Link>
          </Button>
          <Button variant="outline" className="h-24 flex-col" asChild>
            <Link href="/client-portal/history">
              <Clock className="mb-2 h-5 w-5" />
              Service History
            </Link>
          </Button>
          <Button variant="outline" className="h-24 flex-col" asChild>
            <Link href="/client-portal/profile">
              <Home className="mb-2 h-5 w-5" />
              Update Address
            </Link>
          </Button>
          <Button variant="outline" className="h-24 flex-col" asChild>
            <Link href="/client-portal/bookings">
              <FileText className="mb-2 h-5 w-5" />
              Recurring Services
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

