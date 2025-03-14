"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Textarea } from "@/components/ui/textarea"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { format } from "date-fns"
import { CalendarIcon } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

type EmploymentStatusType = "active" | "terminated" | "laid_off" | "resigned"

interface EmploymentStatusDialogProps {
  employeeId: number
  employeeName: string
  open: boolean
  onOpenChange: (open: boolean) => void
  onStatusChange: (status: EmploymentStatusType, date: Date, reason: string) => Promise<void>
}

export function EmploymentStatusDialog({
  employeeId,
  employeeName,
  open,
  onOpenChange,
  onStatusChange,
}: EmploymentStatusDialogProps) {
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [statusType, setStatusType] = useState<EmploymentStatusType>("terminated")
  const [date, setDate] = useState<Date>(new Date())
  const [reason, setReason] = useState("")

  const handleSubmit = async () => {
    if (!reason) {
      toast({
        title: "Required Field",
        description: "Please provide a reason for this status change.",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)
    try {
      await onStatusChange(statusType, date, reason)
      toast({
        title: "Status Updated",
        description: `Employee status has been updated to ${formatStatus(statusType)}.`,
      })
      onOpenChange(false)
    } catch (error) {
      console.error("Failed to update employee status:", error)
      toast({
        title: "Update Failed",
        description: "There was an error updating the employee status. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const formatStatus = (status: EmploymentStatusType): string => {
    switch (status) {
      case "terminated":
        return "Terminated"
      case "laid_off":
        return "Laid Off"
      case "resigned":
        return "Resigned"
      default:
        return "Active"
    }
  }

  const getDialogTitle = (): string => {
    switch (statusType) {
      case "terminated":
        return "Terminate Employee"
      case "laid_off":
        return "Layoff Employee"
      case "resigned":
        return "Document Resignation"
      default:
        return "Change Employment Status"
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{getDialogTitle()}</DialogTitle>
          <DialogDescription>
            Update employment status for {employeeName}. This action will be recorded in their employment history.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label>Status Type</Label>
            <RadioGroup value={statusType} onValueChange={(value) => setStatusType(value as EmploymentStatusType)}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="terminated" id="terminated" />
                <Label htmlFor="terminated">Termination</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="laid_off" id="laid_off" />
                <Label htmlFor="laid_off">Layoff</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="resigned" id="resigned" />
                <Label htmlFor="resigned">Resignation</Label>
              </div>
            </RadioGroup>
          </div>

          <div className="space-y-2">
            <Label>Effective Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn("w-full justify-start text-left font-normal", !date && "text-muted-foreground")}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? format(date, "PPP") : "Select date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar mode="single" selected={date} onSelect={(date) => date && setDate(date)} initialFocus />
              </PopoverContent>
            </Popover>
          </div>

          <div className="space-y-2">
            <Label htmlFor="reason">Reason</Label>
            <Textarea
              id="reason"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder={
                statusType === "terminated"
                  ? "Provide reason for termination..."
                  : statusType === "laid_off"
                    ? "Provide reason for layoff..."
                    : "Provide details about resignation..."
              }
              className="min-h-[100px]"
              required
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={isLoading}>
            {isLoading ? "Processing..." : "Confirm"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

