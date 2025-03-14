"use client"

import React from "react"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"
import {
  addDays,
  addMonths,
  addWeeks,
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  format,
  isSameDay,
  isSameMonth,
  startOfMonth,
  startOfWeek,
  subMonths,
  subWeeks,
} from "date-fns"

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

interface CalendarProps {
  view: "month" | "week" | "day"
  date: Date
  onDateChange: (date: Date) => void
  appointments: Appointment[]
  appointmentTypes: AppointmentType[]
  onAppointmentClick: (appointmentId: number) => void
}

export function Calendar({
  view,
  date,
  onDateChange,
  appointments,
  appointmentTypes,
  onAppointmentClick,
}: CalendarProps) {
  const handlePrevious = () => {
    if (view === "month") {
      onDateChange(subMonths(date, 1))
    } else if (view === "week") {
      onDateChange(subWeeks(date, 1))
    } else if (view === "day") {
      onDateChange(addDays(date, -1))
    }
  }

  const handleNext = () => {
    if (view === "month") {
      onDateChange(addMonths(date, 1))
    } else if (view === "week") {
      onDateChange(addWeeks(date, 1))
    } else if (view === "day") {
      onDateChange(addDays(date, 1))
    }
  }

  const handleToday = () => {
    onDateChange(new Date())
  }

  if (view === "month") {
    return (
      <MonthView
        date={date}
        appointments={appointments}
        appointmentTypes={appointmentTypes}
        onAppointmentClick={onAppointmentClick}
        onPrevious={handlePrevious}
        onNext={handleNext}
        onToday={handleToday}
      />
    )
  } else if (view === "week") {
    return (
      <WeekView
        date={date}
        appointments={appointments}
        appointmentTypes={appointmentTypes}
        onAppointmentClick={onAppointmentClick}
        onPrevious={handlePrevious}
        onNext={handleNext}
        onToday={handleToday}
      />
    )
  } else {
    return (
      <DayView
        date={date}
        appointments={appointments}
        appointmentTypes={appointmentTypes}
        onAppointmentClick={onAppointmentClick}
        onPrevious={handlePrevious}
        onNext={handleNext}
        onToday={handleToday}
      />
    )
  }
}

interface CalendarViewProps {
  date: Date
  appointments: Appointment[]
  appointmentTypes: AppointmentType[]
  onAppointmentClick: (appointmentId: number) => void
  onPrevious: () => void
  onNext: () => void
  onToday: () => void
}

