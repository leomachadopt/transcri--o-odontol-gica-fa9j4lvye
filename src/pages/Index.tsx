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
import { Mic } from 'lucide-react'
import { LoginForm } from '@/components/auth/LoginForm'
import { RegisterForm } from '@/components/auth/RegisterForm'

export default function Index() {
  const [isLogin, setIsLogin] = useState(true)

  return (
    <div className="min-h-[calc(100vh-8rem)] flex items-center justify-center p-4 bg-muted/30">
      <Card className="w-full max-w-md shadow-lg animate-fade-in-up border-t-4 border-t-primary">
        <CardHeader className="text-center space-y-2">
          <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-2 shadow-inner">
            <Mic className="text-primary h-8 w-8" />
          </div>
          <CardTitle className="text-2xl font-bold text-gray-900">
            {isLogin ? 'Bem-vindo(a) de volta' : 'Crie sua conta'}
          </CardTitle>
          <CardDescription className="text-base">
            {isLogin
              ? 'Acesse suas transcrições dentárias'
              : 'Comece a transcrever seus áudios hoje'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLogin ? (
            <LoginForm />
          ) : (
            <RegisterForm onSuccess={() => setIsLogin(true)} />
          )}
        </CardContent>
        <CardFooter className="flex flex-col items-center justify-center space-y-4 bg-gray-50/50 p-6 rounded-b-lg border-t">
          <div className="relative w-full text-center">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-gray-200" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-gray-50/50 px-2 text-muted-foreground font-medium">
                ou
              </span>
            </div>
          </div>
          <div className="flex flex-col items-center gap-2 w-full">
            <p className="text-sm text-muted-foreground">
              {isLogin ? 'Não tem uma conta?' : 'Já tem uma conta?'}
            </p>
            <Button
              variant="outline"
              className="w-full border-primary/20 hover:bg-primary/5 hover:text-primary transition-colors"
              onClick={() => setIsLogin(!isLogin)}
            >
              {isLogin ? 'Criar Nova Conta' : 'Fazer Login'}
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}
