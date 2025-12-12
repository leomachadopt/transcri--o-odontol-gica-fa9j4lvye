import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSpeechRecognition } from '@/hooks/use-speech-recognition'
import { useTranscriptionStore } from '@/stores/transcriptionStore'
import { useAuthStore } from '@/stores/authStore'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { toast } from 'sonner'
import { Mic, Square, Trash2, Copy, Save, AlertCircle } from 'lucide-react'
import { cn } from '@/lib/utils'

export default function Transcription() {
  const navigate = useNavigate()
  const { user } = useAuthStore()
  const { addTranscription } = useTranscriptionStore()
  const {
    isRecording,
    transcript,
    startRecording,
    stopRecording,
    resetTranscript,
    error,
    isSupported,
  } = useSpeechRecognition()

  const [localTranscript, setLocalTranscript] = useState('')

  useEffect(() => {
    setLocalTranscript(transcript)
  }, [transcript])

  useEffect(() => {
    if (error) {
      toast.error(error)
    }
  }, [error])

  const handleCopy = async () => {
    if (!localTranscript) return
    try {
      await navigator.clipboard.writeText(localTranscript)
      toast.success('Transcrição copiada para a área de transferência!')
    } catch (err) {
      toast.error('Falha ao copiar texto.')
    }
  }

  const handleSave = async () => {
    if (!user) return
    if (!localTranscript.trim()) {
      toast.error('Não é possível salvar uma transcrição vazia.')
      return
    }

    const success = await addTranscription({
      userId: user.id,
      text: localTranscript,
      timestamp: Date.now(),
    })

    if (success) {
      toast.success('Transcrição salva com sucesso!')
      navigate('/history')
    } else {
      toast.error('Erro ao salvar transcrição. Tente novamente.')
    }
  }

  const handleClear = () => {
    if (confirm('Tem certeza que deseja limpar todo o texto?')) {
      resetTranscript()
      setLocalTranscript('')
      toast.info('Texto limpo.')
    }
  }

  if (!isSupported) {
    return (
      <div className="container py-12 flex flex-col items-center justify-center text-center space-y-4">
        <AlertCircle className="h-16 w-16 text-destructive" />
        <h1 className="text-2xl font-bold">Navegador não suportado</h1>
        <p className="text-muted-foreground max-w-md">
          Desculpe, seu navegador não suporta a API de reconhecimento de fala
          necessária. Por favor, tente usar o Google Chrome, Edge ou Safari.
        </p>
        <Button onClick={() => navigate('/dashboard')}>
          Voltar ao Dashboard
        </Button>
      </div>
    )
  }

  return (
    <div className="container py-6 md:py-12 max-w-4xl space-y-8 animate-fade-in">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-gray-900">Nova Transcrição</h1>
        <p className="text-muted-foreground">
          Clique no botão abaixo para iniciar a gravação. Fale claramente para
          uma transcrição precisa.
        </p>
      </div>

      <Card className="relative min-h-[400px] p-6 md:p-8 flex flex-col gap-4 shadow-sm border-2 border-muted focus-within:border-primary/50 transition-colors bg-white">
        {localTranscript ? (
          <div className="flex-1 whitespace-pre-wrap text-lg leading-relaxed text-gray-800 animate-fade-in">
            {localTranscript}
            {isRecording && (
              <span className="inline-block w-2 h-4 ml-1 bg-primary animate-pulse align-middle" />
            )}
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center text-muted-foreground/50 text-xl font-medium select-none">
            {isRecording ? 'Ouvindo...' : 'Aguardando gravação...'}
          </div>
        )}
      </Card>

      <div className="flex flex-col items-center gap-4">
        {isRecording && (
          <div className="flex items-center gap-2 text-destructive animate-pulse font-medium">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-destructive opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-destructive"></span>
            </span>
            Gravando...
          </div>
        )}

        <div className="flex flex-wrap items-center justify-center gap-4 w-full">
          {!isRecording ? (
            <Button
              size="lg"
              className="h-14 px-8 rounded-full text-lg gap-2 shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
              onClick={startRecording}
            >
              <Mic className="h-6 w-6" />
              Iniciar Gravação
            </Button>
          ) : (
            <Button
              size="lg"
              variant="destructive"
              className="h-14 px-8 rounded-full text-lg gap-2 shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 relative overflow-visible"
              onClick={stopRecording}
            >
              <span className="absolute inset-0 rounded-full animate-pulse-ring"></span>
              <Square className="h-6 w-6 fill-current" />
              Parar Gravação
            </Button>
          )}
        </div>

        {/* Action Buttons Toolbar */}
        <div
          className={cn(
            'flex flex-wrap gap-2 transition-opacity duration-300',
            !localTranscript && !isRecording
              ? 'opacity-0 pointer-events-none'
              : 'opacity-100',
          )}
        >
          <Button
            variant="outline"
            onClick={handleClear}
            disabled={!localTranscript}
            title="Limpar texto"
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Limpar
          </Button>

          <Button
            variant="outline"
            onClick={handleCopy}
            disabled={!localTranscript}
            title="Copiar texto"
          >
            <Copy className="h-4 w-4 mr-2" />
            Copiar
          </Button>

          <Button
            onClick={handleSave}
            disabled={!localTranscript || isRecording}
            className="bg-secondary hover:bg-secondary/90 text-white"
            title="Salvar transcrição"
          >
            <Save className="h-4 w-4 mr-2" />
            Salvar Transcrição
          </Button>
        </div>
      </div>
    </div>
  )
}
