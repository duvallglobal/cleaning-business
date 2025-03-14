"use client"

import { Badge } from "@/components/ui/badge"
import { format } from "date-fns"

interface Appointment {
  id: number
  title: string
  date: Date
  startTime: string
  endTime: string
  client: string
  address: string
  type: number
  status: string
  employees: string[]
}

interface AppointmentType {
  id: number
  name: string
  color: string
}

interface AppointmentListProps {
  appointments: Appointment[]
  appointmentTypes: AppointmentType[]
  onAppointmentClick: (appointmentId: number) => void
}

export function AppointmentList({ appointments, appointmentTypes, onAppointmentClick }: AppointmentListProps) {
  // Sort appointments by date and time
  const sortedAppointments = [...appointments].sort((a, b) => {
    const dateCompare = a.date.getTime() - b.date.getTime()
    if (dateCompare !== 0) return dateCompare

    return a.startTime.localeCompare(b.startTime)
  })

  return (
    <div className="space-y-4">
      {sortedAppointments.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-muted-foreground">No appointments found</p>
        </div>
      ) : (
        sortedAppointments.map((appointment) => {
          const appointmentType = appointmentTypes.find((type) => type.id === appointment.type)

          return (
            <div
              key={appointment.id}
              className="p-4 border rounded-lg cursor-pointer hover:bg-accent transition-colors"
              onClick={() => onAppointmentClick(appointment.id)}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center">
                  <div className={`w-3 h-3 rounded-full ${appointmentType?.color} mr-2`}></div>
                  <h3 className="font-medium">{appointment.client}</h3>
                </div>
                <Badge variant={appointment.status === "confirmed" ? "default" : "secondary"}>
                  {appointment.status}
                </Badge>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                <div>
                  <p className="text-muted-foreground">Date & Time:</p>
                  <p>
                    {format(appointment.date, "MMM d, yyyy")} • {appointment.startTime} - {appointment.endTime}
                  </p>
                </div>

                <div>
                  <p className="text-muted-foreground">Service:</p>
                  <p>{appointmentType?.name}</p>
                </div>

                <div>
                  <p className="text-muted-foreground">Address:</p>
                  <p className="truncate">{appointment.address}</p>
                </div>

                <div>
                  <p className="text-muted-foreground">Assigned to:</p>
                  <p>{appointment.employees.join(", ")}</p>
                </div>
              </div>
            </div>
          )
        })
      )}
    </div>
  )
}

