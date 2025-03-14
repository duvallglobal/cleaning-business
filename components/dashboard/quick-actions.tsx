import { Button } from "@/components/ui/button"
import { CalendarPlus, UserPlus, ClipboardList, Settings, FileSpreadsheet } from "lucide-react"
import Link from "next/link"

export function QuickActions() {
  return (
    <div className="space-y-2">
      <Button asChild variant="outline" className="w-full justify-start">
        <Link href="/calendar">
          <CalendarPlus className="mr-2 h-4 w-4" />
          Schedule New Appointment
        </Link>
      </Button>

      <Button asChild variant="outline" className="w-full justify-start">
        <Link href="/clients">
          <UserPlus className="mr-2 h-4 w-4" />
          Add New Client
        </Link>
      </Button>

      <Button asChild variant="outline" className="w-full justify-start">
        <Link href="/employees">
          <ClipboardList className="mr-2 h-4 w-4" />
          Manage Employees
        </Link>
      </Button>

      <Button asChild variant="outline" className="w-full justify-start">
        <Link href="/reports">
          <FileSpreadsheet className="mr-2 h-4 w-4" />
          Generate Reports
        </Link>
      </Button>

      <Button asChild variant="outline" className="w-full justify-start">
        <Link href="/settings">
          <Settings className="mr-2 h-4 w-4" />
          Business Settings
        </Link>
      </Button>
    </div>
  )
}

