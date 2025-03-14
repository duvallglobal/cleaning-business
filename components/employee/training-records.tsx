"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"
import type { TrainingRecord } from "@/lib/types"
import { Award, Download, Plus } from "lucide-react"

export function TrainingRecords({
  employeeId,
  trainingRecords,
}: {
  employeeId: number
  trainingRecords: TrainingRecord[]
}) {
  const { toast } = useToast()
  const [records, setRecords] = useState<TrainingRecord[]>(trainingRecords)

  const handleAddTraining = async (formData: FormData) => {
    const newTraining: TrainingRecord = {
      id: records.length + 1,
      courseName: formData.get("courseName") as string,
      completionDate: formData.get("completionDate") as string,
      expiryDate: formData.get("expiryDate") as string,
      status: "completed",
      certificateUrl: "/certificates/new-cert.pdf",
    }

    // In a real app, this would be an API call
    setRecords([...records, newTraining])
    toast({
      title: "Training Record Added",
      description: "The training record has been successfully added.",
    })
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
                  <span
                    className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                      record.status === "completed"
                        ? "bg-green-100 text-green-700"
                        : record.status === "expired"
                          ? "bg-red-100 text-red-700"
                          : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {record.status}
                  </span>
                  {record.certificateUrl && (
                    <Button variant="outline" size="sm">
                      <Download className="mr-2 h-4 w-4" />
                      Certificate
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

