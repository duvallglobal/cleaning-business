// This file contains API functions for the client portal
// In a real application, these would make actual API calls to your backend

// Simulated API delay
const apiDelay = (ms = 800) => new Promise((resolve) => setTimeout(resolve, ms))

// Mock client data
const mockClient = {
  id: 1,
  name: "Sarah Thompson",
  email: "sarah.t@example.com",
  phone: "(555) 123-4567",
  address: "123 Main St, Anytown, USA",
}

// Mock data for dashboard
const mockDashboardData = {
  nextService: {
    date: "Feb 25, 2024",
    service: "Regular Maintenance",
    time: "2:00 PM",
    duration: "2-hour duration",
  },
  outstandingBalance: {
    amount: 150.0,
    dueIn: 7,
  },
  newMessages: 2,
}

// Mock data for upcoming services
const mockUpcomingServices = [
  {
    id: 1,
    serviceName: "Regular Maintenance",
    date: "2024-02-25",
    time: "14:00",
    duration: "2 hours",
  },
  {
    id: 2,
    serviceName: "Window Cleaning",
    date: "2024-03-10",
    time: "10:00",
    duration: "3 hours",
  },
]

// Mock data for recent invoices
const mockRecentInvoices = [
  {
    id: 1,
    serviceName: "Deep Cleaning Service",
    date: "Jan 15, 2024",
    amount: 350.0,
    status: "paid" as const,
    downloadUrl: "/invoices/INV-001.pdf",
  },
  {
    id: 2,
    serviceName: "Window Cleaning",
    date: "Jan 30, 2024",
    amount: 200.0,
    status: "pending" as const,
    downloadUrl: "/invoices/INV-002.pdf",
  },
]

// Mock data for service history
const mockServiceHistory = [
  {
    id: 1,
    service: "Deep Cleaning",
    date: "2024-01-15",
    time: "09:00",
    cost: "$350",
    team: "Team A",
    rating: 5,
    review: "Excellent service! Very thorough and professional.",
    invoiceUrl: "/invoices/INV-001.pdf",
  },
  {
    id: 2,
    service: "Window Cleaning",
    date: "2024-01-30",
    time: "14:00",
    cost: "$200",
    team: "Team B",
    rating: 4,
    review: "Good job overall. Windows are sparkling clean.",
    invoiceUrl: "/invoices/INV-002.pdf",
  },
]

// Mock data for messages
const mockMessages = [
  {
    id: 1,
    subject: "Upcoming Service Reminder",
    message: "This is a reminder about your scheduled cleaning service tomorrow at 2:00 PM.",
    date: "2024-02-19",
    sender: "company",
    read: false,
  },
  {
    id: 2,
    subject: "Service Feedback",
    message: "Thank you for your recent feedback! We appreciate your input.",
    date: "2024-02-18",
    sender: "company",
    read: true,
  },
]

// Mock data for notifications
const mockNotifications = [
  {
    id: 1,
    title: "Booking Confirmed",
    message: "Your cleaning service for Feb 25 has been confirmed.",
    date: "2024-02-19",
    type: "booking",
    read: false,
  },
  {
    id: 2,
    title: "Payment Received",
    message: "Payment of $150 has been processed successfully.",
    date: "2024-02-18",
    type: "payment",
    read: true,
  },
]

// Session management (simulated)
let isAuthenticated = false
let currentClient = null

/**
 * Login a client
 */
export async function loginClient(email: string, password: string) {
  await apiDelay()

  // In a real app, this would be an API call to authenticate
  // Example: return await fetch('/api/client-portal/login', {
  //   method: 'POST',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify({ email, password }),
  // }).then(res => res.json())

  // For demo purposes, accept any email/password with basic validation
  if (!email || !password || password.length < 4) {
    throw new Error("Invalid credentials")
  }

  // Set authentication state
  isAuthenticated = true
  currentClient = { ...mockClient, email }

  // Store in session storage for persistence
  if (typeof window !== "undefined") {
    sessionStorage.setItem("clientPortalAuth", JSON.stringify({ isAuthenticated, client: currentClient }))
  }

  return currentClient
}

/**
 * Logout a client
 */
export async function logoutClient() {
  await apiDelay(400)

  // In a real app, this would be an API call to logout
  // Example: return await fetch('/api/client-portal/logout', { method: 'POST' })

  // Clear authentication state
  isAuthenticated = false
  currentClient = null

  // Clear from session storage
  if (typeof window !== "undefined") {
    sessionStorage.removeItem("clientPortalAuth")
  }

  return { success: true }
}

