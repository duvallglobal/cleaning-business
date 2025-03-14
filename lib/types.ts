export type Employee = {
  id: number
  name: string
  role: string
  email: string
  phone: string
  performance: number
  hoursThisMonth: number
  assignedJobs: number
  hourlyRate: number
  startDate: string
  employmentStatus: "active" | "terminated" | "laid_off" | "resigned"
  terminationDate?: string
  terminationReason?: string
  documents: Document[]
  training: TrainingRecord[]
  timeEntries: TimeEntry[]
}

export type Document = {
  id: number
  name: string
  type: string
  uploadDate: string
  url: string
  status: "valid" | "expired" | "pending"
}

export type TrainingRecord = {
  id: number
  courseName: string
  completionDate: string
  expiryDate: string
  status: "completed" | "in-progress" | "expired"
  certificateUrl?: string
}

export type TimeEntry = {
  id: number
  date: string
  startTime: string
  endTime: string
  breakDuration: number
  jobId?: number
  jobName?: string
  status: "pending" | "approved" | "rejected"
}

export type Team = {
  id: number
  name: string
  leadId: number
  memberIds: number[]
  assignedZone: string
}

// Add or update the Client type definition

export interface Client {
  id: number
  name: string
  email: string
  phone: string
  address: string
  isActive: boolean
  clientType: "regular" | "one-time"
  notes?: string
}

