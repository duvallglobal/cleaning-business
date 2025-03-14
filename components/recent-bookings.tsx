import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

const bookings = [
  {
    client: "Sarah Thompson",
    service: "Deep Cleaning",
    date: "2024-02-19",
    amount: "$350.00",
    status: "Confirmed",
  },
  {
    client: "Michael Rodriguez",
    service: "Regular Maintenance",
    date: "2024-02-20",
    amount: "$150.00",
    status: "Pending",
  },
  {
    client: "Emily Chen",
    service: "Window Cleaning",
    date: "2024-02-21",
    amount: "$200.00",
    status: "Confirmed",
  },
  {
    client: "David Wilson",
    service: "Carpet Cleaning",
    date: "2024-02-22",
    amount: "$275.00",
    status: "Pending",
  },
]

export function RecentBookings() {
  return (
    <div className="space-y-8">
      {bookings.map((booking) => (
        <div key={booking.client} className="flex items-center">
          <Avatar className="h-9 w-9">
            <AvatarImage src={`/placeholder.svg`} alt={booking.client} />
            <AvatarFallback>
              {booking.client
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </AvatarFallback>
          </Avatar>
          <div className="ml-4 space-y-1">
            <p className="text-sm font-medium leading-none">{booking.client}</p>
            <p className="text-sm text-muted-foreground">
              {booking.service} - {booking.date}
            </p>
          </div>
          <div className="ml-auto font-medium">
            {booking.amount}
            <span
              className={`ml-2 inline-flex items-center rounded-full px-2 py-1 text-xs ${
                booking.status === "Confirmed" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"
              }`}
            >
              {booking.status}
            </span>
          </div>
        </div>
      ))}
    </div>
  )
}

