"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ScheduleView } from "@/components/employee/schedule-view"
import { EditHours } from "@/components/employee/edit-hours"
import { ScheduleReport } from "@/components/employee/schedule-report"

interface Employee {
  id: number
  name: string
  role: string
}

export function EmployeeSchedule() {
  const [viewScheduleOpen, setViewScheduleOpen] = useState(false)
  const [editHoursOpen, setEditHoursOpen] = useState(false)
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null)
  const [scheduleReportOpen, setScheduleReportOpen] = useState(false)

  const employees = [
    {
      id: 1,
      name: "John Smith",
      role: "Senior Cleaner",
    },
    {
      id: 2,
      name: "Jane Doe",
      role: "Team Lead",
    },
    {
      id: 3,
      name: "Bob Johnson",
      role: "Cleaner",
    },
  ]

  const handleViewSchedule = (employee: Employee) => {
    setSelectedEmployee(employee)
    setViewScheduleOpen(true)
  }

  const handleEditHours = (employee: Employee) => {
    setSelectedEmployee(employee)
    setEditHoursOpen(true)
  }

  const handleGenerateReport = () => {
    if (selectedEmployee) {
      setViewScheduleOpen(false)
      setScheduleReportOpen(true)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Weekly Schedule</CardTitle>
        <CardDescription>Employee work schedules for the week</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {employees.map((employee) => (
            <div key={employee.id} className="flex items-center justify-between rounded-lg border p-4">
              <div>
                <p className="font-medium">{employee.name}</p>
                <p className="text-sm text-muted-foreground">{employee.role}</p>
              </div>
              <div className="flex gap-4">
                <Button variant="outline" size="sm" onClick={() => handleViewSchedule(employee)}>
                  View Schedule
                </Button>
                <Button variant="outline" size="sm" onClick={() => handleEditHours(employee)}>
                  Edit Hours
                </Button>
              </div>
            </div>
          ))}
        </div>

        {selectedEmployee && (
          <>
            <ScheduleView
              employeeId={selectedEmployee.id}
              employeeName={selectedEmployee.name}
              open={viewScheduleOpen}
              onOpenChange={setViewScheduleOpen}
              onGenerateReport={handleGenerateReport}
            />

            <ScheduleReport
              employeeId={selectedEmployee.id}
              employeeName={selectedEmployee.name}
              employeeRole={selectedEmployee.role}
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

            <EditHours
              employeeId={selectedEmployee.id}
              employeeName={selectedEmployee.name}
              open={editHoursOpen}
              onOpenChange={setEditHoursOpen}
            />
          </>
        )}
      </CardContent>
    </Card>
  )
}

