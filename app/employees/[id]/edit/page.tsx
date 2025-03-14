"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/components/ui/use-toast"
import type { Employee, TimeEntry, TrainingRecord, Document, Team } from "@/lib/types"
import { EditTimeTracking } from "@/components/employee/edit-time-tracking"
import { EditPayrollInfo } from "@/components/employee/edit-payroll-info"
import { EditTrainingRecords } from "@/components/employee/edit-training-records"
import { EditDocumentManager } from "@/components/employee/edit-document-manager"
import { EditTeamAssignments } from "@/components/employee/edit-team-assignments"

// Simulated API function - in a real app, this would be in your API lib
async function getEmployee(id: string): Promise<Employee> {
  // This would be a fetch call in a real app
  return {
    id: Number.parseInt(id),
    name: "John Smith",
    role: "Senior Cleaner",
    email: "john.s@cleanpro.com",
    phone: "(555) 123-4567",
    performance: 4.8,
    hoursThisMonth: 160,
    assignedJobs: 45,
    hourlyRate: 25,
    startDate: "2023-01-15",
    documents: [
      {
        id: 1,
        name: "Driver's License",
        type: "identification",
        uploadDate: "2023-01-15",
        url: "/documents/license.pdf",
        status: "valid",
      },
      {
        id: 2,
        name: "Background Check",
        type: "verification",
        uploadDate: "2023-01-16",
        url: "/documents/background.pdf",
        status: "valid",
      },
    ],
    training: [
      {
        id: 1,
        courseName: "Basic Cleaning Certification",
        completionDate: "2023-02-01",
        expiryDate: "2024-02-01",
        status: "completed",
        certificateUrl: "/certificates/basic-cleaning.pdf",
      },
      {
        id: 2,
        courseName: "Advanced Equipment Training",
        completionDate: "2023-03-15",
        expiryDate: "2024-03-15",
        status: "completed",
        certificateUrl: "/certificates/equipment.pdf",
      },
    ],
    timeEntries: [
      {
        id: 1,
        date: "2024-02-19",
        startTime: "09:00",
        endTime: "17:00",
        breakDuration: 60,
        jobId: 1,
        jobName: "Deep Cleaning - Thompson Residence",
        status: "approved",
      },
      {
        id: 2,
        date: "2024-02-18",
        startTime: "08:30",
        endTime: "16:30",
        breakDuration: 60,
        jobId: 2,
        jobName: "Regular Maintenance - Office Building",
        status: "approved",
      },
    ],
  }
}

// Simulated API function - in a real app, this would be in your API lib
async function updateEmployee(id: string, data: Partial<Employee>): Promise<Employee> {
  // This would be a fetch call in a real app
  console.log("Updating employee:", id, data)
  return { ...data, id: Number.parseInt(id) } as Employee
}

// Simulated API function for updating specific employee data
async function updateEmployeeTimeEntries(id: string, timeEntries: TimeEntry[]): Promise<TimeEntry[]> {
  console.log("Updating employee time entries:", id, timeEntries)
  return timeEntries
}

async function updateEmployeeTraining(id: string, training: TrainingRecord[]): Promise<TrainingRecord[]> {
  console.log("Updating employee training records:", id, training)
  return training
}

async function updateEmployeeDocuments(id: string, documents: Document[]): Promise<Document[]> {
  console.log("Updating employee documents:", id, documents)
  return documents
}

async function updateEmployeeTeams(id: string, teams: Team[]): Promise<Team[]> {
  console.log("Updating employee teams:", id, teams)
  return teams
}

