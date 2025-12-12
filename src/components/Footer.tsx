import { Heart } from 'lucide-react'

export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="w-full border-t border-border/40 bg-gradient-to-b from-background to-muted/20">
      <div className="container py-8">
        <div className="flex flex-col items-center justify-center gap-4 text-center">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span className="font-medium">Transcrições Dentárias</span>
            <span>•</span>
            <span className="font-light">Clínica Integrada</span>
          </div>

          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>© {currentYear} Todos os direitos reservados</span>
          </div>

          <div className="flex items-center gap-1.5 text-xs text-muted-foreground/70">
            <span>Desenvolvido com</span>
            <Heart size={12} className="text-primary fill-primary animate-pulse" />
            <span>para profissionais da saúde</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
