import type React from "react"
import { ClientPortalNav } from "@/components/client-portal/nav"
import { ClientAuthProvider } from "@/components/client-portal/auth-provider"
import { Toaster } from "@/components/ui/toaster"

export default function ClientPortalLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ClientAuthProvider>
      <div className="min-h-screen bg-gray-50">
        <ClientPortalNav />
        <main className="container mx-auto p-4 md:p-8">{children}</main>
        <Toaster />
      </div>
    </ClientAuthProvider>
  )
}

