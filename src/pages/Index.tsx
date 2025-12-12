import { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from '@/components/ui/card'
import { Mic, Sparkles, Shield, Clock } from 'lucide-react'
import { LoginForm } from '@/components/auth/LoginForm'
import { RegisterForm } from '@/components/auth/RegisterForm'

export default function Index() {
  const [isLogin, setIsLogin] = useState(true)

  return (
    <div className="min-h-[calc(100vh-8rem)] relative overflow-hidden">
      {/* Animated gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-muted/30 to-background">
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-secondary/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>

      <div className="relative z-10 flex items-center justify-center p-4 min-h-[calc(100vh-8rem)]">
        <div className="w-full max-w-6xl grid lg:grid-cols-2 gap-8 items-center">
          {/* Left side - Welcome/Features */}
          <div className="hidden lg:flex flex-col gap-8 animate-fade-in-up">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium">
                <Sparkles size={16} />
                <span>Tecnologia de ponta em transcrição</span>
              </div>
              <h1 className="text-5xl font-bold text-foreground font-display tracking-tight leading-tight">
                Transcrições de Evoluções
                <span className="block text-3xl mt-2 text-muted-foreground font-normal">
                  Clínica Integrada Cristiane Martins Kids & Family
                </span>
              </h1>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Transforme seus áudios odontológicos em textos precisos com tecnologia de inteligência artificial avançada.
              </p>
            </div>

            <div className="grid gap-4">
              <div className="flex items-start gap-4 p-4 rounded-2xl bg-card/50 border border-border/40 shadow-modern hover:shadow-modern-lg transition-all duration-300">
                <div className="w-12 h-12 rounded-xl gradient-primary flex items-center justify-center flex-shrink-0">
                  <Mic size={20} className="text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-1">Transcrição Inteligente</h3>
                  <p className="text-sm text-muted-foreground">Converta áudios em texto com alta precisão e contexto odontológico.</p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 rounded-2xl bg-card/50 border border-border/40 shadow-modern hover:shadow-modern-lg transition-all duration-300">
                <div className="w-12 h-12 rounded-xl gradient-primary flex items-center justify-center flex-shrink-0">
                  <Shield size={20} className="text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-1">Segurança Total</h3>
                  <p className="text-sm text-muted-foreground">Seus dados protegidos com criptografia de ponta a ponta.</p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 rounded-2xl bg-card/50 border border-border/40 shadow-modern hover:shadow-modern-lg transition-all duration-300">
                <div className="w-12 h-12 rounded-xl gradient-primary flex items-center justify-center flex-shrink-0">
                  <Clock size={20} className="text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-1">Economia de Tempo</h3>
                  <p className="text-sm text-muted-foreground">Aumente sua produtividade e foque no que realmente importa.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right side - Auth Card */}
          <Card className="w-full max-w-md mx-auto glass-effect shadow-modern-lg animate-fade-in-up border-0 overflow-hidden" style={{ animationDelay: '0.2s' }}>
            <div className="absolute top-0 left-0 right-0 h-1 gradient-primary"></div>

            <CardHeader className="text-center space-y-4 pt-8">
              <div className="mx-auto w-20 h-20 rounded-3xl flex items-center justify-center mb-2 shadow-modern-lg animate-float relative overflow-hidden bg-white">
                <img 
                  src="/logo.png" 
                  alt="Logo Clínica Integrada Cristiane Martins Kids & Family" 
                  className="w-full h-full object-contain p-2"
                />
                <div className="absolute inset-0 rounded-3xl bg-white/10"></div>
              </div>
              <CardTitle className="text-3xl font-bold text-foreground font-display">
                {isLogin ? 'Bem-vindo de volta' : 'Criar conta'}
              </CardTitle>
              <CardDescription className="text-base">
                {isLogin
                  ? 'Acesse suas transcrições de evoluções'
                  : 'Comece a transcrever seus áudios hoje'}
              </CardDescription>
            </CardHeader>

            <CardContent className="px-8">
              {isLogin ? (
                <LoginForm />
              ) : (
                <RegisterForm onSuccess={() => setIsLogin(true)} />
              )}
            </CardContent>

            <CardFooter className="flex flex-col items-center justify-center space-y-4 px-8 pb-8 pt-4">
              <div className="relative w-full text-center">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-border/60" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-card px-3 text-muted-foreground font-medium tracking-wide">
                    ou
                  </span>
                </div>
              </div>
              <div className="flex flex-col items-center gap-3 w-full">
                <p className="text-sm text-muted-foreground">
                  {isLogin ? 'Ainda não tem uma conta?' : 'Já tem uma conta?'}
                </p>
                <Button
                  variant="outline"
                  className="w-full border-primary/30 hover:bg-primary/10 hover:text-primary hover:border-primary transition-all duration-300 rounded-xl h-11 font-medium"
                  onClick={() => setIsLogin(!isLogin)}
                >
                  {isLogin ? 'Criar Nova Conta' : 'Fazer Login'}
                </Button>
              </div>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  )
}
