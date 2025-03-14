"use client"

import { useState } from "react"
import { Calendar } from "@/components/calendar/calendar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { AppointmentDetails } from "@/components/calendar/appointment-details"
import { AppointmentList } from "@/components/calendar/appointment-list"
import { CalendarPlus, Filter, Search } from "lucide-react"
import { addDays, format } from "date-fns"

export default function CalendarPage() {
  const [view, setView] = useState<"month" | "week" | "day" | "list">("month")
  const [date, setDate] = useState<Date>(new Date())
  const [selectedAppointment, setSelectedAppointment] = useState<number | null>(null)
  const [isDetailsOpen, setIsDetailsOpen] = useState(false)
  const [isFilterOpen, setIsFilterOpen] = useState(false)

  // Sample appointment types with colors
  const appointmentTypes = [
    { id: 1, name: "Regular Cleaning", color: "bg-blue-500" },
    { id: 2, name: "Deep Cleaning", color: "bg-purple-500" },
    { id: 3, name: "Window Cleaning", color: "bg-green-500" },
    { id: 4, name: "Move-in/Move-out", color: "bg-amber-500" },
    { id: 5, name: "Post-Construction", color: "bg-red-500" },
  ]

  // Sample appointments
  const appointments = [
    {
      id: 1,
      title: "Regular Cleaning - John Smith",
      date: new Date(),
      startTime: "10:00 AM",
      endTime: "12:00 PM",
      client: "John Smith",
      address: "123 Main St, Anytown, USA",
      type: 1,
      status: "confirmed",
      employees: ["Jane Doe", "Mike Johnson"],
    },
    {
      id: 2,
      title: "Deep Cleaning - Sarah Johnson",
      date: addDays(new Date(), 2),
      startTime: "1:00 PM",
      endTime: "4:00 PM",
      client: "Sarah Johnson",
      address: "456 Oak Ave, Somewhere, USA",
      type: 2,
      status: "pending",
      employees: ["Jane Doe", "Robert Wilson"],
    },
    {
      id: 3,
      title: "Window Cleaning - Michael Brown",
      date: addDays(new Date(), 3),
      startTime: "9:00 AM",
      endTime: "11:00 AM",
      client: "Michael Brown",
      address: "789 Pine Rd, Nowhere, USA",
      type: 3,
      status: "confirmed",
      employees: ["Mike Johnson"],
    },
  ]

  const handleAppointmentClick = (appointmentId: number) => {
    setSelectedAppointment(appointmentId)
    setIsDetailsOpen(true)
  }

  return (
    <div className="flex-1 space-y-6 p-6 md:p-8 pt-6">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between space-y-2 md:space-y-0">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Calendar</h2>
          <p className="text-muted-foreground">Manage your appointments and schedule.</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button>
            <CalendarPlus className="mr-2 h-4 w-4" />
            New Appointment
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-[1fr_300px] gap-6">
        <div className="space-y-6">
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <CardTitle>Appointments</CardTitle>
                  <CardDescription>{format(date, "MMMM yyyy")}</CardDescription>
                </div>
                <div className="flex items-center space-x-2">
                  <Tabs value={view} onValueChange={(v) => setView(v as any)}>
                    <TabsList>
                      <TabsTrigger value="month">Month</TabsTrigger>
                      <TabsTrigger value="week">Week</TabsTrigger>
                      <TabsTrigger value="day">Day</TabsTrigger>
                      <TabsTrigger value="list">List</TabsTrigger>
                    </TabsList>
                  </Tabs>
                  <Button variant="outline" size="icon" onClick={() => setIsFilterOpen(!isFilterOpen)}>
                    <Filter className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {isFilterOpen && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4 pt-4 border-t">
                  <div>
                    <label className="text-sm font-medium mb-1 block">Service Type</label>
                    <Select defaultValue="all">
                      <SelectTrigger>
                        <SelectValue placeholder="All Services" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Services</SelectItem>
                        {appointmentTypes.map((type) => (
                          <SelectItem key={type.id} value={type.id.toString()}>
                            {type.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-1 block">Employee</label>
                    <Select defaultValue="all">
                      <SelectTrigger>
                        <SelectValue placeholder="All Employees" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Employees</SelectItem>
                        <SelectItem value="1">Jane Doe</SelectItem>
                        <SelectItem value="2">Mike Johnson</SelectItem>
                        <SelectItem value="3">Robert Wilson</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-1 block">Status</label>
                    <Select defaultValue="all">
                      <SelectTrigger>
                        <SelectValue placeholder="All Statuses" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Statuses</SelectItem>
                        <SelectItem value="confirmed">Confirmed</SelectItem>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="cancelled">Cancelled</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              )}
            </CardHeader>
            <CardContent>
              {view === "list" ? (
                <AppointmentList
                  appointments={appointments}
                  appointmentTypes={appointmentTypes}
                  onAppointmentClick={handleAppointmentClick}
                />
              ) : (
                <Calendar
                  view={view}
                  date={date}
                  onDateChange={setDate}
                  appointments={appointments}
                  appointmentTypes={appointmentTypes}
                  onAppointmentClick={handleAppointmentClick}
                />
              )}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Legend</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {appointmentTypes.map((type) => (
                  <div key={type.id} className="flex items-center">
                    <div className={`w-4 h-4 rounded-full ${type.color} mr-2`}></div>
                    <span>{type.name}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Today's Schedule</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {appointments
                  .filter((app) => format(app.date, "yyyy-MM-dd") === format(new Date(), "yyyy-MM-dd"))
                  .map((appointment) => (
                    <div
                      key={appointment.id}
                      className="p-3 border rounded-md cursor-pointer hover:bg-accent"
                      onClick={() => handleAppointmentClick(appointment.id)}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <p className="font-medium">{appointment.client}</p>
                        <Badge variant={appointment.status === "confirmed" ? "default" : "secondary"}>
                          {appointment.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {appointment.startTime} - {appointment.endTime}
                      </p>
                      <p className="text-sm text-muted-foreground truncate">{appointment.address}</p>
                    </div>
                  ))}
                {appointments.filter((app) => format(app.date, "yyyy-MM-dd") === format(new Date(), "yyyy-MM-dd"))
                  .length === 0 && (
                  <p className="text-sm text-muted-foreground text-center py-4">No appointments scheduled for today</p>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Quick Search</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input type="search" placeholder="Search appointments..." className="pl-8" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {selectedAppointment && (
        <AppointmentDetails
          appointment={appointments.find((a) => a.id === selectedAppointment)!}
          appointmentTypes={appointmentTypes}
          open={isDetailsOpen}
          onOpenChange={setIsDetailsOpen}
        />
      )}
    </div>
  )
}

