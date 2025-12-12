import { useState, useMemo, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { useAuthStore } from '@/stores/authStore'
import {
  useTranscriptionStore,
  Transcription,
} from '@/stores/transcriptionStore'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/components/ui/card'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { toast } from 'sonner'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import {
  Search,
  Copy,
  Trash2,
  ChevronDown,
  ChevronUp,
  Calendar,
} from 'lucide-react'
import { cn } from '@/lib/utils'

export default function History() {
  const { user } = useAuthStore()
  const { getUserTranscriptions, deleteTranscription, fetchTranscriptions, isLoading } = useTranscriptionStore()
  const [searchTerm, setSearchTerm] = useState('')
  const [expandedId, setExpandedId] = useState<string | null>(null)

  const location = useLocation()
  const highlightId = location.state?.highlightId as string | undefined

  useEffect(() => {
    if (user) {
      fetchTranscriptions()
    }
  }, [user, fetchTranscriptions])

  const transcriptions = useMemo(() => {
    return user ? getUserTranscriptions(user.id) : []
  }, [user, getUserTranscriptions])

  const filteredTranscriptions = useMemo(() => {
    if (!searchTerm) return transcriptions
    const lowerTerm = searchTerm.toLowerCase()
    return transcriptions.filter((t) =>
      t.text.toLowerCase().includes(lowerTerm),
    )
  }, [transcriptions, searchTerm])

  useEffect(() => {
    if (highlightId) {
      setExpandedId(highlightId)
      // Scroll to element after a brief delay to ensure rendering
      setTimeout(() => {
        const element = document.getElementById(`transcription-${highlightId}`)
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'center' })
          element.classList.add('ring-2', 'ring-primary', 'ring-offset-2')
          setTimeout(() => {
            element.classList.remove('ring-2', 'ring-primary', 'ring-offset-2')
          }, 2000)
        }
      }, 100)
    }
  }, [highlightId])

  const handleDelete = async (id: string) => {
    const success = await deleteTranscription(id)
    if (success) {
      toast.success('Transcrição excluída com sucesso!')
      if (expandedId === id) setExpandedId(null)
    } else {
      toast.error('Erro ao excluir transcrição. Tente novamente.')
    }
  }

  const handleCopy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      toast.success('Texto copiado para a área de transferência!')
    } catch (err) {
      toast.error('Erro ao copiar texto.')
    }
  }

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id)
  }

  return (
    <div className="container py-8 space-y-8 animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h1 className="text-3xl font-bold text-gray-900">
          Histórico de Transcrições
        </h1>

        <div className="relative w-full md:w-72">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por palavras-chave..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      <div className="space-y-4">
        {filteredTranscriptions.length > 0 ? (
          filteredTranscriptions.map((transcription) => (
            <Card
              key={transcription.id}
              id={`transcription-${transcription.id}`}
              className={cn(
                'transition-all duration-300',
                expandedId === transcription.id
                  ? 'shadow-md'
                  : 'shadow-sm hover:shadow-md',
              )}
            >
              <CardHeader
                className="cursor-pointer"
                onClick={() => toggleExpand(transcription.id)}
              >
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      {format(
                        new Date(transcription.timestamp),
                        "dd 'de' MMMM 'de' yyyy, HH:mm",
                        {
                          locale: ptBR,
                        },
                      )}
                    </CardTitle>
                  </div>
                  {expandedId === transcription.id ? (
                    <ChevronUp className="h-5 w-5 text-muted-foreground" />
                  ) : (
                    <ChevronDown className="h-5 w-5 text-muted-foreground" />
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <div
                  className={cn(
                    'text-gray-700 whitespace-pre-wrap transition-all duration-300 overflow-hidden',
                    expandedId === transcription.id
                      ? 'max-h-[2000px] opacity-100'
                      : 'max-h-24 opacity-80',
                  )}
                >
                  {transcription.text}
                </div>
                {expandedId !== transcription.id && (
                  <div className="absolute bottom-16 left-0 w-full h-12 bg-gradient-to-t from-white to-transparent pointer-events-none" />
                )}
              </CardContent>
              <CardFooter className="flex justify-between border-t pt-4 bg-gray-50/50">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => toggleExpand(transcription.id)}
                >
                  {expandedId === transcription.id ? 'Ocultar' : 'Ver Completo'}
                </Button>

                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleCopy(transcription.text)}
                  >
                    <Copy className="h-4 w-4 mr-2" />
                    Copiar
                  </Button>

                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-destructive hover:text-destructive hover:bg-destructive/10 border-destructive/20"
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Excluir
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Tem certeza?</AlertDialogTitle>
                        <AlertDialogDescription>
                          Esta ação não pode ser desfeita. Isso excluirá
                          permanentemente a transcrição do seu histórico local.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => handleDelete(transcription.id)}
                          className="bg-destructive hover:bg-destructive/90"
                        >
                          Excluir
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </CardFooter>
            </Card>
          ))
        ) : (
          <div className="text-center py-12 bg-muted/30 rounded-lg border-2 border-dashed">
            <p className="text-muted-foreground text-lg mb-4">
              {searchTerm
                ? 'Nenhuma transcrição encontrada para sua busca.'
                : 'Você ainda não possui transcrições salvas.'}
            </p>
            {!searchTerm && (
              <Button asChild>
                <a href="/transcription">Iniciar Nova Transcrição</a>
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
