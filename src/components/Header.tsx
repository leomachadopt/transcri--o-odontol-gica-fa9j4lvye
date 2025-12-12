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
import { Menu, User, LogOut, History, Mic, LayoutDashboard } from 'lucide-react'

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
    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-200 text-gray-700 font-semibold text-sm">
      {user?.name ? user.name.charAt(0).toUpperCase() : <User size={16} />}
    </div>
  )

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 shadow-sm">
      <div className="container flex h-16 items-center justify-between">
        <Link
          to={isAuthenticated ? '/dashboard' : '/'}
          className="flex items-center gap-2"
        >
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white">
            <Mic size={18} />
          </div>
          <span className="text-xl font-bold text-foreground hidden sm:inline-block">
            Transcrições Dentárias
          </span>
        </Link>

        {isAuthenticated && (
          <>
            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-muted-foreground">
              <Link
                to="/dashboard"
                className="hover:text-primary transition-colors flex items-center gap-2"
              >
                <LayoutDashboard size={16} /> Dashboard
              </Link>
              <Link
                to="/transcription"
                className="hover:text-primary transition-colors flex items-center gap-2"
              >
                <Mic size={16} /> Nova Transcrição
              </Link>
              <Link
                to="/history"
                className="hover:text-primary transition-colors flex items-center gap-2"
              >
                <History size={16} /> Histórico
              </Link>
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
