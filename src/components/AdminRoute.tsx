import { useEffect } from 'react'
import { useAuthStore } from '@/stores/authStore'
import { Navigate, Outlet } from 'react-router-dom'

export function AdminRoute() {
  const { user, isAuthenticated, checkAuth, isLoading } = useAuthStore()

  // Verificar autenticação
  useEffect(() => {
    if (!isAuthenticated) {
      checkAuth()
    }
  }, [isAuthenticated, checkAuth])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-muted-foreground">Carregando...</div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return <Navigate to="/" replace />
  }

  if (user?.role !== 'admin') {
    return <Navigate to="/dashboard" replace />
  }

  return <Outlet />
}

