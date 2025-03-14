import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { format } from "date-fns"
import { Calendar, Clock, MapPin, Users, Phone, Mail, Edit, Trash2 } from "lucide-react"

interface Appointment {
  id: number
  title: string
  date: Date
  startTime: string
  endTime: string
  client: string
  address: string
  type: number
  status: string
  employees: string[]
}

interface AppointmentType {
  id: number
  name: string
  color: string
}

interface AppointmentDetailsProps {
  appointment: Appointment
  appointmentTypes: AppointmentType[]
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function AppointmentDetails({ appointment, appointmentTypes, open, onOpenChange }: AppointmentDetailsProps) {
  const appointmentType = appointmentTypes.find((type) => type.id === appointment.type)

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle>{appointment.client}</DialogTitle>
            <Badge variant={appointment.status === "confirmed" ? "default" : "secondary"}>{appointment.status}</Badge>
          </div>
          <DialogDescription>
            <div className={`inline-block px-2 py-1 rounded text-white text-xs ${appointmentType?.color}`}>
              {appointmentType?.name}
            </div>
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-start">
              <Calendar className="h-5 w-5 mr-2 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Date</p>
                <p className="text-sm">{format(appointment.date, "EEEE, MMMM d, yyyy")}</p>
              </div>
            </div>

            <div className="flex items-start">
              <Clock className="h-5 w-5 mr-2 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Time</p>
                <p className="text-sm">
                  {appointment.startTime} - {appointment.endTime}
                </p>
              </div>
            </div>

            <div className="flex items-start">
              <MapPin className="h-5 w-5 mr-2 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Location</p>
                <p className="text-sm">{appointment.address}</p>
              </div>
            </div>

            <div className="flex items-start">
              <Users className="h-5 w-5 mr-2 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Assigned Employees</p>
                <p className="text-sm">{appointment.employees.join(", ")}</p>
              </div>
            </div>
          </div>

          <div className="border-t pt-4">
            <h4 className="text-sm font-medium mb-2">Client Information</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-start">
                <Phone className="h-5 w-5 mr-2 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Phone</p>
                  <p className="text-sm">(555) 123-4567</p>
                </div>
              </div>

              <div className="flex items-start">
                <Mail className="h-5 w-5 mr-2 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Email</p>
                  <p className="text-sm">{appointment.client.toLowerCase().replace(" ", ".")}@example.com</p>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t pt-4">
            <h4 className="text-sm font-medium mb-2">Notes</h4>
            <p className="text-sm text-muted-foreground">No notes available for this appointment.</p>
          </div>
        </div>

        <DialogFooter className="flex justify-between items-center">
          <Button variant="destructive" size="sm">
            <Trash2 className="h-4 w-4 mr-2" />
            Cancel Appointment
          </Button>
          <div className="flex space-x-2">
            <Button variant="outline">
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </Button>
            <Button>Complete</Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

