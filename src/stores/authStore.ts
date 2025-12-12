import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface User {
  id: string
  name: string
  email: string
  password?: string // In a real app, never store plain text passwords
}

interface AuthState {
  user: User | null
  isAuthenticated: boolean
  login: (user: User) => void
  logout: () => void
  users: User[] // Mock database of users
  register: (user: User) => boolean
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      users: [],
      login: (userData) => {
        set({ user: userData, isAuthenticated: true })
      },
      logout: () => {
        set({ user: null, isAuthenticated: false })
      },
      register: (newUser) => {
        const users = get().users
        if (users.some((u) => u.email === newUser.email)) {
          return false
        }
        set({ users: [...users, newUser] })
        return true
      },
    }),
    {
      name: 'dental-auth-storage',
    },
  ),
)
