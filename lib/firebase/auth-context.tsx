"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"
import {
  type User,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
} from "firebase/auth"
import { auth } from "./firebase"
import { getDocument, createDocumentWithId } from "./firestore"

interface AuthUser extends User {
  role?: string
  uid: string
  displayName: string | null
  email: string | null
}

interface AuthContextType {
  user: AuthUser | null
  loading: boolean
  signUp: (email: string, password: string, displayName?: string) => Promise<AuthUser>
  signIn: (email: string, password: string) => Promise<AuthUser>
  logOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | null>(null)

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        // Get user role from Firestore
        try {
          const userData = await getDocument("users", firebaseUser.uid)
          const authUser = {
            ...firebaseUser,
            role: userData?.role || "client",
          } as AuthUser

          setUser(authUser)
        } catch (error) {
          console.error("Error getting user data:", error)
          setUser(firebaseUser as AuthUser)
        }
      } else {
        setUser(null)
      }
      setLoading(false)
    })

    return () => unsubscribe()
  }, [])

  const signUp = async (email: string, password: string, displayName?: string) => {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password)
    const firebaseUser = userCredential.user

    // Update profile if displayName is provided
    if (displayName) {
      await updateProfile(firebaseUser, { displayName })
    }

    // Create user document in Firestore
    await createDocumentWithId("users", firebaseUser.uid, {
      email: firebaseUser.email,
      displayName: displayName || firebaseUser.email?.split("@")[0],
      role: "client", // Default role
      createdAt: new Date(),
    })

    const authUser = {
      ...firebaseUser,
      role: "client",
    } as AuthUser

    setUser(authUser)
    return authUser
  }

  const signIn = async (email: string, password: string) => {
    const userCredential = await signInWithEmailAndPassword(auth, email, password)
    const firebaseUser = userCredential.user

    // Get user role from Firestore
    const userData = await getDocument("users", firebaseUser.uid)

    const authUser = {
      ...firebaseUser,
      role: userData?.role || "client",
    } as AuthUser

    setUser(authUser)
    return authUser
  }

  const logOut = async () => {
    await signOut(auth)
    setUser(null)
  }

  return <AuthContext.Provider value={{ user, loading, signUp, signIn, logOut }}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

