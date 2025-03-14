"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"
import type { Employee } from "@/lib/types"
import { DollarSign } from "lucide-react"

interface EditPayrollInfoProps {
  employee: Employee
  onUpdateHourlyRate: (hourlyRate: number) => Promise<void>
}

export function EditPayrollInfo({ employee, onUpdateHourlyRate }: EditPayrollInfoProps) {
  const { toast } = useToast()
  const [hourlyRate, setHourlyRate] = useState(employee.hourlyRate)
  const [isLoading, setIsLoading] = useState(false)

  const handleUpdateRate = async (formData: FormData) => {
    const newRate = Number.parseFloat(formData.get("hourlyRate") as string)
    setIsLoading(true)

    try {
      await onUpdateHourlyRate(newRate)
      setHourlyRate(newRate)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update hourly rate. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const calculatePeriodEarnings = (hours: number) => {
    return (hours * hourlyRate).toFixed(2)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Payroll Information</h2>
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline">Update Hourly Rate</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Update Hourly Rate</DialogTitle>
            </DialogHeader>
            <form action={(formData) => handleUpdateRate(formData)} className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="hourlyRate">New Hourly Rate ($)</Label>
                <Input id="hourlyRate" name="hourlyRate" type="number" step="0.01" defaultValue={hourlyRate} required />
              </div>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Saving..." : "Save New Rate"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Current Pay Period</CardTitle>
            <CardDescription>February 1 - February 15, 2024</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Hours Worked</span>
                <span>{employee.hoursThisMonth} hours</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Hourly Rate</span>
                <span>${hourlyRate.toFixed(2)}</span>
              </div>
              <div className="flex items-center justify-between border-t pt-4">
                <span className="text-sm font-medium">Gross Earnings</span>
                <span className="text-lg font-bold text-green-600">
                  ${calculatePeriodEarnings(employee.hoursThisMonth)}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>YTD Summary</CardTitle>
            <CardDescription>January 1 - December 31, 2024</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="rounded-lg bg-muted p-4">
                <div className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5 text-green-600" />
                  <span className="text-lg font-bold">$14,567.89</span>
                </div>
                <p className="text-sm text-muted-foreground">Total earnings this year</p>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Total Hours</span>
                  <span>582.5</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Average Weekly Hours</span>
                  <span>38.5</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Overtime Hours</span>
                  <span>24.5</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Payroll Settings</CardTitle>
          <CardDescription>Configure employee payroll settings</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="paymentMethod">Payment Method</Label>
                <select
                  id="paymentMethod"
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                  defaultValue="directDeposit"
                >
                  <option value="directDeposit">Direct Deposit</option>
                  <option value="check">Check</option>
                  <option value="cash">Cash</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="payFrequency">Pay Frequency</Label>
                <select
                  id="payFrequency"
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                  defaultValue="biweekly"
                >
                  <option value="weekly">Weekly</option>
                  <option value="biweekly">Bi-weekly</option>
                  <option value="monthly">Monthly</option>
                </select>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="taxWithholding">Tax Withholding</Label>
              <Input id="taxWithholding" type="number" defaultValue="20" min="0" max="100" />
              <p className="text-xs text-muted-foreground">Percentage of income to withhold for taxes</p>
            </div>
            <Button>Save Payroll Settings</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