/**
 * Get current client
 */
export async function getCurrentClient() {
  // Check session storage first
  if (typeof window !== "undefined") {
    const stored = sessionStorage.getItem("clientPortalAuth")
    if (stored) {
      const { isAuthenticated: storedAuth, client } = JSON.parse(stored)
      if (storedAuth && client) {
        isAuthenticated = storedAuth
        currentClient = client
        return client
      }
    }
  }

  // In a real app, this would be an API call to check session
  // Example: return await fetch('/api/client-portal/me').then(res => res.json())

  if (!isAuthenticated || !currentClient) {
    return null
  }

  return currentClient
}

/**
 * Fetch dashboard data for a client
 */
export async function fetchDashboardData(clientId: number) {
  if (!clientId) throw new Error("Client ID is required")

  await apiDelay()

  // In a real app, you would fetch this data from your API
  // Example: return await fetch(`/api/client-portal/dashboard?clientId=${clientId}`).then(res => res.json())

  // For demonstration, we'll return mock data with slight randomization
  return {
    ...mockDashboardData,
    newMessages: Math.floor(Math.random() * 5), // Randomize for demo purposes
    lastUpdated: new Date(),
  }
}

/**
 * Fetch upcoming services for a client
 */
export async function fetchUpcomingServices(clientId: number) {
  if (!clientId) throw new Error("Client ID is required")

  await apiDelay()

  // In a real app, you would fetch this data from your API
  // Example: return await fetch(`/api/client-portal/services?clientId=${clientId}`).then(res => res.json())

  return mockUpcomingServices
}

/**
 * Reschedule a service
 */
export async function rescheduleService(serviceId: number, newDate: string, newTime: string) {
  if (!serviceId) throw new Error("Service ID is required")

  await apiDelay()

  // In a real app, you would make a POST/PUT request to your API
  // Example: return await fetch(`/api/client-portal/services/${serviceId}/reschedule`, {
  //   method: 'PUT',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify({ date: newDate, time: newTime }),
  // }).then(res => res.json())

  return { success: true }
}

/**
 * Fetch recent invoices for a client
 */
export async function fetchRecentInvoices(clientId: number) {
  if (!clientId) throw new Error("Client ID is required")

  await apiDelay()

  // In a real app, you would fetch this data from your API
  // Example: return await fetch(`/api/client-portal/invoices?clientId=${clientId}`).then(res => res.json())

  return mockRecentInvoices
}

/**
 * Download an invoice
 */
export async function downloadInvoice(invoiceId: number) {
  if (!invoiceId) throw new Error("Invoice ID is required")

  await apiDelay()

  // In a real app, you would trigger a file download
  // Example: window.location.href = `/api/client-portal/invoices/${invoiceId}/download`

  console.log(`Downloading invoice ${invoiceId}`)
  return true
}

/**
 * Fetch service history for a client
 */
export async function fetchServiceHistory(clientId: number) {
  if (!clientId) throw new Error("Client ID is required")

  await apiDelay()

  // In a real app, you would fetch this data from your API
  // Example: return await fetch(`/api/client-portal/history?clientId=${clientId}`).then(res => res.json())

  return mockServiceHistory
}

/**
 * Submit a review for a service
 */
export async function submitServiceReview(serviceId: number, rating: number, review: string) {
  if (!serviceId) throw new Error("Service ID is required")

  await apiDelay()

  // In a real app, you would make a POST request to your API
  // Example: return await fetch(`/api/client-portal/services/${serviceId}/review`, {
  //   method: 'POST',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify({ rating, review }),
  // }).then(res => res.json())

  return { success: true }
}

/**
 * Fetch messages for a client
 */
export async function fetchMessages(clientId: number) {
  if (!clientId) throw new Error("Client ID is required")

  await apiDelay()

  // In a real app, you would fetch this data from your API
  // Example: return await fetch(`/api/client-portal/messages?clientId=${clientId}`).then(res => res.json())

  return mockMessages
}

/**
 * Send a message
 */