export default function EditEmployeePage() {
  const params = useParams()
  const router = useRouter()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(true)
  const [employee, setEmployee] = useState<Employee | null>(null)
  const [activeTab, setActiveTab] = useState("profile")
  const [formData, setFormData] = useState({
    name: "",
    role: "",
    email: "",
    phone: "",
    hourlyRate: 0,
    startDate: "",
  })

  useEffect(() => {
    async function loadEmployee() {
      try {
        const data = await getEmployee(params.id as string)
        setEmployee(data)
        setFormData({
          name: data.name,
          role: data.role,
          email: data.email,
          phone: data.phone,
          hourlyRate: data.hourlyRate,
          startDate: data.startDate,
        })
      } catch (error) {
        console.error("Failed to load employee:", error)
        toast({
          title: "Error",
          description: "Failed to load employee data. Please try again.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    if (params.id) {
      loadEmployee()
    }
  }, [params.id, toast])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: name === "hourlyRate" ? Number.parseFloat(value) : value,
    }))
  }

  const handleRoleChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      role: value,
    }))
  }

  const handleSubmitProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      await updateEmployee(params.id as string, formData)
      toast({
        title: "Success",
        description: "Employee information has been updated successfully.",
      })
    } catch (error) {
      console.error("Failed to update employee:", error)
      toast({
        title: "Error",
        description: "Failed to update employee information. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleUpdateTimeEntries = async (timeEntries: TimeEntry[]) => {
    if (!employee) return

    try {
      const updatedEntries = await updateEmployeeTimeEntries(params.id as string, timeEntries)
      setEmployee({ ...employee, timeEntries: updatedEntries })
      toast({
        title: "Success",
        description: "Time entries have been updated successfully.",
      })
    } catch (error) {
      console.error("Failed to update time entries:", error)
      toast({
        title: "Error",
        description: "Failed to update time entries. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleUpdateTraining = async (training: TrainingRecord[]) => {
    if (!employee) return

    try {
      const updatedTraining = await updateEmployeeTraining(params.id as string, training)
      setEmployee({ ...employee, training: updatedTraining })
      toast({
        title: "Success",
        description: "Training records have been updated successfully.",
      })
    } catch (error) {
      console.error("Failed to update training records:", error)
      toast({
        title: "Error",
        description: "Failed to update training records. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleUpdateDocuments = async (documents: Document[]) => {
    if (!employee) return

    try {
      const updatedDocuments = await updateEmployeeDocuments(params.id as string, documents)
      setEmployee({ ...employee, documents: updatedDocuments })
      toast({
        title: "Success",
        description: "Documents have been updated successfully.",
      })
    } catch (error) {
      console.error("Failed to update documents:", error)
      toast({
        title: "Error",
        description: "Failed to update documents. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleUpdateHourlyRate = async (hourlyRate: number) => {
    if (!employee) return

    try {
      await updateEmployee(params.id as string, { hourlyRate })
      setEmployee({ ...employee, hourlyRate })
      setFormData({ ...formData, hourlyRate })
      toast({
        title: "Success",
        description: "Hourly rate has been updated successfully.",
      })
    } catch (error) {
      console.error("Failed to update hourly rate:", error)
      toast({
        title: "Error",
        description: "Failed to update hourly rate. Please try again.",
        variant: "destructive",
      })
    }
  }

  if (isLoading) {
    return <div className="flex justify-center p-12">Loading employee data...</div>
  }

  if (!employee) {
    return <div className="flex justify-center p-12">Employee not found</div>
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Edit Employee</h1>
        <Button variant="outline" onClick={() => router.back()}>
          Back to Employee
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="time">Time Tracking</TabsTrigger>
          <TabsTrigger value="payroll">Payroll</TabsTrigger>
          <TabsTrigger value="training">Training</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
          <TabsTrigger value="teams">Teams</TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Employee Information</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmitProfile} className="space-y-6">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input id="name" name="name" value={formData.name} onChange={handleChange} required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="role">Role</Label>
                    <Select value={formData.role} onValueChange={handleRoleChange}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select role" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Cleaner">Cleaner</SelectItem>
                        <SelectItem value="Senior Cleaner">Senior Cleaner</SelectItem>
                        <SelectItem value="Team Lead">Team Lead</SelectItem>
                        <SelectItem value="Supervisor">Supervisor</SelectItem>
                        <SelectItem value="Manager">Manager</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone</Label>
                    <Input id="phone" name="phone" type="tel" value={formData.phone} onChange={handleChange} required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="startDate">Start Date</Label>
                    <Input
                      id="startDate"
                      name="startDate"
                      type="date"
                      value={formData.startDate}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-4">
                  <Button type="submit" disabled={isLoading}>
                    {isLoading ? "Saving..." : "Save Changes"}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="time" className="mt-6">
          <EditTimeTracking
            employeeId={employee.id}
            timeEntries={employee.timeEntries}
            onUpdate={handleUpdateTimeEntries}
          />
        </TabsContent>

        <TabsContent value="payroll" className="mt-6">
          <EditPayrollInfo employee={employee} onUpdateHourlyRate={handleUpdateHourlyRate} />
        </TabsContent>

        <TabsContent value="training" className="mt-6">
          <EditTrainingRecords
            employeeId={employee.id}
            trainingRecords={employee.training}
            onUpdate={handleUpdateTraining}
          />
        </TabsContent>

        <TabsContent value="documents" className="mt-6">
          <EditDocumentManager
            employeeId={employee.id}
            documents={employee.documents}
            onUpdate={handleUpdateDocuments}
          />
        </TabsContent>

        <TabsContent value="teams" className="mt-6">
          <EditTeamAssignments employeeId={employee.id} />
        </TabsContent>
      </Tabs>
    </div>
  )
}

