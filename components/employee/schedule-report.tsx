"use client"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { format, startOfWeek, endOfWeek, eachDayOfInterval, addWeeks, subWeeks } from "date-fns"
import { ChevronLeft, ChevronRight, Printer, Download } from "lucide-react"

interface ScheduleEntry {
  id: number
  date: Date
  startTime: string
  endTime: string
  jobName: string
  location: string
  status: "scheduled" | "completed" | "cancelled"
}

interface ScheduleReportProps {
  employeeId: number
  employeeName: string
  employeeRole: string
  scheduleEntries: ScheduleEntry[]
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ScheduleReport({
  employeeId,
  employeeName,
  employeeRole,
  scheduleEntries,
  open,
  onOpenChange,
}: ScheduleReportProps) {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [isLoading, setIsLoading] = useState(false)
  const printRef = useRef<HTMLDivElement>(null)

  const handlePrint = () => {
    setIsLoading(true)

    // Use browser's print functionality
    setTimeout(() => {
      const content = printRef.current
      const printWindow = window.open("", "_blank")

      if (content && printWindow) {
        printWindow.document.write(`
         <html>
           <head>
             <title>${employeeName}_Schedule_${format(currentDate, "yyyy-MM-dd")}</title>
             <style>
               body { font-family: system-ui, sans-serif; padding: 20px; }
               .print-header { text-align: center; margin-bottom: 20px; }
               table { width: 100%; border-collapse: collapse; }
               th { text-align: left; padding: 8px; background-color: #f1f1f1; }
               td { padding: 8px; border-top: 1px solid #ddd; vertical-align: top; }
               .summary { margin-top: 20px; }
               .footer { margin-top: 30px; text-align: center; font-size: 12px; color: #666; }
             </style>
           </head>
           <body>
             ${content.innerHTML}
           </body>
         </html>
       `)

        printWindow.document.close()
        printWindow.focus()
        printWindow.print()
        printWindow.onafterprint = () => {
          printWindow.close()
          setIsLoading(false)
        }
      } else {
        setIsLoading(false)
      }
    }, 100)
  }

  const handleExportPDF = () => {
    // In a real app, you would implement PDF export functionality here
    // For now, we'll just use the print functionality
    handlePrint()
  }

  const startDate = startOfWeek(currentDate, { weekStartsOn: 1 }) // Start on Monday
  const endDate = endOfWeek(currentDate, { weekStartsOn: 1 }) // End on Sunday
  const daysOfWeek = eachDayOfInterval({ start: startDate, end: endDate })

  const goToPreviousWeek = () => {
    setCurrentDate(subWeeks(currentDate, 1))
  }

  const goToNextWeek = () => {
    setCurrentDate(addWeeks(currentDate, 1))
  }

  const getEntriesForDate = (date: Date) => {
    return scheduleEntries.filter(
      (entry) =>
        entry.date.getDate() === date.getDate() &&
        entry.date.getMonth() === date.getMonth() &&
        entry.date.getFullYear() === date.getFullYear(),
    )
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>Schedule Report</DialogTitle>
        </DialogHeader>
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon" onClick={goToPreviousWeek}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="font-medium">
              {format(startDate, "MMM d, yyyy")} - {format(endDate, "MMM d, yyyy")}
            </span>
            <Button variant="outline" size="icon" onClick={goToNextWeek}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={handlePrint} disabled={isLoading}>
              <Printer className="mr-2 h-4 w-4" />
              {isLoading ? "Printing..." : "Print"}
            </Button>
            <Button variant="outline" onClick={handleExportPDF} disabled={isLoading}>
              <Download className="mr-2 h-4 w-4" />
              Export PDF
            </Button>
          </div>
        </div>

        <div ref={printRef} className="p-4 bg-white">
          <div className="text-center mb-6 print:mb-4">
            <h1 className="text-2xl font-bold print:text-xl">Employee Schedule Report</h1>
            <p className="text-muted-foreground">
              {format(startDate, "MMMM d, yyyy")} - {format(endDate, "MMMM d, yyyy")}
            </p>
          </div>

          <div className="mb-6 print:mb-4">
            <h2 className="text-lg font-semibold print:text-base">Employee Information</h2>
            <div className="grid grid-cols-2 gap-4 mt-2">
              <div>
                <p className="text-sm text-muted-foreground">Name:</p>
                <p className="font-medium">{employeeName}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Role:</p>
                <p>{employeeRole}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Employee ID:</p>
                <p>{employeeId}</p>
              </div>
            </div>
          </div>

          <div className="border rounded-md overflow-hidden print:border-black">
            <table className="w-full">
              <thead>
                <tr className="bg-muted print:bg-gray-200">
                  <th className="px-4 py-2 text-left font-medium text-sm">Day</th>
                  <th className="px-4 py-2 text-left font-medium text-sm">Date</th>
                  <th className="px-4 py-2 text-left font-medium text-sm">Schedule</th>
                </tr>
              </thead>
              <tbody>
                {daysOfWeek.map((day) => {
                  const entries = getEntriesForDate(day)
                  return (
                    <tr key={day.toString()} className="border-t print:border-black">
                      <td className="px-4 py-3 align-top">
                        <span className="font-medium">{format(day, "EEEE")}</span>
                      </td>
                      <td className="px-4 py-3 align-top">{format(day, "MMM d, yyyy")}</td>
                      <td className="px-4 py-3">
                        {entries.length > 0 ? (
                          <div className="space-y-2">
                            {entries.map((entry) => (
                              <div key={entry.id} className="text-sm">
                                <div className="font-medium">{entry.jobName}</div>
                                <div className="text-muted-foreground">
                                  {entry.startTime} - {entry.endTime}
                                </div>
                                <div className="text-muted-foreground">{entry.location}</div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <span className="text-sm text-muted-foreground">No scheduled work</span>
                        )}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>

          <div className="mt-6 print:mt-4">
            <h3 className="text-sm font-medium mb-2">Summary</h3>
            <div className="text-sm">
              <p>
                <span className="font-medium">Total Scheduled Jobs:</span>{" "}
                {scheduleEntries.filter((entry) => entry.status === "scheduled").length}
              </p>
              <p>
                <span className="font-medium">Total Hours:</span>{" "}
                {scheduleEntries
                  .reduce((total, entry) => {
                    const startHour = Number.parseInt(entry.startTime.split(":")[0])
                    const startMinute = Number.parseInt(entry.startTime.split(":")[1])
                    const endHour = Number.parseInt(entry.endTime.split(":")[0])
                    const endMinute = Number.parseInt(entry.endTime.split(":")[1])

                    const hours = endHour - startHour + (endMinute - startMinute) / 60
                    return total + hours
                  }, 0)
                  .toFixed(2)}
              </p>
            </div>
          </div>

          <div className="mt-8 text-xs text-muted-foreground text-center print:mt-6">
            <p>Generated on {format(new Date(), "MMMM d, yyyy 'at' h:mm a")}</p>
            <p>CleanPro Manager</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

