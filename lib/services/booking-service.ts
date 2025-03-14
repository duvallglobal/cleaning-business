import { collection, addDoc, updateDoc, doc, getDoc, Timestamp } from "firebase/firestore"
import { db } from "@/lib/firebase/firebase"

// Type definitions
export interface Booking {
  id: string
  clientId: string
  service: string
  date: string
  time: string
  bedrooms?: number
  bathrooms?: number
  address?: string
  notes?: string
  estimatedPrice?: number
  recurringType: "none" | "weekly" | "biweekly" | "monthly"
  status: "confirmed" | "pending" | "completed" | "cancelled"
  assignedEmployeeId?: string
  createdAt: Timestamp
}

// Get upcoming bookings for the current client
export const getUpcomingBookings = async (clientId?: string) => {
  try {
    // For demo/preview purposes, return mock data immediately
    // This prevents any loading state from persisting indefinitely
    return [
      {
        id: "booking-1",
        service: "Deep Cleaning",
        date: "May 15, 2024",
        time: "10:00 AM",
        status: "confirmed",
      },
      {
        id: "booking-2",
        service: "Regular Cleaning",
        date: "May 22, 2024",
        time: "2:00 PM",
        status: "confirmed",
      },
    ]

    // Uncomment the below code when you have Firebase properly set up
    /*
    if (!clientId) {
      throw new Error("Client ID is required");
    }
    
    const bookingsRef = collection(db, "bookings");
    const today = new Date();
    
    // Format today as string for comparison (assuming date is stored as string)
    const todayStr = today.toISOString().split('T')[0];
    
    const q = query(
      bookingsRef,
      where("clientId", "==", clientId),
      where("date", ">=", todayStr),
      where("status", "in", ["confirmed", "pending"]),
      orderBy("date", "asc"),
      limit(5)
    );
    
    const querySnapshot = await getDocs(q);
    const bookings = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    
    return bookings;
    */
  } catch (error) {
    console.error("Error getting upcoming bookings:", error)
    return []
  }
}

// Other booking service functions...
export const createBooking = async (bookingData: Omit<Booking, "id" | "createdAt">) => {
  try {
    const bookingsRef = collection(db, "bookings")
    const newBooking = {
      ...bookingData,
      createdAt: Timestamp.now(),
    }

    const docRef = await addDoc(bookingsRef, newBooking)
    return { id: docRef.id, ...newBooking }
  } catch (error) {
    console.error("Error creating booking:", error)
    throw error
  }
}

export const getBookingById = async (bookingId: string) => {
  try {
    const bookingRef = doc(db, "bookings", bookingId)
    const bookingSnap = await getDoc(bookingRef)

    if (bookingSnap.exists()) {
      return { id: bookingSnap.id, ...bookingSnap.data() }
    } else {
      throw new Error("Booking not found")
    }
  } catch (error) {
    console.error("Error getting booking:", error)
    throw error
  }
}

export const updateBooking = async (bookingId: string, bookingData: Partial<Booking>) => {
  try {
    const bookingRef = doc(db, "bookings", bookingId)
    await updateDoc(bookingRef, bookingData)
    return { id: bookingId, ...bookingData }
  } catch (error) {
    console.error("Error updating booking:", error)
    throw error
  }
}

export const cancelBooking = async (bookingId: string) => {
  try {
    const bookingRef = doc(db, "bookings", bookingId)
    await updateDoc(bookingRef, { status: "cancelled" })
    return { success: true }
  } catch (error) {
    console.error("Error cancelling booking:", error)
    throw error
  }
}

