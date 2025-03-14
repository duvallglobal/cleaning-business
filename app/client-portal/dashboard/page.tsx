import type { Metadata } from "next"

import { QuickActions } from "@/components/client-portal/quick-actions"
import { RecentInvoices } from "@/components/client-portal/recent-invoices"
import { UpcomingServices } from "@/components/client-portal/upcoming-services"
import { WelcomeMessage } from "@/components/client-portal/welcome-message"

export const metadata: Metadata = {
  title: "Client Portal Dashboard",
  description: "View your upcoming services, recent invoices, and more.",
}

export default function ClientPortalDashboard() {
  return (
    <div className="flex flex-col gap-6 p-4 md:p-8">
      <WelcomeMessage />
      <QuickActions />
      <div className="grid gap-6 md:grid-cols-2">
        <UpcomingServices />
        <RecentInvoices />
      </div>
    </div>
  )
}

