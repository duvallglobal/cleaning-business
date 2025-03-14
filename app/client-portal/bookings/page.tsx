"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"
import { Plus, CalendarIcon, Clock, MapPin } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

const services = [
  {
    id: 1,
    name: "Deep Cleaning",
    duration: "4-6 hours",
    price: "$350",
    description: "Thorough cleaning of all surfaces including hard-to-reach areas",
    basePrice: 350,
    bedroomPrice: 50,
    bathroomPrice: 75,
  },
  {
    id: 2,
    name: "Regular Maintenance",
    duration: "2-3 hours",
    price: "$150",
    description: "Weekly or bi-weekly cleaning to maintain cleanliness",
    basePrice: 150,
    bedroomPrice: 25,
    bathroomPrice: 40,
  },
  {
    id: 3,
    name: "Window Cleaning",
    duration: "2-4 hours",
    price: "$200",
    description: "Professional cleaning of all windows, inside and out",
    basePrice: 200,
    bedroomPrice: 20,
    bathroomPrice: 0,
  },
]

const timeSlots = ["08:00", "09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00"]

interface Booking {
  id: number
  service: string
  date: string
  time: string
  bedrooms?: number
  bathrooms?: number
  status: "confirmed" | "pending" | "completed" | "cancelled"
  notes?: string
  address?: string
  estimatedPrice?: number
  recurringType?: "none" | "weekly" | "biweekly" | "monthly"
}