function MonthView({
  date,
  appointments,
  appointmentTypes,
  onAppointmentClick,
  onPrevious,
  onNext,
  onToday,
}: CalendarViewProps) {
  const monthStart = startOfMonth(date)
  const monthEnd = endOfMonth(monthStart)
  const startDate = startOfWeek(monthStart, { weekStartsOn: 0 })
  const endDate = endOfWeek(monthEnd, { weekStartsOn: 0 })

  const days = eachDayOfInterval({ start: startDate, end: endDate })
  const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">{format(date, "MMMM yyyy")}</h2>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm" onClick={onPrevious}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="sm" onClick={onToday}>
            Today
          </Button>
          <Button variant="outline" size="sm" onClick={onNext}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-px bg-muted rounded-lg overflow-hidden">
        {weekdays.map((day) => (
          <div key={day} className="bg-background p-2 text-center text-sm font-medium">
            {day}
          </div>
        ))}

        {days.map((day, dayIdx) => {
          const dayAppointments = appointments.filter((appointment) => isSameDay(appointment.date, day))

          return (
            <div
              key={day.toString()}
              className={`min-h-[100px] bg-background p-2 ${
                !isSameMonth(day, monthStart) ? "text-muted-foreground" : isSameDay(day, new Date()) ? "bg-accent" : ""
              }`}
            >
              <div className="font-medium text-sm">{format(day, "d")}</div>
              <div className="mt-1 space-y-1 max-h-[80px] overflow-y-auto">
                {dayAppointments.map((appointment) => {
                  const appointmentType = appointmentTypes.find((type) => type.id === appointment.type)

                  return (
                    <div
                      key={appointment.id}
                      className={`text-xs p-1 rounded truncate cursor-pointer ${appointmentType?.color} text-white`}
                      onClick={() => onAppointmentClick(appointment.id)}
                    >
                      {appointment.startTime} - {appointment.client}
                    </div>
                  )
                })}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

function WeekView({
  date,
  appointments,
  appointmentTypes,
  onAppointmentClick,
  onPrevious,
  onNext,
  onToday,
}: CalendarViewProps) {
  const weekStart = startOfWeek(date, { weekStartsOn: 0 })
  const weekEnd = endOfWeek(weekStart, { weekStartsOn: 0 })
  const days = eachDayOfInterval({ start: weekStart, end: weekEnd })

  const hours = Array.from({ length: 12 }, (_, i) => i + 8) // 8 AM to 7 PM

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">
          {format(weekStart, "MMM d")} - {format(weekEnd, "MMM d, yyyy")}
        </h2>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm" onClick={onPrevious}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="sm" onClick={onToday}>
            Today
          </Button>
          <Button variant="outline" size="sm" onClick={onNext}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-8 gap-px bg-muted rounded-lg overflow-hidden">
        <div className="bg-background p-2"></div>
        {days.map((day) => (
          <div
            key={day.toString()}
            className={`bg-background p-2 text-center ${isSameDay(day, new Date()) ? "bg-accent" : ""}`}
          >
            <div className="font-medium">{format(day, "EEE")}</div>
            <div className="text-sm">{format(day, "MMM d")}</div>
          </div>
        ))}

        {hours.map((hour) => (
          <React.Fragment key={hour}>
            <div className="bg-background p-2 text-right text-sm">
              {hour % 12 === 0 ? 12 : hour % 12} {hour < 12 ? "AM" : "PM"}
            </div>

            {days.map((day) => {
              const hourAppointments = appointments.filter((appointment) => {
                if (!isSameDay(appointment.date, day)) return false

                const startHour = Number.parseInt(appointment.startTime.split(":")[0])
                const isPM = appointment.startTime.includes("PM")
                const adjustedStartHour = isPM && startHour !== 12 ? startHour + 12 : startHour

                return adjustedStartHour === hour
              })

              return (
                <div key={day.toString()} className="bg-background p-1 border-t border-muted min-h-[60px]">
                  {hourAppointments.map((appointment) => {
                    const appointmentType = appointmentTypes.find((type) => type.id === appointment.type)

                    return (
                      <div
                        key={appointment.id}
                        className={`text-xs p-1 mb-1 rounded cursor-pointer ${appointmentType?.color} text-white`}
                        onClick={() => onAppointmentClick(appointment.id)}
                      >
                        {appointment.client} - {appointment.startTime}
                      </div>
                    )
                  })}
                </div>
              )
            })}
          </React.Fragment>
        ))}
      </div>
    </div>
  )
}

function DayView({
  date,
  appointments,
  appointmentTypes,
  onAppointmentClick,
  onPrevious,
  onNext,
  onToday,
}: CalendarViewProps) {
  const hours = Array.from({ length: 12 }, (_, i) => i + 8) // 8 AM to 7 PM

  const dayAppointments = appointments.filter((appointment) => isSameDay(appointment.date, date))

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">{format(date, "EEEE, MMMM d, yyyy")}</h2>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm" onClick={onPrevious}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="sm" onClick={onToday}>
            Today
          </Button>
          <Button variant="outline" size="sm" onClick={onNext}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="bg-muted rounded-lg overflow-hidden">
        {hours.map((hour) => {
          const hourAppointments = dayAppointments.filter((appointment) => {
            const startHour = Number.parseInt(appointment.startTime.split(":")[0])
            const isPM = appointment.startTime.includes("PM")
            const adjustedStartHour = isPM && startHour !== 12 ? startHour + 12 : startHour

            return adjustedStartHour === hour
          })

          return (
            <div key={hour} className="grid grid-cols-[80px_1fr] gap-px bg-muted">
              <div className="bg-background p-2 text-right text-sm">
                {hour % 12 === 0 ? 12 : hour % 12} {hour < 12 ? "AM" : "PM"}
              </div>
              <div className="bg-background p-2 min-h-[80px] border-t border-muted">
                {hourAppointments.map((appointment) => {
                  const appointmentType = appointmentTypes.find((type) => type.id === appointment.type)

                  return (
                    <div
                      key={appointment.id}
                      className={`p-2 mb-1 rounded cursor-pointer ${appointmentType?.color} text-white`}
                      onClick={() => onAppointmentClick(appointment.id)}
                    >
                      <div className="font-medium">{appointment.client}</div>
                      <div className="text-xs">
                        {appointment.startTime} - {appointment.endTime}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

