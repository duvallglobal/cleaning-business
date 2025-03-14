import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { format } from "date-fns"
import Link from "next/link"

export function UpcomingAppointments() {
  // Sample upcoming appointments data
  const appointments = [
    {
      id: 1,
      client: {
        name: "John Smith",
        avatar: "/avatars/01.png",
        initials: "JS",
      },
      service: "Regular Cleaning",
      date: new Date(new Date().setDate(new Date().getDate() + 1)),
      time: "10:00 AM - 12:00 PM",
      status: "confirmed",
      address: "123 Main St, Anytown, USA",
    },
    {
      id: 2,
      client: {
        name: "Sarah Johnson",
        avatar: "/avatars/02.png",
        initials: "SJ",
      },
      service: "Deep Cleaning",
      date: new Date(new Date().setDate(new Date().getDate() + 2)),
      time: "1:00 PM - 4:00 PM",
      status: "pending",
      address: "456 Oak Ave, Somewhere, USA",
    },
    {
      id: 3,
      client: {
        name: "Michael Brown",
        avatar: "/avatars/03.png",
        initials: "MB",
      },
      service: "Window Cleaning",
      date: new Date(new Date().setDate(new Date().getDate() + 3)),
      time: "9:00 AM - 11:00 AM",
      status: "confirmed",
      address: "789 Pine Rd, Nowhere, USA",
    },
  ]

  return (
    <div className="space-y-4">
      {appointments.map((appointment) => (
        <div
          key={appointment.id}
          className="flex items-center justify-between space-x-4 rounded-md border p-4 transition-all hover:bg-accent"
        >
          <div className="flex items-center space-x-4">
            <Avatar>
              <AvatarImage src={appointment.client.avatar} alt={appointment.client.name} />
              <AvatarFallback>{appointment.client.initials}</AvatarFallback>
            </Avatar>
            <div>
              <p className="text-sm font-medium leading-none">{appointment.client.name}</p>
              <p className="text-sm text-muted-foreground">{appointment.service}</p>
              <div className="flex items-center pt-1">
                <p className="text-xs text-muted-foreground">
                  {format(appointment.date, "MMM dd")} • {appointment.time}
                </p>
                <Badge
                  variant={appointment.status === "confirmed" ? "default" : "secondary"}
                  className="ml-2 text-[10px]"
                >
                  {appointment.status}
                </Badge>
              </div>
            </div>
          </div>
          <Button size="sm" variant="outline" asChild>
            <Link href={`/calendar/${appointment.id}`}>View</Link>
          </Button>
        </div>
      ))}
      <Button variant="outline" className="w-full" asChild>
        <Link href="/calendar">View All Appointments</Link>
      </Button>
    </div>
  )
}