export default function BookingsPage() {
  const { toast } = useToast()
  const [date, setDate] = useState<Date | undefined>(new Date())
  const [bookings, setBookings] = useState<Booking[]>([
    {
      id: 1,
      service: "Regular Maintenance",
      date: "2024-02-25",
      time: "14:00",
      bedrooms: 3,
      bathrooms: 2,
      status: "confirmed",
      address: "123 Main St, Anytown, USA",
      estimatedPrice: 230,
    },
    {
      id: 2,
      service: "Window Cleaning",
      date: "2024-03-10",
      time: "10:00",
      status: "pending",
      address: "456 Oak Ave, Somewhere, USA",
      estimatedPrice: 200,
    },
  ])

  const [selectedService, setSelectedService] = useState<(typeof services)[0] | null>(null)
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date())
  const [selectedTime, setSelectedTime] = useState<string>("")
  const [bedrooms, setBedrooms] = useState(2)
  const [bathrooms, setBathrooms] = useState(1)
  const [notes, setNotes] = useState("")
  const [address, setAddress] = useState("")
  const [recurringType, setRecurringType] = useState<"none" | "weekly" | "biweekly" | "monthly">("none")
  const [bookingStep, setBookingStep] = useState(1)
  const [estimatedPrice, setEstimatedPrice] = useState(0)

  // Calculate available time slots for the selected date
  const getAvailableTimeSlots = (date: Date | undefined) => {
    if (!date) return timeSlots

    // Filter out times that are already booked for this date
    const dateString = date.toISOString().split("T")[0]
    const bookedTimes = bookings.filter((booking) => booking.date === dateString).map((booking) => booking.time)

    return timeSlots.filter((time) => !bookedTimes.includes(time))
  }

  const availableTimeSlots = getAvailableTimeSlots(selectedDate)

  // Calculate estimated price
  const calculatePrice = () => {
    if (!selectedService) return 0

    const basePrice = selectedService.basePrice
    const bedroomCost = selectedService.bedroomPrice * bedrooms
    const bathroomCost = selectedService.bathroomPrice * bathrooms

    return basePrice + bedroomCost + bathroomCost
  }

  // Update price when relevant fields change
  const updateEstimatedPrice = () => {
    const price = calculatePrice()
    setEstimatedPrice(price)
    return price
  }

  const handleServiceSelect = (serviceId: string) => {
    const service = services.find((s) => s.id.toString() === serviceId)
    setSelectedService(service || null)
    if (service) {
      updateEstimatedPrice()
    }
  }

  const handleNextStep = () => {
    if (bookingStep === 1 && !selectedService) {
      toast({
        title: "Please select a service",
        variant: "destructive",
      })
      return
    }

    if (bookingStep === 2 && (!selectedDate || !selectedTime)) {
      toast({
        title: "Please select a date and time",
        variant: "destructive",
      })
      return
    }

    if (bookingStep === 3) {
      updateEstimatedPrice()
    }

    if (bookingStep < 4) {
      setBookingStep(bookingStep + 1)
    }
  }

  const handlePreviousStep = () => {
    if (bookingStep > 1) {
      setBookingStep(bookingStep - 1)
    }
  }

  const handleNewBooking = () => {
    if (!selectedService || !selectedDate || !selectedTime) {
      toast({
        title: "Missing Information",
        description: "Please complete all required fields.",
        variant: "destructive",
      })
      return
    }

    const price = updateEstimatedPrice()

    const newBooking: Booking = {
      id: bookings.length + 1,
      service: selectedService.name,
      date: selectedDate.toISOString().split("T")[0],
      time: selectedTime,
      bedrooms: bedrooms,
      bathrooms: bathrooms,
      status: "pending",
      notes: notes,
      address: address,
      estimatedPrice: price,
      recurringType: recurringType,
    }

    setBookings([...bookings, newBooking])

    // Reset form
    setSelectedService(null)
    setSelectedDate(new Date())
    setSelectedTime("")
    setBedrooms(2)
    setBathrooms(1)
    setNotes("")
    setAddress("")
    setRecurringType("none")
    setBookingStep(1)

    toast({
      title: "Booking Requested",
      description: "Your booking request has been submitted for confirmation.",
    })
  }

  const handleCancelBooking = (bookingId: number) => {
    setBookings(
      bookings.map((booking) => (booking.id === bookingId ? { ...booking, status: "cancelled" as const } : booking)),
    )
    toast({
      title: "Booking Cancelled",
      description: "Your booking has been cancelled successfully.",
    })
  }

  // Filter bookings for the selected date
  const getBookingsForDate = (selectedDate: Date | undefined) => {
    if (!selectedDate) return []

    const dateString = selectedDate.toISOString().split("T")[0]
    return bookings.filter((booking) => booking.date === dateString)
  }

  const selectedDateBookings = getBookingsForDate(date)

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Bookings</h1>
        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              New Booking
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Schedule New Service</DialogTitle>
            </DialogHeader>

            <div className="mt-4">
              <div className="mb-4">
                <div className="flex justify-between mb-2">
                  {[1, 2, 3, 4].map((step) => (
                    <div
                      key={step}
                      className={`flex items-center justify-center w-8 h-8 rounded-full ${
                        bookingStep === step
                          ? "bg-primary text-primary-foreground"
                          : bookingStep > step
                            ? "bg-primary/20 text-primary"
                            : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {step}
                    </div>
                  ))}
                </div>
                <div className="relative w-full h-2 bg-muted rounded-full">
                  <div
                    className="absolute top-0 left-0 h-2 bg-primary rounded-full transition-all"
                    style={{ width: `${(bookingStep / 4) * 100}%` }}
                  ></div>
                </div>
              </div>

              {bookingStep === 1 && (
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Select Service</h3>
                  <div className="grid gap-4">
                    {services.map((service) => (
                      <div
                        key={service.id}
                        className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                          selectedService?.id === service.id ? "border-primary bg-primary/5" : "hover:bg-muted"
                        }`}
                        onClick={() => handleServiceSelect(service.id.toString())}
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-medium">{service.name}</h4>
                            <p className="text-sm text-muted-foreground">{service.description}</p>
                            <p className="text-sm mt-1">Duration: {service.duration}</p>
                          </div>
                          <div className="text-right">
                            <p className="font-medium">{service.price}</p>
                            <p className="text-xs text-muted-foreground">Base price</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {bookingStep === 2 && (
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Select Date & Time</h3>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <Label>Select Date</Label>
                      <div className="mt-2">
                        <Calendar
                          mode="single"
                          selected={selectedDate}
                          onSelect={setSelectedDate}
                          className="rounded-md border"
                          disabled={(date) => {
                            // Disable past dates and Sundays
                            const today = new Date()
                            today.setHours(0, 0, 0, 0)
                            return date < today || date.getDay() === 0
                          }}
                        />
                      </div>
                    </div>
                    <div>
                      <Label>Select Time</Label>
                      <div className="mt-2 grid grid-cols-2 gap-2">
                        {availableTimeSlots.length > 0 ? (
                          availableTimeSlots.map((time) => (
                            <Button
                              key={time}
                              type="button"
                              variant={selectedTime === time ? "default" : "outline"}
                              className="justify-start"
                              onClick={() => setSelectedTime(time)}
                            >
                              <Clock className="mr-2 h-4 w-4" />
                              {Number.parseInt(time.split(":")[0]) > 12
                                ? `${Number.parseInt(time.split(":")[0]) - 12}:${time.split(":")[1]} PM`
                                : `${time} AM`}
                            </Button>
                          ))
                        ) : (
                          <p className="col-span-2 text-center text-muted-foreground py-4">
                            No available time slots for this date
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {bookingStep === 3 && (
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Service Details</h3>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="bedrooms">Number of Bedrooms</Label>
                      <Input
                        id="bedrooms"
                        type="number"
                        min="1"
                        value={bedrooms}
                        onChange={(e) => setBedrooms(Number.parseInt(e.target.value))}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="bathrooms">Number of Bathrooms</Label>
                      <Input
                        id="bathrooms"
                        type="number"
                        min="1"
                        value={bathrooms}
                        onChange={(e) => setBathrooms(Number.parseInt(e.target.value))}
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="address">Service Address</Label>
                    <Textarea
                      id="address"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      placeholder="Enter your full address"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="notes">Special Instructions</Label>
                    <Textarea
                      id="notes"
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="Any special instructions or notes"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Recurring Service</Label>
                    <RadioGroup
                      value={recurringType}
                      onValueChange={(value) => setRecurringType(value as any)}
                      className="flex flex-wrap gap-4"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="none" id="none" />
                        <Label htmlFor="none">One-time</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="weekly" id="weekly" />
                        <Label htmlFor="weekly">Weekly</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="biweekly" id="biweekly" />
                        <Label htmlFor="biweekly">Bi-weekly</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="monthly" id="monthly" />
                        <Label htmlFor="monthly">Monthly</Label>
                      </div>
                    </RadioGroup>
                  </div>
                </div>
              )}

              {bookingStep === 4 && (
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Review & Confirm</h3>

                  <div className="rounded-lg border p-4 space-y-3">
                    <div className="flex justify-between">
                      <div>
                        <h4 className="font-medium">{selectedService?.name}</h4>
                        <p className="text-sm text-muted-foreground">
                          {selectedDate?.toLocaleDateString("en-US", {
                            weekday: "long",
                            month: "long",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {selectedTime &&
                            (Number.parseInt(selectedTime.split(":")[0]) > 12
                              ? `${Number.parseInt(selectedTime.split(":")[0]) - 12}:${selectedTime.split(":")[1]} PM`
                              : `${selectedTime} AM`)}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">${estimatedPrice}</p>
                        <p className="text-xs text-muted-foreground">Estimated price</p>
                      </div>
                    </div>

                    <div className="pt-3 border-t">
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div>
                          <span className="text-muted-foreground">Bedrooms:</span> {bedrooms}
                        </div>
                        <div>
                          <span className="text-muted-foreground">Bathrooms:</span> {bathrooms}
                        </div>
                        <div className="col-span-2">
                          <span className="text-muted-foreground">Address:</span> {address}
                        </div>
                        {notes && (
                          <div className="col-span-2">
                            <span className="text-muted-foreground">Notes:</span> {notes}
                          </div>
                        )}
                        <div className="col-span-2">
                          <span className="text-muted-foreground">Recurring:</span>{" "}
                          {recurringType === "none"
                            ? "One-time service"
                            : recurringType === "weekly"
                              ? "Weekly service"
                              : recurringType === "biweekly"
                                ? "Bi-weekly service"
                                : "Monthly service"}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="rounded-lg border p-4">
                    <h4 className="font-medium mb-2">Price Breakdown</h4>
                    <div className="space-y-1 text-sm">
                      <div className="flex justify-between">
                        <span>Base price:</span>
                        <span>${selectedService?.basePrice}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>
                          Bedrooms ({bedrooms} × ${selectedService?.bedroomPrice}):
                        </span>
                        <span>${selectedService ? selectedService.bedroomPrice * bedrooms : 0}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>
                          Bathrooms ({bathrooms} × ${selectedService?.bathroomPrice}):
                        </span>
                        <span>${selectedService ? selectedService.bathroomPrice * bathrooms : 0}</span>
                      </div>
                      <div className="flex justify-between font-medium pt-2 border-t mt-2">
                        <span>Total estimated price:</span>
                        <span>${estimatedPrice}</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div className="flex justify-between mt-6">
                <Button
                  type="button"
                  variant="outline"
                  onClick={bookingStep === 1 ? () => {} : handlePreviousStep}
                  disabled={bookingStep === 1}
                >
                  Back
                </Button>
                <Button type="button" onClick={bookingStep === 4 ? handleNewBooking : handleNextStep}>
                  {bookingStep === 4 ? "Confirm Booking" : "Next"}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-6 md:grid-cols-[1fr_300px]">
        <Card>
          <CardHeader>
            <Tabs defaultValue="upcoming">
              <TabsList>
                <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
                <TabsTrigger value="past">Past</TabsTrigger>
                <TabsTrigger value="cancelled">Cancelled</TabsTrigger>
              </TabsList>
            </Tabs>
          </CardHeader>
          <CardContent>
            <TabsContent value="upcoming" className="mt-0">
              <div className="space-y-4">
                {bookings
                  .filter(
                    (booking) =>
                      (booking.status === "confirmed" || booking.status === "pending") &&
                      new Date(booking.date) >= new Date(new Date().setHours(0, 0, 0, 0)),
                  )
                  .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
                  .map((booking) => (
                    <div key={booking.id} className="rounded-lg border p-4">
                      <div className="flex items-center justify-between">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <h3 className="font-medium">{booking.service}</h3>
                            <Badge
                              variant={
                                booking.status === "confirmed"
                                  ? "outline"
                                  : booking.status === "pending"
                                    ? "secondary"
                                    : "default"
                              }
                            >
                              {booking.status}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <CalendarIcon className="h-4 w-4" />
                            <span>
                              {new Date(booking.date).toLocaleDateString("en-US", {
                                weekday: "short",
                                month: "short",
                                day: "numeric",
                              })}
                            </span>
                            <Clock className="h-4 w-4 ml-2" />
                            <span>
                              {Number.parseInt(booking.time.split(":")[0]) > 12
                                ? `${Number.parseInt(booking.time.split(":")[0]) - 12}:${booking.time.split(":")[1]} PM`
                                : `${booking.time} AM`}
                            </span>
                          </div>
                          {booking.address && (
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <MapPin className="h-4 w-4" />
                              <span>{booking.address}</span>
                            </div>
                          )}
                          {(booking.bedrooms !== undefined || booking.bathrooms !== undefined) && (
                            <p className="text-sm text-muted-foreground">
                              {booking.bedrooms} bedroom{booking.bedrooms !== 1 ? "s" : ""}, {booking.bathrooms}{" "}
                              bathroom
                              {booking.bathrooms !== 1 ? "s" : ""}
                            </p>
                          )}
                          {booking.notes && <p className="text-sm text-muted-foreground">Note: {booking.notes}</p>}
                        </div>
                        <div className="flex flex-col items-end gap-2">
                          {booking.estimatedPrice && <span className="font-medium">${booking.estimatedPrice}</span>}
                          {(booking.status === "confirmed" || booking.status === "pending") && (
                            <Button variant="outline" size="sm" onClick={() => handleCancelBooking(booking.id)}>
                              Cancel
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                {bookings.filter(
                  (booking) =>
                    (booking.status === "confirmed" || booking.status === "pending") &&
                    new Date(booking.date) >= new Date(new Date().setHours(0, 0, 0, 0)),
                ).length === 0 && (
                  <div className="flex h-40 items-center justify-center rounded-lg border border-dashed">
                    <div className="text-center">
                      <p className="text-sm text-muted-foreground">No upcoming bookings</p>
                      <Button
                        variant="outline"
                        className="mt-4"
                        onClick={() => document.querySelector('[aria-label="New Booking"]')?.click()}
                      >
                        Schedule a Service
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="past" className="mt-0">
              <div className="space-y-4">
                {bookings
                  .filter(
                    (booking) =>
                      booking.status === "completed" ||
                      (new Date(booking.date) < new Date(new Date().setHours(0, 0, 0, 0)) &&
                        booking.status !== "cancelled"),
                  )
                  .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                  .map((booking) => (
                    <div key={booking.id} className="rounded-lg border p-4">
                      <div className="flex items-center justify-between">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <h3 className="font-medium">{booking.service}</h3>
                            <Badge variant="outline">completed</Badge>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <CalendarIcon className="h-4 w-4" />
                            <span>
                              {new Date(booking.date).toLocaleDateString("en-US", {
                                weekday: "short",
                                month: "short",
                                day: "numeric",
                              })}
                            </span>
                            <Clock className="h-4 w-4 ml-2" />
                            <span>{booking.time}</span>
                          </div>
                          {(booking.bedrooms !== undefined || booking.bathrooms !== undefined) && (
                            <p className="text-sm text-muted-foreground">
                              {booking.bedrooms} bedroom{booking.bedrooms !== 1 ? "s" : ""}, {booking.bathrooms}{" "}
                              bathroom
                              {booking.bathrooms !== 1 ? "s" : ""}
                            </p>
                          )}
                        </div>
                        <div>
                          {booking.estimatedPrice && <span className="font-medium">${booking.estimatedPrice}</span>}
                        </div>
                      </div>
                    </div>
                  ))}
                {bookings.filter(
                  (booking) =>
                    booking.status === "completed" ||
                    (new Date(booking.date) < new Date(new Date().setHours(0, 0, 0, 0)) &&
                      booking.status !== "cancelled"),
                ).length === 0 && (
                  <div className="flex h-40 items-center justify-center rounded-lg border border-dashed">
                    <p className="text-sm text-muted-foreground">No past bookings</p>
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="cancelled" className="mt-0">
              <div className="space-y-4">
                {bookings
                  .filter((booking) => booking.status === "cancelled")
                  .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                  .map((booking) => (
                    <div key={booking.id} className="rounded-lg border p-4">
                      <div className="flex items-center justify-between">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <h3 className="font-medium">{booking.service}</h3>
                            <Badge variant="destructive">cancelled</Badge>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <CalendarIcon className="h-4 w-4" />
                            <span>
                              {new Date(booking.date).toLocaleDateString("en-US", {
                                weekday: "short",
                                month: "short",
                                day: "numeric",
                              })}
                            </span>
                            <Clock className="h-4 w-4 ml-2" />
                            <span>{booking.time}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                {bookings.filter((booking) => booking.status === "cancelled").length === 0 && (
                  <div className="flex h-40 items-center justify-center rounded-lg border border-dashed">
                    <p className="text-sm text-muted-foreground">No cancelled bookings</p>
                  </div>
                )}
              </div>
            </TabsContent>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <Calendar mode="single" selected={date} onSelect={setDate} className="rounded-md border" />

            <div className="mt-6">
              <h3 className="font-medium mb-2">
                {date
                  ? date.toLocaleDateString("en-US", {
                      weekday: "long",
                      month: "long",
                      day: "numeric",
                    })
                  : "Select a date"}
              </h3>

              {selectedDateBookings.length > 0 ? (
                <div className="space-y-2">
                  {selectedDateBookings.map((booking) => (
                    <div key={booking.id} className="rounded-lg bg-muted p-3 text-sm">
                      <div className="flex justify-between">
                        <span className="font-medium">{booking.service}</span>
                        <Badge
                          variant={
                            booking.status === "confirmed"
                              ? "outline"
                              : booking.status === "pending"
                                ? "secondary"
                                : booking.status === "cancelled"
                                  ? "destructive"
                                  : "default"
                          }
                        >
                          {booking.status}
                        </Badge>
                      </div>
                      <div className="mt-1 text-muted-foreground">
                        {booking.time} • ${booking.estimatedPrice}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="rounded-lg border border-dashed p-4 text-center">
                  <p className="text-sm text-muted-foreground">No bookings for this date</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

