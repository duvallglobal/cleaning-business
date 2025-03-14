"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"
import type { TimeEntry } from "@/lib/types"
import { Clock, Plus } from "lucide-react"

export function TimeTracking({
  employeeId,
  timeEntries,
}: {
  employeeId: number
  timeEntries: TimeEntry[]
}) {
  const { toast } = useToast()
  const [entries, setEntries] = useState<TimeEntry[]>(timeEntries)

  const handleAddTimeEntry = async (formData: FormData) => {
    const newEntry: TimeEntry = {
      id: entries.length + 1,
      date: formData.get("date") as string,
      startTime: formData.get("startTime") as string,
      endTime: formData.get("endTime") as string,
      breakDuration: Number.parseInt(formData.get("breakDuration") as string),
      jobName: formData.get("jobName") as string,
      status: "pending",
    }

    // In a real app, this would be an API call
    setEntries([...entries, newEntry])
    toast({
      title: "Time Entry Added",
      description: "The time entry has been successfully recorded.",
    })
  }

  const calculateHours = (entry: TimeEntry) => {
    const start = new Date(`${entry.date}T${entry.startTime}`)
    const end = new Date(`${entry.date}T${entry.endTime}`)
    const hours = (end.getTime() - start.getTime()) / 1000 / 60 / 60 - entry.breakDuration / 60
    return hours.toFixed(2)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Time Tracking</h2>
        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Time Entry
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Time Entry</DialogTitle>
            </DialogHeader>
            <form action={(formData) => handleAddTimeEntry(formData)} className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="date">Date</Label>
                <Input id="date" name="date" type="date" required />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="startTime">Start Time</Label>
                  <Input id="startTime" name="startTime" type="time" required />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="endTime">End Time</Label>
                  <Input id="endTime" name="endTime" type="time" required />
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="breakDuration">Break Duration (minutes)</Label>
                <Input id="breakDuration" name="breakDuration" type="number" defaultValue="60" required />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="jobName">Job Name</Label>
                <Input id="jobName" name="jobName" required />
              </div>
              <Button type="submit">Save Time Entry</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Time Entries</CardTitle>
          <CardDescription>View and manage employee time entries</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {entries.map((entry) => (
              <div key={entry.id} className="flex items-center justify-between rounded-lg border p-4">
                <div className="space-y-1">
                  <p className="font-medium">{entry.jobName}</p>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    <span>
                      {entry.date} • {entry.startTime} - {entry.endTime} ({calculateHours(entry)} hours)
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span
                    className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                      entry.status === "approved"
                        ? "bg-green-100 text-green-700"
                        : entry.status === "rejected"
                          ? "bg-red-100 text-red-700"
                          : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {entry.status}
                  </span>
                  <Button variant="outline" size="sm">
                    Edit
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

