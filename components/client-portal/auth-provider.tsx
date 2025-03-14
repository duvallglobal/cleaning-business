"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import { useRouter, usePathname } from "next/navigation"
import { useAuth } from "@/lib/firebase/auth-context"
import { getDocument, createDocumentWithId } from "@/lib/firebase/firestore"

interface Client {
  id: number
  name: string
  email: string
  phone?: string
  address?: string
}

interface ClientAuthContextType {
  client: Client | null
  isLoading: boolean
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => Promise<void>
}

const ClientAuthContext = createContext<ClientAuthContextType | undefined>(undefined)

export function ClientAuthProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const pathname = usePathname()
  const { user, signIn, logOut: firebaseLogout, loading } = useAuth()
  const [client, setClient] = useState<Client | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  // Check for existing session on mount
  useEffect(() => {
    const checkAuth = async () => {
      if (loading) return

      try {
        if (user && user.role === "client") {
          // Get client data from Firestore
          const clientData = await getDocument("clients", user.uid)

          if (clientData) {
            setClient({
              id: Number.parseInt(clientData.id),
              name: user.displayName || "",
              email: user.email || "",
              phone: clientData.phone,
              address: clientData.address,
            })
            setIsAuthenticated(true)
          } else {
            // Create client profile if it doesn't exist
            await createDocumentWithId("clients", user.uid, {
              name: user.displayName,
              email: user.email,
              role: "client",
            })

            setClient({
              id: Number.parseInt(user.uid),
              name: user.displayName || "",
              email: user.email || "",
            })
            setIsAuthenticated(true)
          }
        } else if (pathname !== "/client-portal/login" && !pathname.includes("/client-portal/reset-password")) {
          router.push("/client-portal/login")
        }
      } catch (error) {
        console.error("Auth check error:", error)
        if (pathname !== "/client-portal/login" && !pathname.includes("/client-portal/reset-password")) {
          router.push("/client-portal/login")
        }
      } finally {
        setIsLoading(false)
      }
    }

    checkAuth()
  }, [user, loading, pathname, router])

  const login = async (email: string, password: string) => {
    setIsLoading(true)
    try {
      const userData = await signIn(email, password)

      if (userData.role !== "client") {
        throw new Error("Access denied. This portal is for clients only.")
      }

      // Get client data from Firestore
      const clientData = await getDocument("clients", userData.uid)

      if (clientData) {
        setClient({
          id: Number.parseInt(userData.uid),
          name: userData.displayName || "",
          email: userData.email || "",
          phone: clientData.phone,
          address: clientData.address,
        })
      } else {
        // Create client profile if it doesn't exist
        await createDocumentWithId("clients", userData.uid, {
          name: userData.displayName,
          email: userData.email,
          role: "client",
        })

        setClient({
          id: Number.parseInt(userData.uid),
          name: userData.displayName || "",
          email: userData.email || "",
        })
      }

      setIsAuthenticated(true)
    } catch (error) {
      console.error("Login error:", error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const logout = async () => {
    setIsLoading(true)
    try {
      await firebaseLogout()
      setClient(null)
      setIsAuthenticated(false)
      router.push("/client-portal/login")
    } catch (error) {
      console.error("Logout error:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <ClientAuthContext.Provider value={{ client, isLoading, isAuthenticated, login, logout }}>
      {children}
    </ClientAuthContext.Provider>
  )
}

export function useClientAuth() {
  const context = useContext(ClientAuthContext)
  if (context === undefined) {
    throw new Error("useClientAuth must be used within a ClientAuthProvider")
  }
  return context
}

