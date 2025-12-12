import { useAuthStore } from '@/stores/authStore'
import { useTranscriptionStore } from '@/stores/transcriptionStore'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/components/ui/card'
import { Mic, FileText, ArrowRight, Calendar } from 'lucide-react'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'

export default function Dashboard() {
  const { user } = useAuthStore()
  const { getUserTranscriptions } = useTranscriptionStore()

  const transcriptions = user ? getUserTranscriptions(user.id) : []
  const recentTranscriptions = transcriptions.slice(0, 3)

  return (
    <div className="container py-8 space-y-8 animate-fade-in">
      {/* Greeting Section */}
      <section className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">
          Olá, {user?.name?.split(' ')[0]}!
        </h1>
        <p className="text-muted-foreground text-lg">
          Pronto para sua próxima transcrição?
        </p>
      </section>

      {/* Primary Action */}
      <section>
        <Card className="bg-primary/5 border-primary/20">
          <CardContent className="flex flex-col md:flex-row items-center justify-between p-8 gap-6">
            <div className="space-y-2 text-center md:text-left">
              <h2 className="text-2xl font-bold text-gray-900">
                Iniciar Nova Transcrição
              </h2>
              <p className="text-muted-foreground max-w-md">
                Comece a gravar agora mesmo e tenha seu áudio convertido em
                texto em tempo real.
              </p>
            </div>
            <Button
              size="lg"
              className="h-14 px-8 text-lg gap-2 shadow-lg hover:shadow-xl transition-all"
              asChild
            >
              <Link to="/transcription">
                <Mic className="h-6 w-6" />
                Iniciar Gravação
              </Link>
            </Button>
          </CardContent>
        </Card>
      </section>

      {/* Recent Transcriptions */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900">
            Minhas Últimas Transcrições
          </h2>
          <Button variant="link" asChild className="text-primary">
            <Link to="/history">
              Ver Todo o Histórico <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </Button>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {recentTranscriptions.length > 0 ? (
            recentTranscriptions.map((transcription) => (
              <Card
                key={transcription.id}
                className="hover:shadow-md transition-shadow flex flex-col"
              >
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                    <Calendar className="h-4 w-4" />
                    {format(
                      new Date(transcription.timestamp),
                      "d 'de' MMMM 'às' HH:mm",
                      {
                        locale: ptBR,
                      },
                    )}
                  </div>
                  <CardTitle className="text-lg">
                    Transcrição de{' '}
                    {format(new Date(transcription.timestamp), 'dd/MM/yyyy')}
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex-1 pb-3">
                  <p className="text-sm text-muted-foreground line-clamp-3">
                    {transcription.text}
                  </p>
                </CardContent>
                <CardFooter>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full"
                    asChild
                  >
                    <Link
                      to="/history"
                      state={{ highlightId: transcription.id }}
                    >
                      <FileText className="mr-2 h-4 w-4" /> Ver Completo
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            ))
          ) : (
            <Card className="col-span-full py-8 text-center bg-muted/30 border-dashed">
              <CardContent className="space-y-3">
                <div className="mx-auto w-12 h-12 bg-muted rounded-full flex items-center justify-center text-muted-foreground">
                  <FileText className="h-6 w-6" />
                </div>
                <p className="text-muted-foreground">
                  Nenhuma transcrição encontrada.
                </p>
                <Button variant="link" asChild>
                  <Link to="/transcription">Que tal iniciar uma nova?</Link>
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </section>
    </div>
  )
}
