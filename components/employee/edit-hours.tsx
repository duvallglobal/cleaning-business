"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"
import { Calendar } from "@/components/ui/calendar"
import { Switch } from "@/components/ui/switch"

interface WorkHours {
  id: number
  date: Date
  startTime: string
  endTime: string
  breakDuration: number
  isTimeOff: boolean
  notes: string
}

interface EditHoursProps {
  employeeId: number
  employeeName: string
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function EditHours({ employeeId, employeeName, open, onOpenChange }: EditHoursProps) {
  const { toast } = useToast()
  const [date, setDate] = useState<Date | undefined>(new Date())
  const [isLoading, setIsLoading] = useState(false)

  // In a real app, this would be fetched from an API based on employeeId and date
  const [workHours, setWorkHours] = useState<WorkHours[]>([
    {
      id: 1,
      date: new Date(),
      startTime: "09:00",
      endTime: "17:00",
      breakDuration: 60,
      isTimeOff: false,
      notes: "",
    },
    {
      id: 2,
      date: new Date(new Date().setDate(new Date().getDate() + 1)),
      startTime: "08:00",
      endTime: "16:00",
      breakDuration: 60,
      isTimeOff: false,
      notes: "",
    },
    {
      id: 3,
      date: new Date(new Date().setDate(new Date().getDate() + 2)),
      startTime: "",
      endTime: "",
      breakDuration: 0,
      isTimeOff: true,
      notes: "Vacation day",
    },
  ])

  // Get hours for the selected date
  const getHoursForDate = (selectedDate: Date | undefined) => {
    if (!selectedDate) return null

    return (
      workHours.find(
        (hours) =>
          hours.date.getDate() === selectedDate.getDate() &&
          hours.date.getMonth() === selectedDate.getMonth() &&
          hours.date.getFullYear() === selectedDate.getFullYear(),
      ) || {
        id: 0,
        date: selectedDate,
        startTime: "09:00",
        endTime: "17:00",
        breakDuration: 60,
        isTimeOff: false,
        notes: "",
      }
    )
  }

  // Function to check if a date has hours
  const hasHours = (day: Date) => {
    return workHours.some(
      (hours) =>
        hours.date.getDate() === day.getDate() &&
        hours.date.getMonth() === day.getMonth() &&
        hours.date.getFullYear() === day.getFullYear(),
    )
  }

  // Get hours for the selected date
  const currentDateHours = getHoursForDate(date)

  const handleSaveHours = async (formData: FormData) => {
    if (!date || !currentDateHours) return

    setIsLoading(true)

    try {
      // In a real app, this would be an API call
      const isTimeOff = formData.get("isTimeOff") === "on"

      const updatedHours: WorkHours = {
        id: currentDateHours.id || Math.max(0, ...workHours.map((h) => h.id)) + 1,
        date: date,
        startTime: isTimeOff ? "" : (formData.get("startTime") as string),
        endTime: isTimeOff ? "" : (formData.get("endTime") as string),
        breakDuration: isTimeOff ? 0 : Number.parseInt(formData.get("breakDuration") as string),
        isTimeOff: isTimeOff,
        notes: formData.get("notes") as string,
      }

      // Update or add the hours
      const updatedWorkHours = currentDateHours.id
        ? workHours.map((h) => (h.id === currentDateHours.id ? updatedHours : h))
        : [...workHours, updatedHours]

      setWorkHours(updatedWorkHours)

      toast({
        title: "Hours Updated",
        description: `Work hours for ${date.toLocaleDateString()} have been updated.`,
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update hours. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>Edit {employeeName}'s Hours</DialogTitle>
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
                  hasHours: (day) => hasHours(day),
                }}
                modifiersStyles={{
                  hasHours: { fontWeight: "bold", backgroundColor: "rgba(59, 130, 246, 0.1)" },
                }}
              />
              <div className="mt-4 text-xs text-muted-foreground">
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-blue-500"></div>
                  <span>Dates with scheduled hours</span>
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
              <CardDescription>Set work hours or time off</CardDescription>
            </CardHeader>
            <CardContent>
              {date && currentDateHours ? (
                <form action={(formData) => handleSaveHours(formData)} className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Switch id="isTimeOff" name="isTimeOff" defaultChecked={currentDateHours.isTimeOff} />
                    <Label htmlFor="isTimeOff">Mark as time off</Label>
                  </div>

                  {!currentDateHours.isTimeOff && (
                    <>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="startTime">Start Time</Label>
                          <Input
                            id="startTime"
                            name="startTime"
                            type="time"
                            defaultValue={currentDateHours.startTime}
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="endTime">End Time</Label>
                          <Input
                            id="endTime"
                            name="endTime"
                            type="time"
                            defaultValue={currentDateHours.endTime}
                            required
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="breakDuration">Break Duration (minutes)</Label>
                        <Input
                          id="breakDuration"
                          name="breakDuration"
                          type="number"
                          defaultValue={currentDateHours.breakDuration}
                          required
                        />
                      </div>
                    </>
                  )}

                  <div className="space-y-2">
                    <Label htmlFor="notes">Notes</Label>
                    <Input id="notes" name="notes" defaultValue={currentDateHours.notes} />
                  </div>

                  <div className="flex justify-end gap-2">
                    <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                      Cancel
                    </Button>
                    <Button type="submit" disabled={isLoading}>
                      {isLoading ? "Saving..." : "Save Hours"}
                    </Button>
                  </div>
                </form>
              ) : (
                <div className="flex h-40 items-center justify-center">
                  <p className="text-muted-foreground">Select a date to edit hours</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  )
}

