"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Star } from "lucide-react"

const employees = [
  {
    id: 1,
    name: "John Smith",
    role: "Senior Cleaner",
    performance: 4.8,
    hoursThisMonth: 160,
    assignedJobs: 45,
  },
  {
    id: 2,
    name: "Jane Doe",
    role: "Team Lead",
    performance: 4.9,
    hoursThisMonth: 168,
    assignedJobs: 52,
  },
  {
    id: 3,
    name: "Bob Johnson",
    role: "Cleaner",
    performance: 4.5,
    hoursThisMonth: 152,
    assignedJobs: 38,
  },
]

export function EmployeePerformance() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Performance Metrics</CardTitle>
        <CardDescription>Employee ratings and job completion stats</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {employees.map((employee) => (
            <div key={employee.id} className="flex items-center justify-between rounded-lg border p-4">
              <div>
                <p className="font-medium">{employee.name}</p>
                <div className="mt-1 flex items-center gap-2">
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`h-4 w-4 ${
                          star <= Math.floor(employee.performance)
                            ? "fill-yellow-500 text-yellow-500"
                            : star <= employee.performance
                              ? "fill-yellow-500 text-yellow-500 opacity-50"
                              : "text-gray-300"
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-sm">{employee.performance} / 5.0</span>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium">{employee.assignedJobs} Jobs Completed</p>
                <p className="text-sm text-muted-foreground">{employee.hoursThisMonth} Hours This Month</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

