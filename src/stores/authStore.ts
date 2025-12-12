import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { authAPI } from '@/lib/api'

export interface User {
  id: string
  name: string
  email: string
  role?: 'user' | 'admin'
}

interface AuthState {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
  login: (user: User, token: string) => void
  logout: () => void
  register: (name: string, email: string, password: string) => Promise<boolean>
  loginWithCredentials: (email: string, password: string) => Promise<boolean>
  checkAuth: () => Promise<void>
  clearError: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
      login: (userData, token) => {
        localStorage.setItem('auth_token', token)
        set({ user: userData, isAuthenticated: true, error: null })
      },
      logout: () => {
        localStorage.removeItem('auth_token')
        set({ user: null, isAuthenticated: false, error: null })
      },
      register: async (name, email, password) => {
        set({ isLoading: true, error: null })
        try {
          const response = await authAPI.register(name, email, password)
          get().login(response.user, response.token)
          set({ isLoading: false })
          return true
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Erro ao criar conta'
          set({ error: errorMessage, isLoading: false })
          return false
        }
      },
      loginWithCredentials: async (email, password) => {
        set({ isLoading: true, error: null })
        try {
          const response = await authAPI.login(email, password)
          get().login(response.user, response.token)
          set({ isLoading: false })
          return true
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Email ou senha incorretos'
          set({ error: errorMessage, isLoading: false })
          return false
        }
      },
      checkAuth: async () => {
        const token = localStorage.getItem('auth_token')
        if (!token) {
          set({ user: null, isAuthenticated: false })
          return
        }

        set({ isLoading: true })
        try {
          const response = await authAPI.getMe()
          set({ user: response.user, isAuthenticated: true, isLoading: false })
        } catch (error) {
          // Token inválido ou expirado
          localStorage.removeItem('auth_token')
          set({ user: null, isAuthenticated: false, isLoading: false })
        }
      },
      clearError: () => {
        set({ error: null })
      },
    }),
    {
      name: 'dental-auth-storage',
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    },
  ),
)
