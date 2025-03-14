"use client"

import { useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { TimeTracking } from "@/components/employee/time-tracking"
import { PayrollInfo } from "@/components/employee/payroll-info"
import { TrainingRecords } from "@/components/employee/training-records"
import { DocumentManager } from "@/components/employee/document-manager"
import { TeamAssignments } from "@/components/employee/team-assignments"
import type { Employee } from "@/lib/types"
import { EmploymentStatusDialog } from "@/components/employee/employment-status-dialog"
import { ScheduleReport } from "@/components/employee/schedule-report"
import { AlertCircle } from "lucide-react"

// Simulated employee data - In a real app, this would come from an API
const employeeData: Employee = {
  id: 1,
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

export default function EmployeeDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [employee] = useState<Employee>(employeeData) // In real app, fetch based on params.id
  const [statusDialogOpen, setStatusDialogOpen] = useState(false)
  const [scheduleReportOpen, setScheduleReportOpen] = useState(false)
  const [employeeStatus, setEmployeeStatus] = useState("active")

  const handleEmploymentStatusChange = async (status, date, reason) => {
    // In a real app, this would be an API call to update the employee status
    console.log(`Updating employee ${params.id} status to ${status}`)
    console.log(`Effective date: ${date}`)
    console.log(`Reason: ${reason}`)

    // Update local state
    setEmployeeStatus(status)

    // Return a resolved promise to simulate successful API call
    return Promise.resolve()
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{employee.name}</h1>
          <div className="flex items-center gap-2">
            <p className="text-muted-foreground">{employee.role}</p>
            {employeeStatus !== "active" && (
              <div className="flex items-center gap-1 text-sm text-red-500">
                <AlertCircle className="h-4 w-4" />
                <span className="capitalize">{employeeStatus.replace("_", " ")}</span>
              </div>
            )}
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setScheduleReportOpen(true)}>
            Generate Schedule Report
          </Button>
          <Button variant="outline" onClick={() => setStatusDialogOpen(true)}>
            Change Employment Status
          </Button>
          <Button variant="outline" onClick={() => router.push(`/employees/${params.id}/edit`)}>
            Edit Employee
          </Button>
        </div>
      </div>

      <Tabs defaultValue="time">
        <TabsList>
          <TabsTrigger value="time">Time Tracking</TabsTrigger>
          <TabsTrigger value="payroll">Payroll</TabsTrigger>
          <TabsTrigger value="training">Training</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
          <TabsTrigger value="teams">Teams</TabsTrigger>
        </TabsList>

        <TabsContent value="time" className="mt-6">
          <TimeTracking employeeId={employee.id} timeEntries={employee.timeEntries} />
        </TabsContent>

        <TabsContent value="payroll" className="mt-6">
          <PayrollInfo employee={employee} />
        </TabsContent>

        <TabsContent value="training" className="mt-6">
          <TrainingRecords employeeId={employee.id} trainingRecords={employee.training} />
        </TabsContent>

        <TabsContent value="documents" className="mt-6">
          <DocumentManager employeeId={employee.id} documents={employee.documents} />
        </TabsContent>

        <TabsContent value="teams" className="mt-6">
          <TeamAssignments employeeId={employee.id} />
        </TabsContent>
      </Tabs>

      <EmploymentStatusDialog
        employeeId={employee.id}
        employeeName={employee.name}
        open={statusDialogOpen}
        onOpenChange={setStatusDialogOpen}
        onStatusChange={handleEmploymentStatusChange}
      />

      <ScheduleReport
        employeeId={employee.id}
        employeeName={employee.name}
        employeeRole={employee.role}
        scheduleEntries={[
          {
            id: 1,
            date: new Date(),
            startTime: "09:00",
            endTime: "17:00",
            jobName: "Deep Cleaning - Thompson Residence",
            location: "123 Main St, Anytown",
            status: "scheduled",
          },
          {
            id: 2,
            date: new Date(new Date().setDate(new Date().getDate() + 1)),
            startTime: "08:00",
            endTime: "16:00",
            jobName: "Regular Maintenance - Office Building",
            location: "456 Business Ave, Anytown",
            status: "scheduled",
          },
        ]}
        open={scheduleReportOpen}
        onOpenChange={setScheduleReportOpen}
      />
    </div>
  )
}

