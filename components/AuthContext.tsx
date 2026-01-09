"use client"
import React, { createContext, useContext, useState, useEffect, useLayoutEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { User } from '@/types/types'

interface AuthContextType {
    user: User | null
    isAuthenticated: boolean
    login: (username: string, password: string) => boolean
    logout: () => void
}

const AuthContext = createContext<AuthContextType>({
    user: null,
    isAuthenticated: false,
    login: () => false,
    logout: () => { },
})

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null)
    const router = useRouter()
    const pathname = usePathname()

    // Use simple effect for initial load to avoid hydration mismatch
    useEffect(() => {
        const stored = localStorage.getItem('wealth_user')
        if (stored) {
            try {
                setUser(JSON.parse(stored))
            } catch (e) {
                localStorage.removeItem('wealth_user')
            }
        }
    }, [])

    // Protect routes logic
    useEffect(() => {
        const isLoginPage = pathname === '/login'
        const stored = localStorage.getItem('wealth_user')

        if (!stored && !isLoginPage) {
            router.push('/login')
        } else if (stored && isLoginPage) {
            router.push('/dashboard')
        }
    }, [pathname, router, user])

    const login = (u: string, p: string) => {
        // Hardcoded credentials for local dev
        if (u === 'admin' && p === 'admin') {
            const userObj: User = { id: '1', username: 'Admin User' }
            setUser(userObj)
            localStorage.setItem('wealth_user', JSON.stringify(userObj))
            router.push('/dashboard')
            return true
        }
        return false
    }

    const logout = () => {
        setUser(null)
        localStorage.removeItem('wealth_user')
        router.push('/login')
    }

    return (
        <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, logout }}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => useContext(AuthContext)
