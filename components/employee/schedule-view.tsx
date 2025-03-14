"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Calendar } from "@/components/ui/calendar"
import { Badge } from "@/components/ui/badge"
import { CalendarClock, Clock, MapPin, Printer } from "lucide-react"

interface ScheduleEntry {
  id: number
  date: Date
  startTime: string
  endTime: string
  jobName: string
  location: string
  status: "scheduled" | "completed" | "cancelled"
}

interface ScheduleViewProps {
  employeeId: number
  employeeName: string
  open: boolean
  onOpenChange: (open: boolean) => void
  onGenerateReport: () => void
}

export function ScheduleView({ employeeId, employeeName, open, onOpenChange, onGenerateReport }: ScheduleViewProps) {
  const [date, setDate] = useState<Date | undefined>(new Date())

  // In a real app, this would be fetched from an API based on employeeId and date
  const [scheduleEntries, setScheduleEntries] = useState<ScheduleEntry[]>([
    {
      id: 1,
      date: new Date(),
      startTime: "09:00",
      endTime: "12:00",
      jobName: "Deep Cleaning - Thompson Residence",
      location: "123 Main St, Anytown",
      status: "scheduled",
    },
    {
      id: 2,
      date: new Date(),
      startTime: "13:30",
      endTime: "16:30",
      jobName: "Regular Maintenance - Office Building",
      location: "456 Business Ave, Anytown",
      status: "scheduled",
    },
    {
      id: 3,
      date: new Date(new Date().setDate(new Date().getDate() + 1)),
      startTime: "08:00",
      endTime: "17:00",
      jobName: "Window Cleaning - Highrise Apartments",
      location: "789 Tower Rd, Anytown",
      status: "scheduled",
    },
  ])

  // Function to get entries for the selected date
  const getEntriesForDate = (selectedDate: Date | undefined) => {
    if (!selectedDate) return []

    return scheduleEntries.filter(
      (entry) =>
        entry.date.getDate() === selectedDate.getDate() &&
        entry.date.getMonth() === selectedDate.getMonth() &&
        entry.date.getFullYear() === selectedDate.getFullYear(),
    )
  }

  // Function to check if a date has entries
  const hasEntries = (day: Date) => {
    return scheduleEntries.some(
      (entry) =>
        entry.date.getDate() === day.getDate() &&
        entry.date.getMonth() === day.getMonth() &&
        entry.date.getFullYear() === day.getFullYear(),
    )
  }

  // Get entries for the selected date
  const currentDateEntries = getEntriesForDate(date)

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>{employeeName}'s Schedule</DialogTitle>
        </DialogHeader>
        <div className="grid gap-6 md:grid-cols-[300px_1fr]">
          <Card>
            <CardContent className="p-4">
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                className="rounded-md border"
                modifiers={{
                  hasEntries: (day) => hasEntries(day),
                }}
                modifiersStyles={{
                  hasEntries: { fontWeight: "bold", backgroundColor: "rgba(59, 130, 246, 0.1)" },
                }}
              />
              <div className="mt-4 text-xs text-muted-foreground">
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-blue-500"></div>
                  <span>Dates with scheduled work</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>
                {date
                  ? date.toLocaleDateString("en-US", {
                      weekday: "long",
                      month: "long",
                      day: "numeric",
                      year: "numeric",
                    })
                  : "Select a date"}
              </CardTitle>
              <CardDescription>
                {currentDateEntries.length} {currentDateEntries.length === 1 ? "job" : "jobs"} scheduled
              </CardDescription>
            </CardHeader>
            <CardContent>
              {currentDateEntries.length > 0 ? (
                <div className="space-y-4">
                  {currentDateEntries.map((entry) => (
                    <div key={entry.id} className="rounded-lg border p-4">
                      <div className="flex items-center justify-between">
                        <h3 className="font-medium">{entry.jobName}</h3>
                        <Badge
                          variant={
                            entry.status === "completed"
                              ? "success"
                              : entry.status === "cancelled"
                                ? "destructive"
                                : "outline"
                          }
                        >
                          {entry.status}
                        </Badge>
                      </div>
                      <div className="mt-2 space-y-2 text-sm">
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-muted-foreground" />
                          <span>
                            {entry.startTime} - {entry.endTime}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-muted-foreground" />
                          <span>{entry.location}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex h-40 items-center justify-center rounded-lg border border-dashed">
                  <div className="text-center">
                    <CalendarClock className="mx-auto h-10 w-10 text-muted-foreground" />
                    <p className="mt-2 text-sm text-muted-foreground">No jobs scheduled for this date</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
        <div className="flex justify-end gap-2 mt-4">
          <Button variant="outline" onClick={onGenerateReport}>
            <Printer className="mr-2 h-4 w-4" />
            Generate Report
          </Button>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