export async function sendMessage(clientId: number, subject: string, message: string, type: string) {
  if (!clientId) throw new Error("Client ID is required")

  await apiDelay()

  // In a real app, you would make a POST request to your API
  // Example: return await fetch(`/api/client-portal/messages`, {
  //   method: 'POST',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify({ clientId, subject, message, type }),
  // }).then(res => res.json())

  const newMessage = {
    id: mockMessages.length + 1,
    subject,
    message,
    date: new Date().toISOString().split("T")[0],
    sender: "client",
    read: true,
  }

  // In a real app, this would be handled by the server
  mockMessages.unshift(newMessage)

  return { success: true, message: newMessage }
}

/**
 * Mark a message as read
 */
export async function markMessageAsRead(messageId: number) {
  if (!messageId) throw new Error("Message ID is required")

  await apiDelay(300)

  // In a real app, you would make a PUT request to your API
  // Example: return await fetch(`/api/client-portal/messages/${messageId}/read`, {
  //   method: 'PUT',
  // }).then(res => res.json())

  return { success: true }
}

/**
 * Fetch notifications for a client
 */
export async function fetchNotifications(clientId: number) {
  if (!clientId) throw new Error("Client ID is required")

  await apiDelay()

  // In a real app, you would fetch this data from your API
  // Example: return await fetch(`/api/client-portal/notifications?clientId=${clientId}`).then(res => res.json())

  return mockNotifications
}

/**
 * Mark a notification as read
 */
export async function markNotificationAsRead(notificationId: number) {
  if (!notificationId) throw new Error("Notification ID is required")

  await apiDelay(300)

  // In a real app, you would make a PUT request to your API
  // Example: return await fetch(`/api/client-portal/notifications/${notificationId}/read`, {
  //   method: 'PUT',
  // }).then(res => res.json())

  return { success: true }
}

/**
 * Update client profile
 */
export async function updateClientProfile(clientId: number, profileData: any) {
  if (!clientId) throw new Error("Client ID is required")

  await apiDelay()

  // In a real app, you would make a PUT request to your API
  // Example: return await fetch(`/api/client-portal/profile`, {
  //   method: 'PUT',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify({ clientId, ...profileData }),
  // }).then(res => res.json())

  // Update the current client
  if (currentClient && currentClient.id === clientId) {
    currentClient = { ...currentClient, ...profileData }

    // Update session storage
    if (typeof window !== "undefined") {
      sessionStorage.setItem("clientPortalAuth", JSON.stringify({ isAuthenticated, client: currentClient }))
    }
  }

  return { success: true }
}

/**
 * Request a new booking
 */
export async function requestBooking(clientId: number, bookingData: any) {
  if (!clientId) throw new Error("Client ID is required")

  await apiDelay()

  // In a real app, you would make a POST request to your API
  // Example: return await fetch(`/api/client-portal/bookings`, {
  //   method: 'POST',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify({ clientId, ...bookingData }),
  // }).then(res => res.json())

  const newBooking = {
    id: mockUpcomingServices.length + 1,
    serviceName: bookingData.service,
    date: bookingData.date,
    time: bookingData.time,
    duration: "2-3 hours", // Default duration
    status: "pending",
  }

  // In a real app, this would be handled by the server
  mockUpcomingServices.push(newBooking)

  return { success: true, booking: newBooking }
}

/**
 * Cancel a booking
 */
export async function cancelBooking(bookingId: number) {
  if (!bookingId) throw new Error("Booking ID is required")

  await apiDelay()

  // In a real app, you would make a DELETE request to your API
  // Example: return await fetch(`/api/client-portal/bookings/${bookingId}`, {
  //   method: 'DELETE',
  // }).then(res => res.json())

  return { success: true }
}

/**
 * Change password
 */
export async function changePassword(clientId: number, currentPassword: string, newPassword: string) {
  if (!clientId) throw new Error("Client ID is required")

  await apiDelay()

  // In a real app, you would make a POST request to your API
  // Example: return await fetch(`/api/client-portal/change-password`, {
  //   method: 'POST',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify({ clientId, currentPassword, newPassword }),
  // }).then(res => res.json())

  // Simple validation for demo
  if (currentPassword.length < 4 || newPassword.length < 4) {
    throw new Error("Password must be at least 4 characters")
  }

  return { success: true }
}

/**
 * Request password reset
 */
export async function requestPasswordReset(email: string) {
  await apiDelay()

  // In a real app, you would make a POST request to your API
  // Example: return await fetch(`/api/client-portal/reset-password`, {
  //   method: 'POST',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify({ email }),
  // }).then(res => res.json())

  return { success: true }
}

