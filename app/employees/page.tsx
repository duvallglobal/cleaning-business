"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/components/ui/use-toast"
import { CalendarClock, Plus, Star, Timer, Pencil } from "lucide-react"
import { EmployeeSchedule } from "@/components/employee/schedule"
import { EmployeePerformance } from "@/components/employee/performance"

const employees = [
  {
    id: 1,
    name: "John Smith",
    role: "Senior Cleaner",
    email: "john.s@cleanpro.com",
    phone: "(555) 123-4567",
    performance: 4.8,
    hoursThisMonth: 160,
    assignedJobs: 45,
  },
  {
    id: 2,
    name: "Jane Doe",
    role: "Team Lead",
    email: "jane.d@cleanpro.com",
    phone: "(555) 234-5678",
    performance: 4.9,
    hoursThisMonth: 168,
    assignedJobs: 52,
  },
  {
    id: 3,
    name: "Bob Johnson",
    role: "Cleaner",
    email: "bob.j@cleanpro.com",
    phone: "(555) 345-6789",
    performance: 4.5,
    hoursThisMonth: 152,
    assignedJobs: 38,
  },
]

export default function EmployeesPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [activeTab, setActiveTab] = useState("overview")
  const [employeeList, setEmployeeList] = useState(employees)
  const [editEmployee, setEditEmployee] = useState<(typeof employees)[0] | null>(null)

  const handleAddEmployee = async (formData: FormData) => {
    const newEmployee = {
      id: employeeList.length > 0 ? Math.max(...employeeList.map((e) => e.id)) + 1 : 1,
      name: formData.get("name") as string,
      role: formData.get("role") as string,
      email: formData.get("email") as string,
      phone: formData.get("phone") as string,
      performance: 0,
      hoursThisMonth: 0,
      assignedJobs: 0,
    }

    setEmployeeList([...employeeList, newEmployee])
    toast({
      title: "Employee Added",
      description: "The new employee has been added successfully.",
    })
  }

  const handleEditEmployee = async (formData: FormData) => {
    if (!editEmployee) return

    const updatedEmployee = {
      ...editEmployee,
      name: formData.get("name") as string,
      role: formData.get("role") as string,
      email: formData.get("email") as string,
      phone: formData.get("phone") as string,
    }

    setEmployeeList(employeeList.map((emp) => (emp.id === updatedEmployee.id ? updatedEmployee : emp)))
    setEditEmployee(null)

    toast({
      title: "Employee Updated",
      description: "The employee information has been updated successfully.",
    })
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Employees</h1>
        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Employee
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Add New Employee</DialogTitle>
            </DialogHeader>
            <form action={(formData) => handleAddEmployee(formData)} className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Full Name</Label>
                <Input id="name" name="name" required />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="role">Role</Label>
                <Select name="role">
                  <SelectTrigger>
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="cleaner">Cleaner</SelectItem>
                    <SelectItem value="senior">Senior Cleaner</SelectItem>
                    <SelectItem value="lead">Team Lead</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" name="email" type="email" required />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="phone">Phone</Label>
                <Input id="phone" name="phone" type="tel" required />
              </div>
              <Button className="mt-2">Save Employee</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="schedule">Schedule</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
        </TabsList>
        <TabsContent value="overview" className="mt-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {employeeList.map((employee) => (
              <Card key={employee.id}>
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle>{employee.name}</CardTitle>
                      <CardDescription>{employee.role}</CardDescription>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="ghost" size="icon" onClick={() => setEditEmployee(employee)}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => router.push(`/employees/${employee.id}`)}>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="lucide lucide-external-link"
                        >
                          <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                          <polyline points="15 3 21 3 21 9" />
                          <line x1="10" x2="21" y1="14" y2="3" />
                        </svg>
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <p className="text-sm font-medium leading-none">Email</p>
                        <p className="text-sm text-muted-foreground">{employee.email}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm font-medium leading-none">Phone</p>
                        <p className="text-sm text-muted-foreground">{employee.phone}</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                      <div className="flex items-center gap-2">
                        <Star className="h-4 w-4 text-yellow-500" />
                        <span className="text-sm font-medium">{employee.performance}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Timer className="h-4 w-4 text-blue-500" />
                        <span className="text-sm font-medium">{employee.hoursThisMonth}h</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CalendarClock className="h-4 w-4 text-green-500" />
                        <span className="text-sm font-medium">{employee.assignedJobs}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
        <TabsContent value="schedule" className="mt-6">
          <EmployeeSchedule />
        </TabsContent>
        <TabsContent value="performance" className="mt-6">
          <EmployeePerformance />
        </TabsContent>
      </Tabs>

      {/* Edit Employee Dialog */}
      <Dialog open={!!editEmployee} onOpenChange={(open) => !open && setEditEmployee(null)}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Employee</DialogTitle>
          </DialogHeader>
          {editEmployee && (
            <form action={(formData) => handleEditEmployee(formData)} className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="edit-name">Full Name</Label>
                <Input id="edit-name" name="name" defaultValue={editEmployee.name} required />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-role">Role</Label>
                <Select name="role" defaultValue={editEmployee.role.toLowerCase()}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="cleaner">Cleaner</SelectItem>
                    <SelectItem value="senior cleaner">Senior Cleaner</SelectItem>
                    <SelectItem value="team lead">Team Lead</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-email">Email</Label>
                <Input id="edit-email" name="email" type="email" defaultValue={editEmployee.email} required />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-phone">Phone</Label>
                <Input id="edit-phone" name="phone" type="tel" defaultValue={editEmployee.phone} required />
              </div>
              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => setEditEmployee(null)}>
                  Cancel
                </Button>
                <Button type="submit">Save Changes</Button>
              </div>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

