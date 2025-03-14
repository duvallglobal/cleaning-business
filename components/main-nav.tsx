"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import {
  Calendar,
  Home,
  LayoutDashboard,
  Megaphone,
  Package,
  Settings,
  Users,
  Users2,
  ExternalLink,
} from "lucide-react"

const navigation = [
  { name: "Dashboard", href: "/", icon: LayoutDashboard },
  { name: "Calendar", href: "/calendar", icon: Calendar },
  { name: "Clients", href: "/clients", icon: Users },
  { name: "Employees", href: "/employees", icon: Users2 },
  { name: "Services", href: "/services", icon: Package },
  { name: "Marketing", href: "/marketing", icon: Megaphone },
  { name: "Settings", href: "/settings", icon: Settings },
  { name: "Client Portal", href: "/client-portal", icon: ExternalLink },
]

export function MainNav() {
  const pathname = usePathname()

  return (
    <nav className="border-b">
      <div className="container mx-auto flex h-16 items-center px-4">
        <Link href="/" className="flex items-center gap-2 font-semibold">
          <Home className="h-6 w-6" />
          <span>CleanPro Manager</span>
        </Link>
        <div className="ml-8 hidden md:block">
          <div className="flex gap-4">
            {navigation.map((item) => {
              const Icon = item.icon
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-muted",
                    pathname === item.href ? "bg-muted" : "text-muted-foreground",
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {item.name}
                </Link>
              )
            })}
          </div>
        </div>
      </div>
    </nav>
  )
}

