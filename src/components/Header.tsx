import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuthStore } from '@/stores/authStore'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import { Menu, User, LogOut, History, Mic, LayoutDashboard, Shield } from 'lucide-react'

export function Header() {
  const { user, isAuthenticated, logout } = useAuthStore()
  const navigate = useNavigate()
  const [isOpen, setIsOpen] = useState(false)

  const handleLogout = () => {
    logout()
    navigate('/')
    setIsOpen(false)
  }

  const UserAvatar = () => (
    <div className="flex items-center justify-center w-10 h-10 rounded-full gradient-primary text-white font-semibold text-sm shadow-modern hover:shadow-modern-lg transition-all duration-300">
      {user?.name ? user.name.charAt(0).toUpperCase() : <User size={18} />}
    </div>
  )

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 glass-effect shadow-modern">
      <div className="container flex h-20 items-center justify-between">
        <Link
          to={isAuthenticated ? '/dashboard' : '/'}
          className="flex items-center gap-3 group transition-all duration-300"
        >
          <div className="relative w-12 h-12 gradient-primary rounded-2xl flex items-center justify-center text-white shadow-modern group-hover:shadow-modern-lg transition-all duration-300 animate-float">
            <Mic size={22} className="group-hover:scale-110 transition-transform duration-300" />
            <div className="absolute inset-0 rounded-2xl bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </div>
          <div className="hidden sm:flex flex-col">
            <span className="text-xl font-bold text-foreground font-display tracking-tight">
              Transcrições Dentárias
            </span>
            <span className="text-xs text-muted-foreground font-light tracking-wide">
              Clínica Integrada
            </span>
          </div>
        </Link>

        {isAuthenticated && (
          <>
            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-2 text-sm font-medium">
              <Link
                to="/dashboard"
                className="px-4 py-2 rounded-xl hover:bg-primary/5 hover:text-primary transition-all duration-300 flex items-center gap-2 text-muted-foreground"
              >
                <LayoutDashboard size={18} />
                <span className="font-medium">Dashboard</span>
              </Link>
              <Link
                to="/transcription"
                className="px-4 py-2 rounded-xl hover:bg-primary/5 hover:text-primary transition-all duration-300 flex items-center gap-2 text-muted-foreground"
              >
                <Mic size={18} />
                <span className="font-medium">Nova Transcrição</span>
              </Link>
              <Link
                to="/history"
                className="px-4 py-2 rounded-xl hover:bg-primary/5 hover:text-primary transition-all duration-300 flex items-center gap-2 text-muted-foreground"
              >
                <History size={18} />
                <span className="font-medium">Histórico</span>
              </Link>
              {user?.role === 'admin' && (
                <Link
                  to="/admin"
                  className="px-4 py-2 rounded-xl hover:bg-primary/5 hover:text-primary transition-all duration-300 flex items-center gap-2 text-muted-foreground"
                >
                  <Shield size={18} />
                  <span className="font-medium">Admin</span>
                </Link>
              )}
            </nav>

            <div className="flex items-center gap-4">
              {/* User Menu Desktop */}
              <div className="hidden md:block">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      className="relative h-8 w-8 rounded-full p-0"
                    >
                      <UserAvatar />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem className="text-muted-foreground cursor-default font-semibold">
                      {user?.name}
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={handleLogout}
                      className="cursor-pointer text-destructive"
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      Sair
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              {/* Mobile Menu */}
              <div className="md:hidden">
                <Sheet open={isOpen} onOpenChange={setIsOpen}>
                  <SheetTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <Menu className="h-6 w-6" />
                      <span className="sr-only">Toggle menu</span>
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="right">
                    <SheetHeader>
                      <SheetTitle className="text-left">Menu</SheetTitle>
                    </SheetHeader>
                    <div className="flex flex-col gap-4 mt-6">
                      <div className="flex items-center gap-3 px-2 py-2 mb-4 bg-muted/50 rounded-lg">
                        <UserAvatar />
                        <div className="flex flex-col">
                          <span className="font-medium text-sm">
                            {user?.name}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {user?.email}
                          </span>
                        </div>
                      </div>

                      <Link
                        to="/dashboard"
                        onClick={() => setIsOpen(false)}
                        className="flex items-center gap-2 text-lg font-medium hover:text-primary"
                      >
                        <LayoutDashboard size={20} /> Dashboard
                      </Link>
                      <Link
                        to="/transcription"
                        onClick={() => setIsOpen(false)}
                        className="flex items-center gap-2 text-lg font-medium hover:text-primary"
                      >
                        <Mic size={20} /> Nova Transcrição
                      </Link>
                      <Link
                        to="/history"
                        onClick={() => setIsOpen(false)}
                        className="flex items-center gap-2 text-lg font-medium hover:text-primary"
                      >
                        <History size={20} /> Histórico
                      </Link>
                      {user?.role === 'admin' && (
                        <Link
                          to="/admin"
                          onClick={() => setIsOpen(false)}
                          className="flex items-center gap-2 text-lg font-medium hover:text-primary"
                        >
                          <Shield size={20} /> Administração
                        </Link>
                      )}
                      <Button
                        variant="destructive"
                        className="mt-4 w-full justify-start"
                        onClick={handleLogout}
                      >
                        <LogOut className="mr-2 h-4 w-4" />
                        Sair
                      </Button>
                    </div>
                  </SheetContent>
                </Sheet>
              </div>
            </div>
          </>
        )}
      </div>
    </header>
  )
}
