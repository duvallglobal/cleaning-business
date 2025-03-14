"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"
import type { TimeEntry } from "@/lib/types"
import { Clock, Plus, Pencil, Trash } from "lucide-react"

interface EditTimeTrackingProps {
  employeeId: number
  timeEntries: TimeEntry[]
  onUpdate: (timeEntries: TimeEntry[]) => Promise<void>
}

export function EditTimeTracking({ employeeId, timeEntries, onUpdate }: EditTimeTrackingProps) {
  const { toast } = useToast()
  const [entries, setEntries] = useState<TimeEntry[]>(timeEntries)
  const [isEditing, setIsEditing] = useState(false)
  const [currentEntry, setCurrentEntry] = useState<TimeEntry | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const handleAddTimeEntry = async (formData: FormData) => {
    const newEntry: TimeEntry = {
      id: entries.length > 0 ? Math.max(...entries.map((e) => e.id)) + 1 : 1,
      date: formData.get("date") as string,
      startTime: formData.get("startTime") as string,
      endTime: formData.get("endTime") as string,
      breakDuration: Number.parseInt(formData.get("breakDuration") as string),
      jobName: formData.get("jobName") as string,
      status: "pending",
    }

    const updatedEntries = [...entries, newEntry]
    setEntries(updatedEntries)

    try {
      await onUpdate(updatedEntries)
      toast({
        title: "Time Entry Added",
        description: "The time entry has been successfully recorded.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add time entry. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleEditTimeEntry = async (formData: FormData) => {
    if (!currentEntry) return

    const updatedEntry: TimeEntry = {
      ...currentEntry,
      date: formData.get("date") as string,
      startTime: formData.get("startTime") as string,
      endTime: formData.get("endTime") as string,
      breakDuration: Number.parseInt(formData.get("breakDuration") as string),
      jobName: formData.get("jobName") as string,
    }

    const updatedEntries = entries.map((entry) => (entry.id === updatedEntry.id ? updatedEntry : entry))

    setEntries(updatedEntries)
    setIsEditing(false)
    setCurrentEntry(null)

    try {
      await onUpdate(updatedEntries)
      toast({
        title: "Time Entry Updated",
        description: "The time entry has been successfully updated.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update time entry. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleDeleteTimeEntry = async (entryId: number) => {
    setIsLoading(true)

    const updatedEntries = entries.filter((entry) => entry.id !== entryId)
    setEntries(updatedEntries)

    try {
      await onUpdate(updatedEntries)
      toast({
        title: "Time Entry Deleted",
        description: "The time entry has been successfully deleted.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete time entry. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleUpdateStatus = async (entryId: number, status: "pending" | "approved" | "rejected") => {
    const updatedEntries = entries.map((entry) => (entry.id === entryId ? { ...entry, status } : entry))

    setEntries(updatedEntries)

    try {
      await onUpdate(updatedEntries)
      toast({
        title: "Status Updated",
        description: `The time entry status has been updated to ${status}.`,
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update status. Please try again.",
        variant: "destructive",
      })
    }
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
          <CardTitle>Time Entries</CardTitle>
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
                  <select
                    value={entry.status}
                    onChange={(e) =>
                      handleUpdateStatus(entry.id, e.target.value as "pending" | "approved" | "rejected")
                    }
                    className="rounded-md border border-input bg-background px-3 py-1 text-sm ring-offset-background"
                  >
                    <option value="pending">Pending</option>
                    <option value="approved">Approved</option>
                    <option value="rejected">Rejected</option>
                  </select>
                  <Dialog
                    open={isEditing && currentEntry?.id === entry.id}
                    onOpenChange={(open) => {
                      if (!open) {
                        setIsEditing(false)
                        setCurrentEntry(null)
                      }
                    }}
                  >
                    <DialogTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setCurrentEntry(entry)
                          setIsEditing(true)
                        }}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Edit Time Entry</DialogTitle>
                      </DialogHeader>
                      <form action={(formData) => handleEditTimeEntry(formData)} className="space-y-4">
                        <div className="grid gap-2">
                          <Label htmlFor="edit-date">Date</Label>
                          <Input id="edit-date" name="date" type="date" defaultValue={currentEntry?.date} required />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="grid gap-2">
                            <Label htmlFor="edit-startTime">Start Time</Label>
                            <Input
                              id="edit-startTime"
                              name="startTime"
                              type="time"
                              defaultValue={currentEntry?.startTime}
                              required
                            />
                          </div>
                          <div className="grid gap-2">
                            <Label htmlFor="edit-endTime">End Time</Label>
                            <Input
                              id="edit-endTime"
                              name="endTime"
                              type="time"
                              defaultValue={currentEntry?.endTime}
                              required
                            />
                          </div>
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="edit-breakDuration">Break Duration (minutes)</Label>
                          <Input
                            id="edit-breakDuration"
                            name="breakDuration"
                            type="number"
                            defaultValue={currentEntry?.breakDuration}
                            required
                          />
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="edit-jobName">Job Name</Label>
                          <Input id="edit-jobName" name="jobName" defaultValue={currentEntry?.jobName} required />
                        </div>
                        <Button type="submit">Update Time Entry</Button>
                      </form>
                    </DialogContent>
                  </Dialog>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDeleteTimeEntry(entry.id)}
                    disabled={isLoading}
                  >
                    <Trash className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
            {entries.length === 0 && (
              <div className="flex h-24 items-center justify-center rounded-lg border border-dashed">
                <p className="text-sm text-muted-foreground">No time entries found</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

