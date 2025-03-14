import { collection, addDoc, updateDoc, doc, getDoc, Timestamp } from "firebase/firestore"
import { db } from "@/lib/firebase/firebase"

// Type definitions
export interface Invoice {
  id: string
  invoiceId: string
  clientId: string
  serviceId: string
  serviceName: string
  serviceDate: string
  amount: number
  date: Timestamp
  dueDate: string
  status: "paid" | "pending" | "overdue"
  paymentDate?: Timestamp
  pdfUrl?: string
  lineItems: Array<{
    description: string
    quantity: number
    unitPrice: number
    total: number
  }>
  createdAt: Timestamp
}

// Get recent invoices for the current client
export const getRecentInvoices = async (clientId?: string) => {
  try {
    // For demo/preview purposes, return mock data immediately
    // This prevents any loading state from persisting indefinitely
    return [
      {
        id: "invoice-1",
        invoiceId: "INV-2024-001",
        date: "Apr 30, 2024",
        amount: 150.0,
        status: "paid",
      },
      {
        id: "invoice-2",
        invoiceId: "INV-2024-002",
        date: "May 7, 2024",
        amount: 120.0,
        status: "pending",
      },
    ]

    // Uncomment the below code when you have Firebase properly set up
    /*
    if (!clientId) {
      throw new Error("Client ID is required");
    }
    
    const invoicesRef = collection(db, "invoices");
    const q = query(
      invoicesRef,
      where("clientId", "==", clientId),
      orderBy("date", "desc"),
      limit(5)
    );
    
    const querySnapshot = await getDocs(q);
    const invoices = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    
    return invoices;
    */
  } catch (error) {
    console.error("Error getting recent invoices:", error)
    return []
  }
}

// Other invoice service functions...
export const createInvoice = async (invoiceData: Omit<Invoice, "id" | "createdAt">) => {
  try {
    const invoicesRef = collection(db, "invoices")
    const newInvoice = {
      ...invoiceData,
      createdAt: Timestamp.now(),
    }

    const docRef = await addDoc(invoicesRef, newInvoice)
    return { id: docRef.id, ...newInvoice }
  } catch (error) {
    console.error("Error creating invoice:", error)
    throw error
  }
}

export const getInvoiceById = async (invoiceId: string) => {
  try {
    const invoiceRef = doc(db, "invoices", invoiceId)
    const invoiceSnap = await getDoc(invoiceRef)

    if (invoiceSnap.exists()) {
      return { id: invoiceSnap.id, ...invoiceSnap.data() }
    } else {
      throw new Error("Invoice not found")
    }
  } catch (error) {
    console.error("Error getting invoice:", error)
    throw error
  }
}

export const updateInvoiceStatus = async (
  invoiceId: string,
  status: "paid" | "pending" | "overdue",
  paymentDate?: Date,
) => {
  try {
    const invoiceRef = doc(db, "invoices", invoiceId)
    const updateData: any = { status }

    if (status === "paid" && paymentDate) {
      updateData.paymentDate = Timestamp.fromDate(paymentDate)
    }

    await updateDoc(invoiceRef, updateData)
    return { success: true }
  } catch (error) {
    console.error("Error updating invoice status:", error)
    throw error
  }
}

