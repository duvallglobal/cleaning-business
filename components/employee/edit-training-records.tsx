"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"
import type { TrainingRecord } from "@/lib/types"
import { Award, Download, Plus, Pencil, Trash } from "lucide-react"

interface EditTrainingRecordsProps {
  employeeId: number
  trainingRecords: TrainingRecord[]
  onUpdate: (trainingRecords: TrainingRecord[]) => Promise<void>
}

export function EditTrainingRecords({ employeeId, trainingRecords, onUpdate }: EditTrainingRecordsProps) {
  const { toast } = useToast()
  const [records, setRecords] = useState<TrainingRecord[]>(trainingRecords)
  const [isEditing, setIsEditing] = useState(false)
  const [currentRecord, setCurrentRecord] = useState<TrainingRecord | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const handleAddTraining = async (formData: FormData) => {
    const newTraining: TrainingRecord = {
      id: records.length > 0 ? Math.max(...records.map((r) => r.id)) + 1 : 1,
      courseName: formData.get("courseName") as string,
      completionDate: formData.get("completionDate") as string,
      expiryDate: formData.get("expiryDate") as string,
      status: "completed",
      certificateUrl: "/certificates/new-cert.pdf",
    }

    const updatedRecords = [...records, newTraining]
    setRecords(updatedRecords)

    try {
      await onUpdate(updatedRecords)
      toast({
        title: "Training Record Added",
        description: "The training record has been successfully added.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add training record. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleEditTraining = async (formData: FormData) => {
    if (!currentRecord) return

    const updatedRecord: TrainingRecord = {
      ...currentRecord,
      courseName: formData.get("courseName") as string,
      completionDate: formData.get("completionDate") as string,
      expiryDate: formData.get("expiryDate") as string,
      status: formData.get("status") as "completed" | "in-progress" | "expired",
    }

    const updatedRecords = records.map((record) => (record.id === updatedRecord.id ? updatedRecord : record))

    setRecords(updatedRecords)
    setIsEditing(false)
    setCurrentRecord(null)

    try {
      await onUpdate(updatedRecords)
      toast({
        title: "Training Record Updated",
        description: "The training record has been successfully updated.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update training record. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleDeleteTraining = async (recordId: number) => {
    setIsLoading(true)

    const updatedRecords = records.filter((record) => record.id !== recordId)
    setRecords(updatedRecords)

    try {
      await onUpdate(updatedRecords)
      toast({
        title: "Training Record Deleted",
        description: "The training record has been successfully deleted.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete training record. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Training Records</h2>
        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Training
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Training Record</DialogTitle>
            </DialogHeader>
            <form action={(formData) => handleAddTraining(formData)} className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="courseName">Course Name</Label>
                <Input id="courseName" name="courseName" required />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="completionDate">Completion Date</Label>
                <Input id="completionDate" name="completionDate" type="date" required />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="expiryDate">Expiry Date</Label>
                <Input id="expiryDate" name="expiryDate" type="date" required />
              </div>
              <Button type="submit">Save Training Record</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Certifications & Training</CardTitle>
          <CardDescription>View and manage employee training records</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {records.map((record) => (
              <div key={record.id} className="flex items-center justify-between rounded-lg border p-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Award className="h-4 w-4 text-blue-500" />
                    <p className="font-medium">{record.courseName}</p>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Completed: {record.completionDate} • Expires: {record.expiryDate}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <select
                    value={record.status}
                    onChange={(e) => {
                      const updatedRecords = records.map((r) =>
                        r.id === record.id
                          ? { ...r, status: e.target.value as "completed" | "in-progress" | "expired" }
                          : r,
                      )
                      setRecords(updatedRecords)
                      onUpdate(updatedRecords)
                    }}
                    className="rounded-md border border-input bg-background px-3 py-1 text-sm ring-offset-background"
                  >
                    <option value="completed">Completed</option>
                    <option value="in-progress">In Progress</option>
                    <option value="expired">Expired</option>
                  </select>
                  <Dialog
                    open={isEditing && currentRecord?.id === record.id}
                    onOpenChange={(open) => {
                      if (!open) {
                        setIsEditing(false)
                        setCurrentRecord(null)
                      }
                    }}
                  >
                    <DialogTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setCurrentRecord(record)
                          setIsEditing(true)
                        }}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Edit Training Record</DialogTitle>
                      </DialogHeader>
                      <form action={(formData) => handleEditTraining(formData)} className="space-y-4">
                        <div className="grid gap-2">
                          <Label htmlFor="edit-courseName">Course Name</Label>
                          <Input
                            id="edit-courseName"
                            name="courseName"
                            defaultValue={currentRecord?.courseName}
                            required
                          />
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="edit-completionDate">Completion Date</Label>
                          <Input
                            id="edit-completionDate"
                            name="completionDate"
                            type="date"
                            defaultValue={currentRecord?.completionDate}
                            required
                          />
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="edit-expiryDate">Expiry Date</Label>
                          <Input
                            id="edit-expiryDate"
                            name="expiryDate"
                            type="date"
                            defaultValue={currentRecord?.expiryDate}
                            required
                          />
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="edit-status">Status</Label>
                          <select
                            id="edit-status"
                            name="status"
                            defaultValue={currentRecord?.status}
                            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                          >
                            <option value="completed">Completed</option>
                            <option value="in-progress">In Progress</option>
                            <option value="expired">Expired</option>
                          </select>
                        </div>
                        <Button type="submit">Update Training Record</Button>
                      </form>
                    </DialogContent>
                  </Dialog>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDeleteTraining(record.id)}
                    disabled={isLoading}
                  >
                    <Trash className="h-4 w-4" />
                  </Button>
                  {record.certificateUrl && (
                    <Button variant="outline" size="sm">
                      <Download className="mr-2 h-4 w-4" />
                      Certificate
                    </Button>
                  )}
                </div>
              </div>
            ))}
            {records.length === 0 && (
              <div className="flex h-24 items-center justify-center rounded-lg border border-dashed">
                <p className="text-sm text-muted-foreground">No training records found</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

