"use client"

import React, { createContext, useContext, useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import type { User } from "@/types"
import { authService } from "@/services/auth.service"
import type { LoginCredentials } from "@/services/auth.service"
import { authStorage } from "@/lib/auth-storage"

interface AuthContextType {
  user: User | null
  isLoading: boolean
  isAuthenticated: boolean
  login: (credentials: LoginCredentials, redirectTo?: string) => Promise<void>
  verifyRegistrationOtp: (userAccountId: string, code: string) => Promise<void>
  refreshUser: () => Promise<User>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    authStorage.clearLegacyStorage()
    if (!authStorage.getAccessToken()) {
      setIsLoading(false)
      return
    }

    authService
      .getMe()
      .then(({ user: currentUser }) => setUser(currentUser))
      .catch(() => {
        authStorage.clearTokens()
        setUser(null)
      })
      .finally(() => setIsLoading(false))
  }, [])

  const login = async (credentials: LoginCredentials, redirectTo = "/portal/profile") => {
    setIsLoading(true)
    try {
      const authenticatedUser = await authService.login(credentials)
      setUser(authenticatedUser)
      router.replace(redirectTo)
    } finally {
      setIsLoading(false)
    }
  }

  const verifyRegistrationOtp = async (userAccountId: string, code: string) => {
    setIsLoading(true)
    try {
      const authenticatedUser = await authService.verifyRegistrationOtp(userAccountId, code)
      setUser(authenticatedUser)
    } finally {
      setIsLoading(false)
    }
  }

  const refreshUser = async () => {
    const { user: currentUser } = await authService.getMe()
    setUser(currentUser)
    return currentUser
  }

  const logout = () => {
    authService.logout()
    setUser(null)
    router.replace("/auth/login")
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: Boolean(user),
        login,
        verifyRegistrationOtp,
        refreshUser,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
